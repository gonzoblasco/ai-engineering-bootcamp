# Recipe — Sistema de autenticación con JWT

> **Proyecto:** 3.1 — Sistema de autenticación completo (JWT)
> **Nivel:** 3 — Workflows estructurados
> **Fecha:** 2026-07-06
> **Tiempo total:** ~2 horas

---

## Objetivo del recipe

Documentar el workflow completo para construir un sistema de autenticación
con JWT de forma repetible. Este recipe sirve como plantilla: cualquier
sistema de auth similar puede seguir los mismos pasos cambiando el spec.

---

## Workflow seguido

```
1. SPEC   → Definir requisitos en lenguaje natural
2. PROMPT → Convertir spec en prompt estructurado
3. CODE   → Generar código con Copilot
4. TEST   → Pedir tests automáticamente
5. REVIEW → Auditar seguridad del código generado
6. DOC    → Generar documentación OpenAPI
7. RECIPE → Documentar el proceso (este archivo)
```

---

## Paso 1 — SPEC

**Archivo producido:** [`SPEC.md`](../../SPEC.md)

Definir en lenguaje natural:
- **Objetivo:** qué hace el sistema
- **Entidades:** `User`, `RefreshToken` con sus campos
- **Flujos funcionales:** registro, login, refresh, logout, auth, roles
- **Roles:** `admin` y `user`, default `user`
- **Reglas de negocio:** expiraciones, códigos HTTP, anti-enumeration
- **Fuera de alcance:** OAuth, 2FA, recuperación por email, rate limiting

> **Lección:** el spec es el contrato. Todo lo que sigue respeta el spec
> y no inventa requisitos. Si algo es ambiguo, se pregunta antes de asumir.

---

## Paso 2 — PROMPT

**Archivo producido:** [`PROMPT.md`](../../PROMPT.md)

Convertir el spec en un prompt estructurado con:
- **Rol:** backend engineer senior especializado en Node.js + Express + auth
- **Stack técnico obligatorio:** Node.js, Express, Prisma, SQLite, bcrypt, JWT
- **Estructura de carpetas exacta** (controllers, routes, middleware, etc.)
- **Convenciones de código:** exports nombrados, respuestas `{ data }` / `{ error }`,
  middleware de errores centralizado, no loguear secrets
- **Entregables numerados:** schema, controllers, app.js, .env.example, package.json, README
- **Restricciones explícitas:** no OAuth, no 2FA, no rate limiting, no inventar endpoints

El prompt usa placeholders reutilizables: `{{DOMAIN}}`, `{{SPEC}}`, `{{FLOWS}}`,
`{{BUSINESS_RULES}}`. El resto del prompt (rol, stack, estructura, convenciones)
se mantiene igual entre proyectos.

> **Lección:** las restricciones explícitas son espejo del "fuera de alcance"
> del spec, reforzadas para que Copilot no se salga del scope.

---

## Paso 3 — CODE

**Archivos producidos:**

```
src/
  app.js                  # wiring de Express + manejo de errores
  server.js               # arranque del servidor
  config/
    index.js              # variables de entorno
    db.js                 # cliente Prisma (singleton)
  controllers/
    authController.js     # register, login, refresh, logout
    userController.js     # getProfile, createAdmin
  routes/
    authRoutes.js         # /api/auth/*
    userRoutes.js         # /api/users/*
  middleware/
    auth.js               # valida Bearer JWT
    roles.js              # authorize('admin', 'user')
    errorHandler.js       # errores centralizados
  utils/
    token.js              # generateAccessToken, verifyAccessToken
    password.js           # hashPassword, comparePassword
prisma/
  schema.prisma           # User + RefreshToken
```

**Decisiones de implementación:**
- Refresh token opaco (random bytes) en lugar de JWT, para poder revocarlo
- Rotación de refresh tokens: el viejo se revoca al emitir uno nuevo
- `role` como `String` (SQLite no soporta enums en Prisma)
- Anti-enumeration: mismo mensaje y mismo flujo para email inexistente y
  password incorrecta en login

> **Lección:** SQLite no soporta enums en Prisma. Usar `String` con default
> y validar en la capa de aplicación.

---

## Paso 4 — TEST

**Archivos producidos:**

```
tests/
  e2e/
    setup.js            # reset de DB antes de cada test
    auth.test.js        # 9 tests: registro, login, refresh, logout
    protected.test.js   # 6 tests: rutas protegidas, roles, admin
```

**Resultado:** 15 tests E2E pasando con Jest + Supertest.

**Configuración necesaria:**
- `jest.config.js` con `transform: {}` (sin Babel)
- `NODE_OPTIONS='--experimental-vm-modules'` para soportar ES Modules en Jest
- `--runInBand` para evitar conflictos con la base de datos SQLite

> **Lección:** Jest no soporta ES Modules por defecto. Se necesita el flag
> `--experimental-vm-modules` de Node y `transform: {}` en la config de Jest.

---

## Paso 5 — REVIEW (auditoría de seguridad)

Puntos de seguridad verificados en el código generado:

| Punto | Estado | Dónde |
|-------|--------|-------|
| Password hasheada con bcrypt (10 rounds) | ✅ | `utils/password.js` |
| Password nunca se devuelve en respuestas | ✅ | `sanitize()` en `authController.js` |
| JWT secret desde variable de entorno | ✅ | `config/index.js` |
| Anti-enumeration en login | ✅ | `authController.js` — mismo mensaje 401 |
| Refresh token revocado al rotar | ✅ | `refresh()` en `authController.js` |
| Refresh token revocado al logout | ✅ | `logout()` en `authController.js` |
| Middleware de auth valida existencia del usuario | ✅ | `middleware/auth.js` |
| Authorization por rol | ✅ | `middleware/roles.js` |
| No se loguean secrets ni passwords | ✅ | ninguna ruta los loguea |
| Logout idempotente (no revela si el token existía) | ✅ | `logout()` |

**Fuera de scope (se abordará en Nivel 5 — Auditoría):**
- Rate limiting
- Rotación de JWT secret
- CSP y headers de seguridad
- CORS

---

## Paso 6 — DOC

**Archivo producido:** [`docs/openapi.yaml`](../openapi.yaml)

Especificación OpenAPI 3.0 con:
- Todos los endpoints documentados
- Esquemas de `User`, `TokenPair`, `Error`
- Security scheme `bearerAuth` (JWT)
- Códigos de respuesta por endpoint

---

## Paso 7 — RECIPE (este archivo)

Documentación del proceso completo para que sea replicable.

---

## Cómo replicar este recipe para otro sistema

1. **Copia el `PROMPT.md`** y reemplaza los placeholders:
   - `{{DOMAIN}}` → descripción del nuevo sistema
   - `{{SPEC}}` → spec del nuevo sistema
   - `{{FLOWS}}` → flujos funcionales
   - `{{BUSINESS_RULES}}` → reglas de negocio
2. **Mantén intacto** el rol, stack, estructura, convenciones y restricciones
3. **Envía el prompt** a Copilot y verifica los entregables uno por uno
4. **Pide tests** con Jest + Supertest
5. **Audita seguridad** con la checklist de arriba
6. **Genera OpenAPI** documentando los endpoints resultantes
7. **Documenta el proceso** en un recipe nuevo

---

## Checklist de completitud

- [x] Sistema de auth funcional con JWT
- [x] Refresh token implementado (con rotación)
- [x] Middleware de roles
- [x] Tests E2E con Supertest (15 tests)
- [x] Documentación Swagger/OpenAPI generada
- [x] Recipe documentado en `docs/recipes/`