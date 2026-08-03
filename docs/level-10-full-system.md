# Nivel 10 — El sistema completo 🏆

> **Meta:** Integrar todo lo aprendido en un sistema único y productivo. La IA como infraestructura invisible que atraviesa todo el proceso de desarrollo.
>
> **Dificultad:** Capstone | **Proyecto:** 10 (extiende el N7/N8/N9) | **Tiempo estimado:** 150-180 minutos

---

## 🧠 Teoría — La IA como infraestructura, no como herramienta

### El viaje completo

En el Nivel 1 la IA era un **generador** — le pedías y te daba código. Ahora, 9 niveles después, la IA es parte de todo tu proceso:

| Nivel | Habilidad | Rol de la IA |
|-------|-----------|--------------|
| 1 | Generar | Escribe código |
| 2 | Prompts | Entiende especificaciones |
| 3 | Workflows | Ejecuta procesos |
| 4 | Templates | Reutiliza estándares |
| 5 | Seguridad | Filtra vulnerabilidades |
| 6 | CI/CD | Automatiza calidad |
| 7 | Microservicios | Genera servicios consistentes |
| 8 | Cloud | Traduce a infraestructura |
| 9 | Estándares | Escala reglas de equipo |

### El salto al nivel 10

El nivel 10 no agrega una habilidad nueva — **integra las nueve anteriores en un solo sistema**. Es el momento en que la IA deja de ser un tool que usás de a ratos y se convierte en **infraestructura invisible**: está en el código, en los contratos, en la seguridad, en el CI/CD, en la documentación, en los estándares.

La diferencia entre un dev que usa IA y un AI Engineer:

| Dev que usa IA | AI Engineer |
|----------------|-------------|
| Le pide a la IA que escriba código | Diseña sistemas donde la IA es parte del proceso |
| Copia y pega lo que la IA genera | Construye pipelines que validan lo que la IA genera |
| Usa IA para tareas puntuales | La IA atraviesa todo el ciclo de vida |
| El prompt es el fin | El prompt es un componente del sistema |
| Depende de la IA | Controla la IA |

### El sistema completo como portafolio

Un sistema completo y funcionando es el mejor portafolio posible. No es un tutorial — es una **demostración de que sabés diseñar, construir, proteger, desplegar, y escalar** un sistema real, con IA como infraestructura. Es exactamente el tipo de proyecto que separa a un dev fullstack senior de uno junior.

---

## 🛠️ Práctica — El sistema completo

Vas a evolucionar el sistema N7/N8/N9 a un sistema productivo con autenticación, orquestación, y un solo comando para levantarlo.

### Setup

```bash
cd projects/level-07-microservices  # reusás el sistema
```

### Paso 1: Auth Service (4to servicio)

Agregá un servicio de autenticación que se integre al event bus.

**Contrato de Auth Service:**
- Endpoints: POST /auth/register (crea usuario + emite `user.registered`), POST /auth/login (valida credenciales)
- Eventos que consume: `user.deleted` (invalida tokens del usuario)
- Base de datos: usuarios en memoria (reusa la lógica del users-service pero con password hash simulado)

Prompt:

> "Creá un nuevo microservicio Express (auth-service/index.js) que:
> - Escuche en el puerto 3000
> - Use el event bus de ../event-bus
> - Endpoints:
>   - POST /auth/register — recibe { name, email, password }. Valida que email tenga @ y password tenga al menos 6 caracteres. Emite `user.registered` con { name, email }. No emite `user.created` (ese lo emite users-service)
>   - POST /auth/login — recibe { email, password }. Verifica contra la lista de usuarios registrados (en memoria). Devuelve { token } si es válido (token simulado, no JWT real — solo un hash simple), 401 si no
> - Health check en GET /health
> - IDs autoincrementales
> - Un solo archivo index.js
> - Validación: errores como { error: string } con status code apropiado"

### Paso 2: El API Gateway

Creá un gateway que unifique el acceso a los servicios.

Prompt:

