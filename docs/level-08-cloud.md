# Nivel 8 — Producción y cloud con IA ☁️

> **Meta:** Llevar un sistema local a producción en la nube usando IA. Aprender a generar y validar infraestructura como código — pero sobre todo, aprender a **probar** que tu validador detecta la infraestructura rota.
>
> **Dificultad:** Avanzado | **Proyectos:** 4 (2 core + 1 profundidad + 1 stretch) | **Tiempo estimado:** 4-5 horas
>
> **Nota:** este nivel extiende el sistema del **Nivel 7** (mismo folder, ADR-001). Reusás los microservicios ya construidos.

---

## 🧠 Teoría — IA en infraestructura: traducir, no diseñar

### El rol de la IA en cloud

La IA es excelente para **traducir descripciones a infraestructura como código** (IaC). Le decís "quiero 3 servicios con health checks y un ALB" y te genera un CloudFormation template. Es un patrón conocido — la IA lo vio millones de veces en training data.

Lo que la IA **no** debería hacer es decidir la arquitectura de cloud:
- ¿Cuántas AZs necesito?
- ¿Qué tamaño de instancia?
- ¿Multi-AZ RDS o una sola?
- ¿Auto-scaling o fixed capacity?

Esas son decisiones de costo, disponibilidad, y contexto de negocio — las toma un humano.

### La traducción como patrón

```
Descripción humana → [IA] → Config de infraestructura
```

Este patrón funciona porque la IA conoce los formatos (YAML, JSON, Dockerfile) y las convenciones de cada servicio (ECS, ALB, VPC, RDS). Lo que necesita es que le des **la especificación exacta**:

| Especificación | Ejemplo |
|----------------|---------|
| Servicios | "users-service en puerto 3001" |
| Red | "VPC con 2 AZs, subnets públicas" |
| Compute | "ECS con Fargate, 0.25 vCPU, 512MB" |
| Networking | "ALB que enruta /users/* al users-service" |
| Persistencia | "Sin DB, en memoria (demo)" |
| Seguridad | "Security groups mínimos, solo el ALB accesible" |

### Validación cruzada con IA

Un CloudFormation template puede ser sintácticamente válido pero semánticamente incorrecto:

- Puerto de container que no coincide con el target group del ALB
- Security group que no abre el puerto correcto
- Health check apuntando a una ruta que no existe
- Secrets en variables de entorno hardcodeadas
- CPU/memoria que no cumplen el mínimo de Fargate

La IA puede hacer **validación cruzada**: comparar el template con la especificación y detectar inconsistencias. Es el mismo patrón de "detectores + análisis contextual" que ya vimos en niveles anteriores, pero aplicado a infra.

### El tema que este nivel lleva al extremo

Los niveles 3, 6 y 7 te enseñaron: **"un gate que no podés testear no es un gate."** Acá se aplica literal:

- El validador (`validate.js`) es un **gate** entre tu template y producción.
- Un gate que no probaste contra un template roto te da **falsa seguridad** — creés que tu infra es válida porque "el validador pasó", pero el validador puede no detectar el error.
- La prueba de fuego: **rompé el template a propósito y confirmá que el validador lo agarra.**

El error de infraestructura más caro no es el que detectás — es el que tu validador **no** detecta y que se descubre en producción, a las 3 AM, con el sistema caído.

### Docker como puente

Docker es el puente entre desarrollo local y producción. Dockeriza tu sistema, probalo local, y el mismo container sube a AWS. La IA puede:

- Generar Dockerfiles eficientes (multi-stage builds, `.dockerignore`)
- Generar docker-compose para desarrollo local
- Sugerir optimizaciones (capa de node_modules, cache de build)

---

## 🛠️ Proyecto 1 — Dockerizar el sistema (core)

> **Descripción:** Dockerfiles por servicio + docker-compose para desarrollo local.

### Paso 1: Dockerfiles por servicio

Creá un Dockerfile para cada servicio (users, orders) y uno para el event bus (solo para referencia, no se deploya solo).

Prompt:

> "Creá un Dockerfile para un servicio Express de Node.js (users-service/Dockerfile) que:
> - Use node:20-alpine como base (liviano)
> - Copie package.json y package-lock.json primero (para cache de capas)
> - Ejecute npm install --production
> - Copie el código fuente después (para que el cache de capas funcione)
> - Exponga el puerto 3001
> - Use CMD [\"node\", \"index.js\"]
> - Agregue un HEALTHCHECK con curl al /health
>
> Repetí para orders-service con el puerto 3002.
>
> Nota: los servicios importan ../event-bus, así que el contexto de build debe incluir la carpeta event-bus. Considerá esto en el .dockerignore."

### Paso 2: docker-compose para desarrollo

Prompt:

> "Creá un docker-compose.yml en la raíz del proyecto que:
> - Defina los servicios users-service (build: ./users-service, puerto 3001:3001) y orders-service (build: ./orders-service, puerto 3002:3002)
> - Defina notifications-service (build: ./notifications-service, sin puertos expuestos)
> - Todos en la red default del compose
> - Agregá un healthcheck para cada servicio"

### Criterios de completitud

- [ ] Dockerfiles para users y orders con HEALTHCHECK
- [ ] docker-compose.yml con los 3 servicios
- [ ] El sistema corre con `docker-compose up`
- [ ] Entendés por qué el HEALTHCHECK es importante para el orchestrator

---

## 🛠️ Proyecto 2 — CloudFormation template (core)

> **Descripción:** Generar el template de infraestructura que despliega el sistema en AWS, y el validador cruzado.

### Paso 1: El template

Prompt:

> "Creá un template de CloudFormation (cloudformation/template.yml) en YAML que despliegue un sistema de microservicios en AWS:
>
> Recursos:
> - VPC con 2 AZs, 2 subnets públicas, Internet Gateway, route table
> - ECS Cluster con Fargate
> - Task Definition para users-service: 0.25 vCPU, 512MB, puerto 3001
> - Task Definition para orders-service: mismo spec, puerto 3002
> - ALB (Application Load Balancer) con:
>   - Listener en puerto 80
>   - Target group para /users/* → users-service
>   - Target group para /orders/* → orders-service
> - ECS Services para cada task definition con el target group correspondiente
> - Security groups: el ALB abierto en 80, los servicios solo accesibles desde el ALB
>
> Outputs: ALBDNSName.
> Usá parámetros para ImageURIs y Environment.
>
> Nota: no hace falta que sea perfecto para deploy real — el objetivo es aprender a generar y validar infra con IA."

### Paso 2: El validador cruzado

Prompt:

> "Creá un script (cloudformation/validate.js) que valide el template.yml contra una especificación esperada. La especificación:
> - users-service: puerto 3001, expuesto en /users/*
> - orders-service: puerto 3002, expuesto en /orders/*
> - notifications-service: no expuesto
> - Health check en /health para cada servicio
>
> El script debe verificar:
> - Que existan task definitions para users y orders
> - Que el puerto del container coincida con el puerto del target group
> - Que el ALB tenga listener en 80
> - Que exista health check en /health
> - Que los security groups no expongan puertos innecesarios
>
> Detectar 5 tipos de errores: missing-task-definition, port-mismatch, missing-health-check, exposed-port, missing-listener.
> Imprimir un reporte con hallazgos y severidad. Exit code 1 si hay hallazgos críticos.
> Usá solo módulos nativos (fs). Para parsear YAML, implementá un parser mínimo (no uses librerías)."

### Paso 3: Validá tu template

```bash
node cloudformation/validate.js --template cloudformation/template.yml
```

Si detecta errores, corregilos (con ayuda de la IA si querés) y volvé a validar hasta que pase.

### Criterios de completitud

- [ ] CloudFormation template con VPC, ECS, ALB, target groups, security groups
- [ ] El validador detecta al menos 3 tipos de errores
- [ ] Tu template pasa la validación (exit code 0)
- [ ] Entendés qué decisiones de infraestructura tomaste vos vs la IA

---

## 🛠️ Proyecto 3 — Prove the validator 🔴 core (el corazón del nivel)

> **Descripción:** Demostrá que tu validador de infraestructura de verdad detecta templates rotos. Un validador que no probaste contra un template malo te da falsa seguridad — y el error de infraestructura más caro es el que tu validador no detecta.

Los proyectos 1-2 construyen la infraestructura y el validador. Acá los **sometés a prueba**. El mismo principio del N6 (gate) y N7 (event flow), ahora en IaC.

### Pasos

1. **Creá fixtures de templates rotos.** En `cloudformation/fixtures/`, escribí versiones deliberadamente rotas del template:
   - `port-mismatch.yml` — un task definition con puerto incorrecto (users en 3002, por ejemplo)
   - `missing-health-check.yml` — un target group sin HealthCheckPath o apuntando a otra ruta
   - `missing-listener.yml` — sin Listener en el ALB
   - `exposed-port.yml` — security group abierto a 0.0.0.0/0 en un puerto de servicio

2. **Escribí `cloudformation/validate.test.js`** que pruebe, con `node --test`:
   - Cada fixture roto hace que `validate.js` salga con **exit code 1** (detecta el error)
   - El template bueno hace que `validate.js` salga con **exit code 0** (pasa)
   - El validador detecta el **tipo de error correcto** (port-mismatch para el fixture de puerto, etc.)

3. **Probalo.** Corré `node --test cloudformation/validate.test.js`. Si un fixture roto pasa la validación, tu validador tiene un agujero — y acabas de encontrarlo antes que producción.

4. **Rompé algo a propósito.** Si tu validador no detecta un error que esperás, ese es el hallazgo más valioso del ejercicio: significa que tu gate de infraestructura tiene un falso negativo.

### Criterios de completitud

- [ ] Al menos 4 fixtures de templates rotos (port mismatch, health check, listener, exposed port)
- [ ] `validate.test.js` verifica que cada fixture roto falla (exit 1) y el bueno pasa (exit 0)
- [ ] El validador detecta el tipo de error correcto en cada fixture
- [ ] Encontraste al menos un caso donde tu validador NO detecta un error (o confirmaste que los detecta todos)
- [ ] Entendés por qué un validador sin test es un gate sin probar

> 💡 **La conclusión:** un validador de infraestructura que nunca viste fallar no te protege de nada. Romper el template a propósito es la única forma de saber si tu gate de infraestructura funciona. El template que "siempre valida" es sospechoso — o es perfecto, o tu validador no mira lo correcto.

---

## 🛠️ Proyecto 4 — Audit the IaC decisions 🟠 stretch

> **Descripción:** Mirá críticamente las decisiones de infraestructura que tomaste y las que delegaste a la IA. Separá lo que la IA puede decidir de lo que deberías decidir vos.

### Pasos

1. **Inventariá las decisiones.** Para cada pieza del template (AZs, sizing, security groups, health checks, listener rules), anotá: ¿quién la decidió, vos o la IA? ¿La IA la propuso y vos la validaste, o la aceptaste sin pensar?

2. **Cuestioná cada decisión de la IA.** Para las que la IA decidió solo:
   - ¿El sizing es razonable para el workload o es un default arbitrario?
   - ¿Los security groups siguen el principio de menor privilegio?
   - ¿El health check es el correcto para cada servicio?

3. **Buscá decisiones que no existen.** ¿Faltan cosas importantes? (retry, auto-scaling, logging, alerting). La IA no las agrega salvo que las pidas — son decisiones humanas.

4. **Escribí tu análisis** en `project-8-infra-audit.md`:
   - 2 decisiones de infra que tomaste vos y por qué
   - 2 decisiones que delegaste a la IA y si las validaste
   - 1 cosa que falta en tu template y agregarías
   - Una frase: *¿por qué la IA traduce pero no diseña infraestructura?*

### Criterios de completitud

- [ ] Inventariaste quién tomó cada decisión (vos o la IA)
- [ ] Cuestionaste al menos una decisión de la IA
- [ ] Identificaste algo que falta en tu template
- [ ] Escribiste `project-8-infra-audit.md`
- [ ] Podés explicar qué decisiones de infra son humanas y cuáles puede tomar la IA

> 💡 **La conclusión:** la IA acelera la traducción a IaC, pero la responsabilidad de la arquitectura es humana. Auditá tus decisiones para no convertir el cloud en "el template que la IA me dio" sin entenderlo.

---

## 📣 LinkedIn — Post para publicar

---

**Llevé microservicios a la nube con IA (y probé que el validador no me miente) ☁️**

Nivel 8 del AI Engineering Bootcamp: Producción y cloud.

Dockericé el sistema de microservicios del nivel 7 y generé un CloudFormation template para deployarlo en AWS (ECS + Fargate + ALB).

Lo que aprendí:
- La IA traduce descripciones a infraestructura como código — rápido
- Pero la IA no decide arquitectura: AZs, sizing, security — eso es decisión humana
- Construí un validador cruzado que detecta errores (port mismatch, missing health check, exposed ports)
- Y lo más importante: **probé que el validador detecta templates rotos** — rompí el template a propósito y confirmé que lo agarra
- Un validador que nunca viste fallar no te protege de nada

La infraestructura con IA no es "copiar y pegar un template" — es generar rápido y validar duro.

Próximo nivel: Multiplicador de equipo — standards + dashboard.

#AIEngineering #AWS #CloudFormation #Docker #DevOps

---

## Self-review

Antes de pasar al Nivel 9, respondé:

- [ ] ¿Dockerizaste los servicios con HEALTHCHECK?
- [ ] ¿Generaste un CloudFormation template completo?
- [ ] ¿Construiste un validador cruzado que detecta errores de infra?
- [ ] ¿Tu template pasa la validación?
- [ ] ¿Probaste que tu validador detecta templates rotos (no solo que tu template es válido)?
- [ ] ¿Entendés qué decisiones de infraestructura son humanas y cuáles puede tomar la IA?

→ Si respondiste "sí" a todo, avanzá al **Nivel 9**.

---

## Verificación (auto-check)

Corré el checklist para confirmar que completaste los proyectos:

```bash
cd projects/level-07-microservices
node verify.js
```

`verify.js` chequea: los Dockerfiles y docker-compose (Proyecto 1), el template y el validador (Proyecto 2), los fixtures de templates rotos y el test del validador (Proyecto 3, core) y el registro de auditoría de infra (Proyecto 4, stretch). Confirma *esfuerzo*, no *calidad* — la calidad la juzgás vos contra el self-review de arriba.

> Mismo template que los niveles 1-7. Confirma esfuerzo + rúbrica que guía el juicio.
