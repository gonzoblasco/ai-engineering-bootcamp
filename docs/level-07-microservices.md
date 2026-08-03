# Nivel 7 — Microservicios 🟣

> **Meta:** Diseñar y orquestar microservicios con IA. Aprender a trazar límites de servicios, comunicación entre servicios, y arquitectura event-driven — pero sobre todo, aprender a **probar** que los eventos fluyen como prometés.
>
> **Dificultad:** Avanzado | **Proyectos:** 4 (2 core + 1 profundidad + 1 stretch) | **Tiempo estimado:** 5-6 horas
>
> **Nota:** este es el nivel **núcleo físico** de los niveles 7-10 (ADR-001). Los niveles 8-10 extienden este mismo folder. Lo que construyas acá es la base de todo lo que viene.

---

## 🧠 Teoría — Microservicios: el problema no es escribirlos, es decidir dónde cortar

Escribir un microservicio con IA es fácil — pedile "creá un Express en el puerto 3001" y lo hace. Lo difícil, lo que separa un sistema mantenible de un caos, son **las decisiones de diseño** que tomás antes de escribir código.

### El problema #1: ¿dónde corto?

Cada microservicio es un corte en tu sistema. Y cada corte tiene un costo:

- **Boundary mal elegido** → dos servicios que necesitan hablar constantemente, llorar por cada cambio, y eventualmente compartir la base de datos (en cuyo caso no son microservicios, son una app monolítica con pasos extra).
- **Boundary correcto** → servicios que cambian de forma independiente, fallan de forma aislada, y escalan por separado.

**La regla práctica:** un boundary es bueno si los servicios de cada lado cambian por **razones distintas** y a **velocidades distintas**. Si dos "servicios" siempre cambian juntos, para el mismo motivo — son un solo servicio partido en dos, y el corte te está costando más de lo que te da.

> 💡 **Cómo usa esto la IA:** la IA propone boundaries plausibles, no correctos. Le podés pedir "¿cuáles son los mejores límites para este dominio?" y te dará una respuesta razonable — pero la validez real la decide el *patrón de cambio* futuro, que la IA no puede prever. El boundary es una hipótesis de diseño, no un hecho.

### El problema #2: la comunicación es un contrato

Cuando dos servicios hablan, lo que intercambian es un **contrato**. En REST, el contrato es la ruta + el shape del request/response. En eventos, el contrato es:

```
evento "order.created"
payload: { id: number, userId: number, product: string, amount: number }
productores: orders-service
consumidores: notifications-service, users-service
```

Un contrato de eventos tiene tres partes que tenés que definir explícitamente:

| Parte | Pregunta que responde |
|---|---|
| **Nombre** | ¿Qué evento es? (`order.created`, no `algoPasó`) |
| **Payload** | ¿Qué datos lleva? (shape + tipos) |
| **Productores/consumidores** | ¿Quién lo emite? ¿Quién lo escucha? |

**Un evento sin contrato documentado es deuda silenciosa** — el día que alguien le agrega un campo, o le cambia el tipo, un consumidor se rompe y nadie sabe por qué. Los eventos son una API asíncrona: cambiarlos sin avisar es un breaking change que no falla al compilar, falla en runtime, en producción, horas después.

### El problema #3: eventual consistency y fallos parciales

En un sistema distribuido no hay transacciones globales fáciles. Si creás un usuario y emitís `user.created`, no hay garantía de que el consumidor (notifications) lo procese al instante — y si el handler falla, el evento puede perderse.

Tres decisiones clave:

1. **`_safeCall`** — un handler que tira una excepción **no debe romper al bus** ni a los otros handlers. Un evento con un suscriptor roto no debería tumbar el sistema. Esto lo hace tu event bus envolviendo cada handler en try/catch.

2. **Retry** — si un handler falla, ¿reintentás? Con backoff exponencial (esperás 1s, después 2s, 4s...) para no sobrecargar. Sin retry, un fallo transitorio pierde el evento para siempre.

3. **Idempotencia** — si retentás, el handler puede correr dos veces. Procesar el mismo evento dos veces debe dar el mismo resultado. Un handler que solo agrega a una lista y se ejecuta dos veces duplica — no es idempotente.

**La regla:** asumí que los eventos se van a perder, duplicar o llegar fuera de orden. Diseñá para eso. El sistema que "nunca falla" no existe; el que sobrevive a los fallos, sí.

