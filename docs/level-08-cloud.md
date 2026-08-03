# Nivel 8 — Producción y cloud con IA ☁️

> **Meta:** Llevar un sistema local a producción en la nube usando IA. Aprender a generar y validar infraestructura como código.
>
> **Dificultad:** Avanzado | **Proyecto:** 8 | **Tiempo estimado:** 120-150 minutos

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

### Docker como puente

Docker es el puente entre desarrollo local y producción. Dockeriza tu sistema, probalo local, y el mismo container sube a AWS. La IA puede:

- Generar Dockerfiles eficientes (multi-stage builds, `.dockerignore`)
- Generar docker-compose para desarrollo local
- Sugerir optimizaciones (capa de node_modules, cache de build)

---

## 🛠️ Práctica — Dockerizar y deployar el sistema del nivel 7

Vas a tomar el sistema de microservicios del nivel 7 y llevarlo a producción: primero Docker, después CloudFormation, y finalmente validación cruzada con IA.

### Setup

```bash
cd projects/level-07-microservices  # reusás el sistema del nivel 7
```

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

### Paso 3: CloudFormation template

Ahora la parte grande — generar un template de CloudFormation que despliegue los servicios en AWS.

Prompt:

> "Creá un template de CloudFormation (cloudformation/template.yml) en YAML que despliegue un sistema de microservicios en AWS:
>
> Recursos:
> - VPC con 2 AZs, 2 subnets públicas, Internet Gateway, route table
> - ECS Cluster con Fargate
> - Task Definition para users-service: imagen node:20-alpine con el código (por simplicidad, usá la imagen como placeholder), 0.25 vCPU, 512MB, puerto 3001
> - Task Definition para orders-service: mismo spec, puerto 3002
> - ALB (Application Load Balancer) con:
>   - Listener en puerto 80
>   - Target group para /users/* → users-service
>   - Target group para /orders/* → orders-service
> - ECS Services para cada task definition con el target group correspondiente
> - Security groups: el ALB abierto en 80, los servicios solo accesibles desde el ALB
>
> Outputs:
> - ALBDNSName (URL pública del load balancer)
>
> Usá parámetros para: ImageURIs (para poder cambiarlas fácilmente), Environment (dev/prod)
>
> Nota: no hace falta que sea perfecto para deploy real — el objetivo es aprender a generar y validar infra con IA."

### Paso 4: Validador cruzado

Ahora construí un script que valide el CloudFormation template contra la especificación del sistema.

Prompt:

> "Creá un script (cloudformation/validate.js) que valide el template.yml contra una especificación esperada. La especificación:
> - users-service: puerto 3001, expuesto en /users/*
> - orders-service: puerto 3002, expuesto en /orders/*
> - notifications-service: no expuesto
> - Health check en /health para cada servicio
>
> El script debe:
> - Leer template.yml
> - Verificar (parseando YAML manualmente o con regex):
>   - Que existan task definitions para users y orders
>   - Que el puerto del container coincida con el puerto del target group
>   - Que el ALB tenga listener en 80
>   - Que exista health check en /health
>   - Que los security groups no expongan puertos innecesarios
> - Detectar 5 tipos de errores comunes:
>   - missing-task-definition
>   - port-mismatch (puerto container != puerto target group)
>   - missing-health-check
>   - exposed-port (security group abierto a 0.0.0.0/0 en puerto no-80)
>   - missing-listener
> - Imprimir un reporte con hallazgos y severidad
> - Devolver exit code 1 si hay hallazgos críticos
>
> Usá solo módulos nativos (fs). Para parsear YAML, implementá un parser mínimo para las claves que necesitás (no uses librerías)."

### Paso 5: Validá tu template

```bash
node cloudformation/validate.js --template cloudformation/template.yml
```

Si detecta errores, corregilos (con ayuda de la IA si querés) y volvé a validar hasta que pase.

### Criterios de completitud

- [ ] Dockerfiles para users y orders con HEALTHCHECK
- [ ] docker-compose.yml con los 3 servicios
- [ ] CloudFormation template con VPC, ECS, ALB, target groups, security groups
- [ ] El validador detecta al menos 3 tipos de errores
- [ ] Tu template pasa la validación (exit code 0)
- [ ] Probaste el sistema con docker-compose up
- [ ] Entendés qué decisiones de infraestructura tomaste vos vs la IA

---

## 📣 LinkedIn — Post para publicar

---

**Llevé microservicios a la nube con IA (y validé que no explote) ☁️**

Nivel 8 del AI Engineering Bootcamp: Producción y cloud.

Dockericé el sistema de microservicios del nivel 7 y generé un CloudFormation template para deployarlo en AWS (ECS + Fargate + ALB).

Lo que aprendí:
- La IA traduce descripciones a infraestructura como código — rápido
- Pero la IA no decide arquitectura: AZs, sizing, security — eso es decisión humana
- Construí un validador cruzado que detecta errores que la IA mete (port mismatch, missing health check, exposed ports)
- El validador es el mismo patrón que usamos para code review: reglas locales + IA contextual

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
- [ ] ¿Entendés qué decisiones de infraestructura son humanas y cuáles puede tomar la IA?

→ Si respondiste "sí" a todo, avanzá al **Nivel 9**.
