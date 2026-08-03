# Nivel 7 — Microservicios con IA 🟣

> **Meta:** Generar microservicios consistentes usando IA. Aprender a especificar contratos entre servicios y mantener coherencia en un sistema distribuido.
>
> **Dificultad:** Avanzado | **Proyecto:** 7 | **Tiempo estimado:** 120-150 minutos

---

## 🧠 Teoría — La IA no diseña arquitectura, genera servicios

### El problema de la IA con microservicios

Si le pedís a la IA "diseñame un sistema de microservicios", probablemente te va a dar algo genérico y probablemente incorrecto para tu caso. La IA no entiende tu dominio, tu escala, tu equipo, ni tus restricciones de negocio.

**Lo que la IA SÍ puede hacer:**

| Tarea | ¿La IA sirve? |
|-------|--------------|
| Diseñar la arquitectura | ❌ No — es decisión humana basada en contexto de negocio |
| Generar un servicio individual | ✅ Sí — si le das el contrato exacto |
| Documentar contratos entre servicios | ✅ Sí — puede generar OpenAPI/AsyncAPI desde código |
| Escribir tests de integración | ✅ Sí — conoce los patrones de testing |
| Detectar inconsistencias | ✅ Sí — puede comparar eventos emitidos vs consumidos |
| Migrar de monolito a microservicios | ⚠️ Parcial — útil para extraer servicios individuales |

### Contratos como fuente de verdad

En un sistema de microservicios, el **contrato** es lo único que importa. Cada servicio define:

- **Eventos que emite** — "cuando se crea un usuario, emito `user.created`"
- **Eventos que consume** — "cuando llega `order.created`, envío un email"
- **Endpoints HTTP** — "GET /users/:id devuelve un usuario"

Si los contratos están claros, la IA puede generar servicios consistentes. Si los contratos son vagos, cada servicio va a interpretar el mundo de forma distinta.

### El event bus como desacoplador

Un event bus permite que los servicios se comuniquen sin conocerse:

```
Users Service ──emite──→ user.created ──→┐
                                          ├──→ Event Bus ──→ Notifications Service
Orders Service ──emite──→ order.created ──→┘                    (consume ambos)
```

Ventajas para el ejercicio:
- Cada servicio se puede generar de forma independiente
- Los contratos son explícitos (eventos emitidos/consumidos)
- Se puede probar cada servicio de forma aislada
- El event bus es un módulo compartido simple

### Consistencia entre servicios

El mayor riesgo al generar microservicios con IA es la **inconsistencia**:

- Un servicio emite `user.created`, otro espera `user_created`
- Un servicio manda `{ id: 1, name: "..." }`, otro espera `{ userId: 1, userName: "..." }`
- Un servicio usa `userId`, otro usa `customerId` para lo mismo

**Cómo mitigarlo:**
1. Definir los contratos primero (eventos + payloads)
2. Generar cada servicio a partir del mismo contrato
3. Validar que los eventos emitidos coinciden con los consumidos
4. Usar la IA para detectar inconsistencias entre servicios

---

## 🛠️ Práctica — Sistema de 3 microservicios con event bus

Vas a construir tres microservicios que se comunican a través de un event bus en memoria. Cada servicio se genera con prompts que especifican su contrato exacto.

### Setup

```bash
mkdir -p projects/level-07-microservices/{event-bus,users-service,orders-service,notifications-service}
cd projects/level-07-microservices
```

### Paso 1: El event bus

Primero construí el módulo compartido que todos los servicios van a usar.

Prompt:

> "Creá un event bus en Node.js (event-bus/index.js) que:
> - Tenga un método publish(event, payload) que emite un evento a todos los suscriptores
> - Tenga un método subscribe(event, handler) que registra un handler para un evento
> - Tenga un método subscribeAll(handler) que registra un handler para TODOS los eventos
> - Los handlers se ejecutan de forma asíncrona (no bloquean el publish)
> - Los errores en handlers no rompen el event bus (try/catch interno)
> - Sea un singleton (misma instancia en toda la app)
> - Exporte la instancia y los métodos
>
> Ejemplo de uso:
> ```js
> const bus = require('./event-bus');
> bus.subscribe('user.created', (payload) => console.log('Usuario creado:', payload));
> bus.publish('user.created', { id: 1, name: 'Alice' });
> ```"

### Paso 2: Users Service

Ahora definí el contrato del primer servicio y generalo.

**Contrato de Users Service:**
- Endpoints: POST /users (crear), GET /users/:id (obtener), GET /users (listar)
- Eventos que emite: `user.created`, `user.updated`, `user.deleted`
- Payload de `user.created`: `{ id, name, email, createdAt }`
- Base de datos: array en memoria

Prompt:

> "Creá un microservicio Express (users-service/index.js) que:
> - Escuche en el puerto 3001
> - Use el event bus de ../event-bus
> - Endpoints:
>   - POST /users — crea un usuario con name (string, requerido) y email (string, requerido, validación básica). Emite `user.created` con { id, name, email, createdAt }
>   - GET /users/:id — devuelve un usuario por ID. 404 si no existe
>   - GET /users — lista todos los usuarios
> - Validación: name y email son obligatorios, email debe contener @
> - Errores: { error: string } con status code apropiado
> - IDs autoincrementales
> - Un solo archivo index.js"