### El "why" de cada proyecto de este nivel

- **Proyecto 1 (two-service)** — lo básico: dos servicios, un bus, comunicación por eventos.
- **Proyecto 2 (event-driven)** — agregar órdenes, retry y monitoreo.
- **Proyecto 3 (Prove the event flow)** ⭐ el corazón — demostrar que los eventos fluyen, que los handlers fallidos no rompen el bus, y que los payloads cumplen el contrato.
- **Proyecto 4 (Audit the boundaries)** — mirar críticamente tus límites de servicio y tu contrato de eventos.

---

## 🛠️ Proyecto 1 — Sistema de dos servicios (core)

> **Descripción:** Dos microservicios que se comunican por un event bus en memoria.

### El flujo

```
POST /users (3001) → publica "user.created" → bus → notifications suscribe y reacciona
```

### Setup

```bash
mkdir -p projects/level-07-microservices/{event-bus,users-service,notifications-service}
cd projects/level-07-microservices
npm init -y
```

### Paso 1: El event bus

Prompt:

> "Creá `event-bus/index.js`, un event bus en memoria (singleton) con:
> - `subscribe(event, handler)` — registra un handler para un evento; devuelve una función de unsubscribe.
> - `subscribeAll(handler)` — registra un handler para todos los eventos.
> - `publish(event, payload)` — llama a los handlers específicos y a los de subscribeAll.
> - `_safeCall(handler, event, payload)` — envuelve cada handler en try/catch para que **una excepción en un handler no rompa al bus ni a los otros handlers**. Si el handler devuelve una promesa rechazada, capturá el error.
>
> Exportá una instancia única (no la clase)."

> 💡 **El `_safeCall` es la decisión más importante del bus.** Es lo que hace que un evento con un suscriptor roto no tumbe el sistema. Lo vas a *probar* en el Proyecto 3 — por eso tiene que existir desde acá.

### Paso 2: El Users Service

Prompt:

> "Creá `users-service/index.js`, un microservicio Express en el puerto 3001 que:
> - `POST /users` — crea un usuario `{ name, email }`, valida que name no esté vacío y email tenga @, guarda en un array, y **publica `user.created`** con el usuario creado.
> - `GET /users/:id`, `GET /users`, `DELETE /users/:id` (este último publica `user.deleted`).
> - `GET /health` — `{ status: 'ok' }`.
> - Exportá `{ start, stop, app }` para poder testearlo."

### Paso 3: El Notifications Service

Prompt:

> "Creá `notifications-service/index.js`, un servicio SIN HTTP que:
> - Se suscribe a `user.created` y registra una notificación (email de bienvenida).
> - Mantiene un log interno `notifications[]` con `{ type, message, timestamp }`.
> - Exporta `getLog()` para leer las notificaciones (útil para testear) y `start/stop`."

### Paso 4: Probá el flujo

Levantá ambos servicios (o testealos directo) y verificá: al crear un usuario, el notifications service registra la notificación. Si no lo hacés, no sabés si tu bus funciona.

### Criterios de completitud

- [ ] El event bus entrega eventos a suscriptores específicos y a subscribeAll
- [ ] Un handler que lanza excepción no rompe al bus ni a otros handlers (`_safeCall`)
- [ ] POST /users valida y emite `user.created`
- [ ] Notifications consume `user.created` y registra la notificación
- [ ] Probaste el flujo de punta a punta

---

## 🛠️ Proyecto 2 — Arquitectura event-driven (core)

> **Descripción:** Extender el sistema con un Order Service y patrones event-driven.

### El flujo expandido

```
POST /orders (3002) → "order.created" → notifications
DELETE /users (3001) → "user.deleted" → orders cancela órdenes del usuario → "order.cancelled" → notifications
```

### Paso 1: El Order Service

Prompt:

> "Creá `orders-service/index.js`, un microservicio Express en el puerto 3002 que:
> - `POST /orders` — crea una orden `{ userId, product, amount }`, valida (userId número, product no vacío, amount > 0), estado inicial `pending`, y publica `order.created`.
> - `GET /orders`, `GET /orders/:id`, `GET /orders?userId=N`.
> - Se suscribe a `user.deleted`: cancela todas las órdenes del usuario eliminado y publica `order.cancelled` por cada una.
> - `GET /health`. Exportá `{ start, stop, app }`."

