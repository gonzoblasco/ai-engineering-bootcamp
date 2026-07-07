# Proyecto 3.1 — Sistema de autenticación completo (JWT)

> **Nivel:** 3 — Workflows estructurados 🟡
> **Dificultad:** Intermedio
> **Instrucciones:** [`TASK.md`](./TASK.md) · **Docs del nivel:** [level-03-workflows.md](../../../docs/level-03-workflows.md)

## 📌 Estado

✅ **Completado**

## 📝 Descripción

API REST que gestiona identidad y acceso para una aplicación web. Permite
registrar usuarios, autenticarlos, mantener sesión mediante refresh tokens
con rotación y autorizar acciones según roles (`admin` / `user`).

## 🛠️ Stack

- **Node.js + Express** — servidor HTTP
- **Prisma + SQLite** — persistencia
- **bcrypt** — hash de passwords
- **jsonwebtoken** — access tokens JWT
- **Jest + Supertest** — tests E2E
- **ES Modules** — `import/export` en todo el código

## 🚀 Cómo ejecutarlo

```bash
# 1. Instalar dependencias
npm install

# 2. Copiar variables de entorno
cp .env.example .env

# 3. Generar cliente Prisma y crear la base de datos
npx prisma generate
npx prisma db push

# 4. Levantar en modo desarrollo
npm run dev

# 5. Ejecutar tests
npm test
```

El servidor arranca en `http://localhost:3000`.

## ✨ Features

- [x] Registro de usuarios con hash bcrypt
- [x] Login con validación de credenciales
- [x] Access token JWT (15 min) + refresh token opaco (7 días)
- [x] Rotación de refresh tokens (el viejo se revoca)
- [x] Logout (revoca el refresh token)
- [x] Middleware de autenticación (`authenticate`)
- [x] Middleware de autorización por rol (`authorize`)
- [x] Anti-enumeration: mismo mensaje en login para email y password
- [x] Middleware de errores centralizado
- [x] Tests E2E con Supertest
- [x] Documentación OpenAPI/Swagger

## 📂 Estructura

```
src/
  app.js              # wiring de Express + manejo de errores
  server.js           # arranque del servidor
  controllers/        # authController, userController
  routes/             # authRoutes, userRoutes
  middleware/         # auth, roles, errorHandler
  models/             # (prisma/schema.prisma)
  config/             # index.js (env), db.js (Prisma client)
  utils/              # token.js, password.js
tests/
  e2e/                # setup.js, auth.test.js, protected.test.js
prisma/
  schema.prisma       # entidades User y RefreshToken
docs/
  openapi.yaml        # especificación OpenAPI 3.0
```

## 🔌 Endpoints

| Método | Ruta              | Auth  | Descripción                          |
|--------|-------------------|-------|--------------------------------------|
| POST   | /api/auth/register | No   | Registrar usuario (rol: user)        |
| POST   | /api/auth/login    | No   | Iniciar sesión, devuelve tokens       |
| POST   | /api/auth/refresh  | No   | Rotar refresh token por access nuevo  |
| POST   | /api/auth/logout  | No   | Revocar refresh token                 |
| GET    | /api/users/me      | Sí   | Perfil del usuario autenticado        |
| POST   | /api/users/admin   | Admin| Crear un usuario admin                 |

## ✅ Criterios de completitud

- [x] Sistema de auth funcional con JWT
- [x] Refresh token implementado (con rotación)
- [x] Middleware de roles
- [x] Tests E2E con Supertest
- [x] Documentación Swagger/OpenAPI generada (`docs/openapi.yaml`)
- [ ] Recipe documentado en `docs/recipes/`