### Paso 3: Orders Service

**Contrato de Orders Service:**
- Endpoints: POST /orders (crear), GET /orders/:id (obtener), GET /orders?userId=X (filtrar por usuario)
- Eventos que emite: `order.created`, `order.updated`, `order.cancelled`
- Eventos que consume: `user.deleted` (cancela todas las órdenes del usuario eliminado)
- Payload de `order.created`: `{ id, userId, product, amount, status, createdAt }`

Prompt:

> "Creá un microservicio Express (orders-service/index.js) que:
> - Escuche en el puerto 3002
> - Use el event bus de ../event-bus
> - Endpoints:
>   - POST /orders — crea una orden con userId (number, requerido), product (string, requerido), amount (number, requerido, > 0). Emite `order.created` con { id, userId, product, amount, status: 'pending', createdAt }
>   - GET /orders/:id — devuelve una orden por ID. 404 si no existe
>   - GET /orders?userId=X — lista órdenes filtradas por userId
> - Consuma el evento `user.deleted`: cuando un usuario se elimina, cancela todas sus órdenes (status: 'cancelled') y emite `order.updated` por cada una
> - Validación: userId debe ser número, product string no vacío, amount > 0
> - IDs autoincrementales
> - Un solo archivo index.js"

### Paso 4: Notifications Service

**Contrato de Notifications Service:**
- No expone endpoints HTTP (solo consume eventos)
- Eventos que consume: `user.created`, `order.created`, `order.cancelled`
- Cuando recibe un evento, lo registra en un log interno y lo imprime en consola

Prompt:

> "Creá un servicio de notificaciones (notifications-service/index.js) que:
> - No tenga servidor HTTP (solo consume eventos)
> - Use el event bus de ../event-bus
> - Consuma estos eventos:
>   - `user.created` → imprime: `📧 Email: Bienvenido ${name}! (${email})`
>   - `order.created` → imprime: `📧 Email: Orden #${id} creada — ${product} por $${amount}`
>   - `order.cancelled` → imprime: `📧 Email: Orden #${id} cancelada`
> - Mantenga un array interno de notificaciones enviadas (para poder consultarlas después)
> - Exporte una función getLog() que devuelva el array de notificaciones
> - Un solo archivo index.js"

### Paso 5: El orquestador

Creá un archivo que levante los tres servicios y el event bus juntos.

Prompt:

> "Creá un orquestador (index.js) en la raíz del proyecto que:
> - Importe el event bus
> - Importe y arranque users-service, orders-service, y notifications-service
> - Inicie los servidores HTTP de users y orders
> - Imprima un mensaje cuando todo esté listo
> - Maneje el shutdown graceful (SIGINT, SIGTERM) cerrando los servidores"

### Paso 6: Probá el sistema

```bash
node index.js
```

En otra terminal:

```bash
# Crear un usuario
curl -X POST http://localhost:3001/users -H 'Content-Type: application/json' -d '{"name":"Alice","email":"alice@example.com"}'

# Crear una orden para ese usuario
curl -X POST http://localhost:3002/orders -H 'Content-Type: application/json' -d '{"userId":1,"product":"Laptop","amount":1500}'

# Eliminar el usuario (debería cancelar sus órdenes)
curl -X DELETE http://localhost:3001/users/1

# Verificar que las órdenes se cancelaron
curl http://localhost:3002/orders?userId=1
```

### Criterios de completitud

- [ ] El event bus funciona como singleton y maneja errores en handlers
- [ ] Users Service tiene los 3 endpoints y emite eventos
- [ ] Orders Service tiene endpoints, emite eventos, y consume `user.deleted`
- [ ] Notifications Service consume eventos sin servidor HTTP
- [ ] El orquestador levanta todo junto
- [ ] Probaste el flujo completo: crear usuario → crear orden → eliminar usuario → orden cancelada
- [ ] Los eventos tienen payloads consistentes entre servicios

---

## 📣 LinkedIn — Post para publicar

---

**Microservicios con IA: la IA escribe el código, vos diseñás los contratos 🏗️**

Nivel 7 del AI Engineering Bootcamp: Microservicios con event bus.

Construí 3 servicios (Users, Orders, Notifications) comunicados por un event bus. Cada servicio se generó con IA a partir de un contrato explícito.

Lo que aprendí:
- La IA no diseña arquitectura — genera servicios individuales si le das el contrato exacto
- Los contratos (eventos + payloads) son la fuente de verdad, no el código
- El event bus permite generar servicios de forma independiente sin perder coherencia
- La IA es excelente para detectar inconsistencias entre servicios

Próximo nivel: Producción y cloud — deploy a AWS.

#AIEngineering #Microservices #NodeJS #EventDriven #SystemDesign

---

## Self-review

Antes de pasar al Nivel 8, respondé:

- [ ] ¿Entendés por qué la IA no debería diseñar la arquitectura de microservicios?
- [ ] ¿Construiste el event bus como singleton?
- [ ] ¿Cada servicio tiene contratos claros (eventos que emite/consume)?
- [ ] ¿Probaste el flujo completo de principio a fin?
- [ ] ¿Los eventos tienen payloads consistentes entre servicios?

→ Si respondiste "sí" a todo, avanzá al **Nivel 8**.