> 💡 **Observá el patrón:** el Orders Service reacciona a un evento de otro servicio (`user.deleted`). Esto es *event-driven* — no le preguntás a Users "¿se eliminó este usuario?", Users te avisa. Desacopla a los servicios: Orders no depende de la API de Users, depende del evento.

### Paso 2: Retry con backoff exponencial

Prompt:

> "Agregá a `event-bus/index.js` soporte de retry opcional: `subscribe(event, handler, { retries: 3, backoffMs: 100 })`. Si un handler falla (lanza o rechaza), reintentá hasta `retries` veces esperando `backoffMs * 2^n` entre intentos (exponencial). Si sigue fallando tras agotar los retries, registrá el error y seguí — no bloquees el bus."

### Paso 3: Dashboard de flujo de eventos

Prompt:

> "Creá `dashboard/index.html` (static) que muestre el flujo de eventos entre servicios: una lista de los eventos publicados con su tipo, timestamp y un pequeño diagrama de quién publicó → quién consumió. Podés alimentarlo desde `generate-dashboard-data.js` que lee el log del bus y genera `dashboard/data.json`."

### Criterios de completitud

- [ ] Los 3 servicios se comunican por eventos
- [ ] `user.deleted` cancela órdenes y emite `order.cancelled`
- [ ] El retry con backoff expone y registra fallos sin bloquear el bus
- [ ] El dashboard muestra el flujo de eventos
- [ ] El sistema sobrevive a fallos parciales (un handler roto no tumba el resto)

---

## 🛠️ Proyecto 3 — Prove the event flow 🔴 core (el corazón del nivel)

> **Descripción:** Demostrá que tus eventos fluyen, que los handlers fallidos no rompen el bus, y que los payloads cumplen el contrato. Una arquitectura de eventos que no podés testear es una arquitectura que no sabés si funciona.

Los servicios los construís en los Proyectos 1-2. Acá los **sometés a prueba**. El mismo principio del nivel 6 ("un gate que no podés testear no es un gate") pero aplicado a la comunicación entre servicios.

### Pasos

1. **Definí el contrato como código.** Creá `event-contract.js` que declare los eventos del sistema y sus payloads esperados:
   ```js
   // event-contract.js
   const CONTRACT = {
     'user.created': { required: ['id', 'name', 'email'], producer: 'users', consumers: ['notifications'] },
     'user.deleted': { required: ['id', 'name', 'email'], producer: 'users', consumers: ['orders', 'notifications'] },
     'order.created': { required: ['id', 'userId', 'product', 'amount'], producer: 'orders', consumers: ['notifications'] },
     'order.cancelled': { required: ['id', 'userId', 'product', 'amount'], producer: 'orders', consumers: ['notifications'] },
   };
   module.exports = { CONTRACT };
   ```
   El contrato es la API asíncrona del sistema. Documentarlo como código lo hace chequeable.

2. **Escribí `event-flow.test.js`** que pruebe, con `node --test`:
   - **Entrega:** publicar un evento llama a todos sus suscriptores.
   - **Aislamiento de fallos:** un handler que lanza excepción NO impide que los otros handlers corran (el `_safeCall`). Este es el test que valida la decisión más importante del bus.
   - **Contrato:** al publicar cada evento del contrato, el payload cumple los campos `required` (chequeá con el event-contract).
   - **Flujo real:** crear un usuario vía el service (o publicar `user.created` con un payload válido) → el notifications service registra la notificación.

3. **Probalo.** Corré `node --test event-flow.test.js`. Si un test falla, es una señal real: tu bus no entrega, o no aísla fallos, o tu contrato está mal definido.

4. **Rompé algo a propósito.** Hacé que un handler falle o que un payload le falte un campo, y confirmá que el test **falla**. Esa es la señal de que tu test de eventos funciona.

### Criterios de completitud

- [ ] `event-contract.js` declara los eventos con sus campos required y productores/consumidores
- [ ] `event-flow.test.js` prueba entrega (todos los suscriptores se llaman)
- [ ] Prueba aislamiento de fallos (handler que lanza no rompe a los demás)
- [ ] Prueba que los payloads cumplen el contrato
- [ ] Prueba el flujo real (user.created → notifications reacciona)
- [ ] Rompiste algo a propósito y el test falló

> 💡 **La conclusión:** un event bus sin test de entrega y aislamiento te da falsa confianza. El `_safeCall` existe para aislar fallos — pero si no lo probás, no sabés si funciona. Y un contrato que nadie chequea es un contrato que eventualmente se rompe en producción, silenciosamente, horas después del deploy.

