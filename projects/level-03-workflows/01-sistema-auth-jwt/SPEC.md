# Spec — Sistema de autenticación con JWT

> **Proyecto:** 3.1 — Sistema de autenticación completo (JWT)
> **Fase del workflow:** Paso 1 — SPEC
> **Fecha:** 2026-07-06

## Objetivo

API REST que gestione identidad y acceso para una aplicación web.
Debe permitir registrar usuarios, autenticarlos, mantener su sesión
mediante refresh tokens y autorizar acciones según roles.

## Stack

- Node.js + Express
- Prisma + SQLite (persistencia)
- bcrypt (hash de passwords), jsonwebtoken (JWT)
- Jest + Supertest (tests E2E)

## Entidades

- **User**: id, email (único), password (hash), role, createdAt
- **RefreshToken**: id, userId, token, expiresAt, revoked

## Flujos funcionales

1. **Registro**: crea un User con email + password. La password nunca
   se guarda en texto plano. Devuelve tokens.
2. **Login**: valida credenciales y devuelve access token (corto) +
   refresh token (largo).
3. **Refresh**: intercambia un refresh token válido por un access token
   nuevo. El refresh token viejo se revoca (rotación).
4. **Logout**: revoca el refresh token activo.
5. **Proteger rutas**: middleware que valida el access token y niega
   acceso si falta, expira o es inválido.
6. **Autorizar por rol**: middleware que permite acceso solo a roles
   específicos (admin, user).

## Roles

- Dos roles fijos: "admin" y "user".
- Rol por defecto al registrar: "user".
- Solo un admin puede crear otros admins (vía endpoint protegido).

## Reglas de negocio

- Access token: JWT, expira en 15 min.
- Refresh token: aleatorio, expira en 7 días, se guarda en DB.
- Email duplicado → error 409.
- Credenciales inválidas → error 401 (mismo mensaje para email y
  password, para evitar user enumeration).
- Refresh token revocado o expirado → error 401, fuerza re-login.

## Estructura de carpetas

```
src/
  controllers/    # lógica de cada endpoint
  routes/         # definición de rutas Express
  middleware/     # auth, roles, error handler
  models/         # esquema Prisma
  config/         # JWT secret, DB connection
  utils/          # helpers (token gen, etc.)
tests/
  e2e/            # Supertest
```

## Fuera de alcance (no lo incluye este spec)

- OAuth / login social
- 2FA
- Recuperación de contraseña por email
- Rate limiting (se abordará en el review de seguridad)