> "Creá un API Gateway (gateway/index.js) que:
> - Escuche en el puerto 8080
> - Enrute:
>   - /auth/* → auth-service (puerto 3000)
>   - /users/* → users-service (puerto 3001)
>   - /orders/* → orders-service (puerto 3002)
> - Use node-fetch o http nativo para forwardear requests
> - Tenga un GET /health que verifique el health de todos los servicios (llamando a cada /health) y devuelva el estado agregado
> - Tenga un GET / que devuelva la lista de endpoints disponibles
> - Logee cada request con el servicio destino y el tiempo de respuesta
> - Use solo http nativo de Node.js (http, http-proxy si hace falta, o forwardeo manual con fetch)
>
> Ejemplo de respuesta de /health:
> ```json
> {
>   "gateway": "ok",
>   "services": {
>     "auth": "ok",
>     "users": "ok",
>     "orders": "ok",
>     "notifications": "ok"
>   }
> }
> ```"

### Paso 3: Un solo comando

Actualizá el orquestador (index.js) para que levante también el auth-service y el gateway.

Prompt:

> "Actualizá index.js (el orquestador raíz) para que:
> - Importe y arranque auth-service (3000), users-service (3001), orders-service (3002), notifications-service (sin HTTP), y gateway (8080)
> - Imprima un diagrama ASCII de la arquitectura al iniciar
> - Siga manejando el shutdown graceful
> - Actualizá package.json con el script 'dev' que ejecute node index.js y 'start' similar"

### Paso 4: Conectá el CI/CD real

Ahora conectá los workflows del nivel 6 al sistema real. Creá un workflow que corra las validaciones del sistema completo en cada PR.

Prompt:

> "Creá un workflow de GitHub Actions (.github/workflows/quality.yml) que:
> - Se ejecute en pull_request
> - Haga checkout
> - Setup Node.js
> - Instale dependencias
> - Ejecute el validador de estándares (node standards/validate.js)
> - Si el score es menor a 80, falla el workflow (con un comentario)
> - Si pasa, comenta el score en el PR
> - Use el patrón de commentar/no-bloquear aprendido en el nivel 6, pero en este caso los estándares de equipo SÍ pueden bloquear (son reglas objetivas, no opinión de IA)"

### Paso 5: Expandí el dashboard

Agregá al dashboard la vista de "sistema en vivo" — el estado de los servicios y el health agregado del gateway.

Prompt:

> "Expandí dashboard/index.html (o creá una sección nueva) para mostrar:
> - Estado en vivo de cada servicio (auth, users, orders, notifications, gateway)
> - El health agregado del gateway
> - El score de estándares (del nivel 9)
> - Una sección de 'arquitectura' mostrando cómo se conectan los servicios (diagrama simple en HTML/CSS)
>
> Usá fetch a /health del gateway si está corriendo, o data embebida como fallback.
> Todo en un solo archivo, CSS puro, responsive."

### Paso 6: Probá el sistema completo

```bash
npm run dev
```

En otra terminal:

```bash
# Health del gateway (todos los servicios)
curl http://localhost:8080/health

# Registrar un usuario
curl -X POST http://localhost:8080/auth/register -H 'Content-Type: application/json' -d '{"name":"Alice","email":"alice@example.com","password":"secret123"}'

# Login
curl -X POST http://localhost:8080/auth/login -H 'Content-Type: application/json' -d '{"email":"alice@example.com","password":"secret123"}'

# Crear una orden (directo, sin auth por simplicidad)
curl -X POST http://localhost:8080/orders -H 'Content-Type: application/json' -d '{"userId":1,"product":"Laptop","amount":1500}'

# Ver el estado agregado
curl http://localhost:8080/
```

### Criterios de completitud

- [ ] Auth Service funciona (register + login + health)
- [ ] El API Gateway enruta a los servicios correctamente
- [ ] /health del gateway muestra el estado agregado de todos los servicios
- [ ] El orquestador levanta los 5 componentes con un solo comando
- [ ] El workflow de CI/CD corre el validador de estándares en PRs
- [ ] El dashboard muestra el sistema en vivo
- [ ] Probaste el flujo completo: registrar → login → crear orden → ver estado
- [ ] **Puedes explicar cómo cada uno de los 9 niveles anteriores contribuye a este sistema**

---

## 📣 LinkedIn — Post para publicar

---

**Construí un sistema completo con IA como infraestructura 🏆**

Completé el AI Engineering Bootcamp — 10 niveles, de "aceptar autocomplete" a "orquestar agentes en producción".

El resultado: un sistema de microservicios (auth, users, orders, notifications) con API gateway, CI/CD, estándares de equipo, dashboard de calidad, y despliegue en la nube. Todo construido y validado con IA como infraestructura, no como herramienta.

Lo que aprendí en el viaje:
1. La IA no piensa — predice patrones. Hay que revisar siempre
2. El prompt correcto es más importante que el tool
3. La IA es un componente del pipeline, no el pipeline entero
4. Los estándares como código escalan equipos
5. La IA comenta, no bloquea — salvo reglas objetivas
6. El verdadero valor: IA como infraestructura invisible

De 'pedirle código a la IA' a 'diseñar sistemas donde la IA es parte del proceso'.

#AIEngineering #FullStack #Microservices #DevOps #CareerGrowth

---

## Self-review — Cierre del curso

- [ ] ¿El sistema completo funciona con un solo comando?
- [ ] ¿El gateway enruta y agrega health de todos los servicios?
- [ ] ¿El CI/CD corre los estándares en PRs?
- [ ] ¿El dashboard muestra el sistema en vivo?
- [ ] ¿Puedes explicar el aporte de cada nivel al sistema final?
- [ ] ¿Te sentís preparado para aplicar esto a un proyecto real?

🎉 **Felicidades, completaste el AI Engineering Bootcamp.**

Ya no sos un dev que usa IA. Sos un AI Engineer que diseña sistemas donde la IA es infraestructura.