---

## 🛠️ Proyecto 4 — Audit the boundaries 🟠 stretch

> **Descripción:** Mirá críticamente tus límites de servicio y tu contrato de eventos. Encontrá los cortes mal elegidos antes de que te los encuentre la producción.

### Pasos

1. **Cuestioná cada boundary.** Para cada servicio preguntá:
   - ¿Cambia por razones distintas a las de sus vecinos? Si no, el corte es artificial.
   - ¿Necesita hablar constantemente con otro servicio? Eso es un smell de boundary mal elegido.
   - ¿Comparte la base de datos con otro? Entonces no son microservicios.

2. **Auditá el contrato de eventos.** ¿Hay eventos que se solapan? ¿`order.cancelled` y `order.updated` son el mismo concepto? ¿Falta un evento que un consumidor debería escuchar? ¿Hay campos en el payload que nadie usa?

3. **Revisá la idempotencia.** Si el retry corre un handler dos veces, ¿el resultado es el mismo? Probá publicar el mismo evento dos veces y fijate si duplica notificaciones.

4. **Escribí tu análisis** en `project-7-boundary-audit.md`:
   - Un boundary que elegiste bien y por qué
   - Un boundary que elegirías distinto (y qué cambiarías)
   - Un defecto del contrato de eventos (evento que sobra, falta, o está mal nombrado)
   - Un riesgo de idempotencia en tu sistema actual

### Criterios de completitud

- [ ] Cuestionaste cada boundary con criterio (no "todo está bien")
- [ ] Encontraste al menos un defecto real en el contrato de eventos
- [ ] Evaluaste la idempotencia de tus handlers
- [ ] Escribiste `project-7-boundary-audit.md`
- [ ] Podés explicar qué hace un boundary bueno (vs uno que solo es una app monolítica con pasos extra)

> 💡 **La conclusión:** la IA propone boundaries plausibles, no correctos. El valor de un arquitecto no es dibujar el diagrama — es saber *dónde* los cortes duelen menos. Auditar tus propios límites con ojo crítico es la diferencia entre "tengo microservicios" y "tengo un monolito distribuido".

---

## 📣 LinkedIn — Post para publicar

---

**Construí microservicios con IA. Lo difícil no fue escribirlos. 🏗️**

Nivel 7 del AI Engineering Bootcamp: microservicios y arquitectura event-driven.

Lo que aprendí:
- Escribir un servicio con IA es fácil. Decidir DÓNDE cortar es lo difícil
- Un boundary es bueno si los servicios cambian por razones distintas
- Los eventos son una API asíncrona: cambiar el payload sin avisar es un breaking change silencioso
- Un handler que falla no debe tumbar el bus (aislamiento de fallos)
- Y lo más importante: **probé que los eventos fluyen, que los fallos se aíslan, y que los payloads cumplen el contrato**

Un sistema de eventos que no podés testear es un sistema que no sabés si funciona.

Próximo: producción y cloud.

#AIEngineering #Microservices #Architecture #EventDriven #NodeJS

---

## Self-review

Antes de pasar al Nivel 8, respondé:

- [ ] ¿Entendés qué hace bueno a un boundary (cambios por razones distintas)?
- [ ] ¿Sabés por qué los eventos son una API asíncrona con contrato?
- [ ] ¿Construiste dos servicios que se comunican por un event bus?
- [ ] ¿Extendiste con un Order Service y retry con backoff?
- [ ] ¿Definiste el contrato de eventos como código?
- [ ] ¿Probaste entrega, aislamiento de fallos y cumplimiento del contrato?
- [ ] ¿Auditaste tus boundaries y encontraste al menos un defecto real?

→ Si respondiste "sí" a todo, avanzá al **Nivel 8**.

---

## Verificación (auto-check)

Corré el checklist para confirmar que completaste los proyectos:

```bash
cd projects/level-07-microservices
node verify.js
```

`verify.js` chequea: los servicios y el event bus (Proyecto 1-2), el contrato de eventos y el test del flujo (Proyecto 3, core) y el registro de auditoría de boundaries (Proyecto 4, stretch). Confirma *esfuerzo*, no *calidad* — la calidad la juzgás vos contra el self-review de arriba.

> Mismo template que los niveles 1-6. Confirma esfuerzo + rúbrica que guía el juicio.
