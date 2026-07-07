# Integration test template

## Cuándo usarlo
Cuando necesitas generar tests de integración que verifiquen la interacción entre múltiples módulos o con una base de datos real.

## Prompt
```
Genera tests de integración para {{TARGET_ENDPOINT}}.

Requisitos:
- Framework: {{TEST_FRAMEWORK}} (Jest / Vitest / Supertest)
- Base de datos: {{DB_STRATEGY}} (in-memory / test container / test DB)
- Setup/teardown: {{SETUP_TEARDOWN}}
- Casos a cubrir:
  - {{INTEGRATION_CASES}}
- Autenticación: {{AUTH_SETUP}}
- Seed data necesario: {{SEED_DATA}}

Contexto del proyecto:
{{PROJECT_CONTEXT}}
```

## Ejemplo de uso
**Input:**
- `{{TARGET_ENDPOINT}}` = POST /api/users (crear usuario)
- `{{TEST_FRAMEWORK}}` = Jest + Supertest
- `{{DB_STRATEGY}}` = test database (PostgreSQL dedicada para tests)
- `{{SETUP_TEARDOWN}}` = beforeAll: migrar DB y seed; afterEach: limpiar tablas; afterAll: desconectar
- `{{INTEGRATION_CASES}}` = crear usuario con datos válidos → 201 + body con user, crear usuario con email duplicado → 409, crear usuario sin token → 401, crear usuario con datos inválidos → 400
- `{{AUTH_SETUP}}` = generar token JWT válido en beforeAll, incluirlo en header Authorization
- `{{SEED_DATA}}` = un usuario admin para autenticación
- `{{PROJECT_CONTEXT}}` = Express + TypeScript + Prisma + PostgreSQL, app en src/app.ts

**Output esperado:**
- `tests/integration/users.test.ts` — describe('POST /api/users') con 5-6 tests
- `beforeAll`: levanta app, ejecuta migraciones, crea seed data, genera token
- `afterEach`: limpia tabla users (excepto seed)
- `afterAll`: cierra conexión Prisma
- Tests con `supertest(app).post('/api/users').set('Authorization', token).send(body)`
- Verifica status codes, body structure, y que el usuario se persiste en BD

## Notas
- Los tests de integración son más lentos que los unitarios — agrupa por endpoint o flujo
- Usa una BD separada para tests, nunca la de desarrollo o producción
- Para CI, considera usar `docker-compose` con un contenedor PostgreSQL efímero
- Si usas SQLite en memoria para tests, ten en cuenta que algunos features de PostgreSQL no funcionan
