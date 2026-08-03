# Niveles 7-10 — Sistema de Microservicios (proyecto convergente)

> **Este folder concentra los niveles 7, 8, 9 y 10 del bootcamp.** En vez de crear una carpeta nueva por nivel, los niveles finales extienden el mismo sistema (ADR-001).

## Proyecto: Sistema de microservicios + cloud + estándares + sistema completo

Sistema de microservicios (Users, Orders, Notifications) comunicados por un event bus en memoria, evolucionado a lo largo de 4 niveles: microservicios (N7), producción en cloud (N8), estándares de equipo (N9) y sistema completo con auth + gateway + CI/CD (N10). Cada servicio se genera con prompts que especifican su contrato exacto.

### Cómo se acumula

| Nivel | Qué agrega | Estado |
|-------|-----------|--------|
| 7 | 3 servicios + event bus + orquestador | ✅ |
| 8 | Docker + CloudFormation + validador cruzado | ✅ |
| 9 | Estándares de equipo + dashboard de calidad | ✅ |
| 10 | Auth service + API gateway + CI/CD + dashboard en vivo | ✅ |

### Arquitectura final (N10)

```
                    ┌────────────┐
   client ────────▶ │  Gateway   │  (8080)
                    │  /health   │
                    └─────┬──────┘
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
   ┌───────────┐    ┌───────────┐    ┌───────────┐
   │ Auth 3000 │    │ Users 3001│    │ Orders 3002│
   └─────┬─────┘    └─────┬─────┘    └─────┬─────┘
          └───────────────┼───────────────┘
                          ▼
                   ┌─────────────┐
                   │ Event bus   │──▶ Notifications
                   └─────────────┘
```

### Archivos

- `event-bus/index.js` — event bus singleton
- `users-service/index.js` — microservicio de usuarios (puerto 3001)
- `orders-service/index.js` — microservicio de órdenes (puerto 3002)
- `notifications-service/index.js` — servicio de notificaciones (sin HTTP)
- `index.js` — orquestador que levanta todo

### Nivel 7 — Profundidad: contrato y prueba del flujo (archivos agregados)

- `event-contract.js` — contrato de eventos como código (qué eventos, qué payload, quién produce/consume)
- `event-flow.test.js` — test que demuestra: entrega a todos los suscriptores, aislamiento de fallos (_safeCall), cumplimiento del contrato, y flujo real user.created → notifications
- `verify.js` — auto-check del nivel 7

```bash
node --test event-flow.test.js   # el contrato de eventos fluye y aísla fallos
node verify.js                   # auto-check (15 checks)
```

### Nivel 8 — Docker y Cloud (archivos agregados)

- `users-service/Dockerfile` — imagen del users service (puerto 3001)
- `orders-service/Dockerfile` — imagen del orders service (puerto 3002)
- `notifications-service/Dockerfile` — imagen del notifications service
- `docker-compose.yml` — orquestación local con healthchecks
- `cloudformation/template.yml` — CloudFormation template para AWS (VPC + ECS + ALB)
- `cloudformation/validate.js` — validador cruzado de infraestructura
- `cloudformation/fixtures/*.yml` — templates deliberadamente rotos para probar el validador
- `cloudformation/validate.test.js` — prueba de fuego: confirma que el validador detecta templates rotos
- `verify.js` — auto-check del nivel 8 (Dockerfiles + CloudFormation + proof del validador)

```bash
node cloudformation/validate.js --template cloudformation/template.yml   # valida tu infra
node --test cloudformation/validate.test.js                              # el validador detecta templates rotos
node verify.js                                                           # auto-check del nivel 8 (15 checks)
```

### Nivel 9 — Estándares y dashboard (archivos agregados)

- `standards/standards.json` — estándares de equipo como código
- `standards/validate.js` — validador que aplica los estándares al sistema
- `generate-dashboard-data.js` — genera dashboard/data.json desde el validador
- `dashboard/index.html` — dashboard de calidad (score, checks, violaciones, servicios)
- `standards/fixtures/broken/` — sistema deliberadamente roto para probar el validador
- `standards/validate.test.js` — prueba de fuego: confirma que el validador detecta violaciones
- `verify.js` — auto-check del nivel 9 (standards + dashboard + proof del validador)

```bash
node standards/validate.js                  # valida el sistema contra los estándares
node --test standards/validate.test.js      # el validador detecta violaciones
node verify.js                              # auto-check del nivel 9 (16 checks)
```

### Nivel 10 — Sistema completo (archivos agregados)

- `auth-service/index.js` — servicio de autenticación (puerto 3000, register + login)
- `gateway/index.js` — API Gateway unificado (puerto 8080, enruta a todos los servicios)
- `.github/workflows/quality.yml` — CI/CD que valida estándares en PRs (bloquea si score < 80)
- `index.js` — orquestador que levanta los 5 componentes con un solo comando
- `dashboard/index.html` — expandido con vista de sistema en vivo

### Cómo empezar

1. Leé la guía en `docs/level-07-microservices.md`
2. Construí el event bus primero
3. Generá cada servicio con su contrato
4. Conectá todo con el orquestador
5. Probá el flujo completo con curl
6. Para el nivel 8: leé `docs/level-08-cloud.md`, Dockerizá, generá CloudFormation, validá
7. Para el nivel 9: leé `docs/level-09-team-standards.md`, definí estándares, corré el dashboard
8. Para el nivel 10: leé `docs/level-10-full-system.md`, agregá auth + gateway, conectá CI/CD

### Correr el sistema completo (N10)

```bash
npm run dev        # levanta los 5 componentes con un solo comando
curl localhost:8080/health   # estado agregado de todos los servicios
```
