# Prompt estructurado — Sistema de autenticación con JWT

> **Proyecto:** 3.1 — Sistema de autenticación completo (JWT)
> **Fase del workflow:** Paso 2 — PROMPT
> **Spec de partida:** [`SPEC.md`](./SPEC.md)
> **Fecha:** 2026-07-06

---

## Prompt a enviar a Copilot

```
Actúa como un backend engineer senior especializado en Node.js + Express
y seguridad de autenticación.

Estás construyendo: {{DOMAIN}}.
Spec de partida (respétalo, no inventes requisitos):

{{SPEC}}

## Stack técnico (obligatorio, no sustituyas librerías)
- Node.js + Express
- Prisma + SQLite (persistencia)
- bcrypt (hash de passwords)
- jsonwebtoken (JWT)
- ES modules (import/export, no require)
- async/await (sin .then/.catch)

## Requisitos funcionales a implementar
{{FLOWS}}

## Reglas de negocio
{{BUSINESS_RULES}}

## Estructura de carpetas (respétala exactamente)
src/
  controllers/    # lógica de cada endpoint
  routes/         # definición de rutas Express
  middleware/     # auth, roles, error handler
  models/         # esquema Prisma
  config/         # JWT secret, DB connection
  utils/          # helpers (token gen, etc.)
tests/
  e2e/            # Supertest

## Convenciones de código
- Un controller por entidad, exporta funciones nombradas (no default export).
- Cada ruta en su archivo bajo routes/, montada con un prefijo (ej. /api/auth).
- Middleware de errores centralizado al final de app.js.
- Respuestas JSON consistentes: { data } en éxito, { error } en fallo.
- Nunca loguees secrets ni passwords. Usa variables de entorno (.env).
- Comentarios solo donde el "por qué" no es obvio, nunca el "qué".

## Entregables que espero
1. schema.prisma con las entidades del spec
2. Un archivo por controller, route y middleware
3. app.js con el wiring completo y manejo de errores
4. .env.example con las variables necesarias
5. package.json con scripts dev, start, test
6. README breve con cómo levantarlo

## Restricciones
- No agregues OAuth, 2FA ni recuperación por email (fuera de scope).
- No agregues rate limiting (se abordará en el review de seguridad).
- No inventes endpoints que no estén en el spec.
- Si algo del spec es ambiguo, pregúntame antes de asumir.
```

---

## Placeholders (para reutilizar el template)

| Placeholder | Qué reemplazar | Ejemplo para "pagos" |
|-------------|----------------|---------------------|
| `{{DOMAIN}}` | Descripción corta del sistema | "API de procesamiento de pagos" |
| `{{SPEC}}` | El spec completo en lenguaje natural | Spec de pagos |
| `{{FLOWS}}` | Lista numerada de flujos | Crear cargo, reembolso, webhook... |
| `{{BUSINESS_RULES}}` | Reglas con códigos HTTP y validaciones | Monto > 0, moneda válida... |

El resto del prompt (rol, stack, estructura, convenciones, entregables, restricciones) **se mantiene igual** entre proyectos. Esa es la parte reutilizable del Nivel 3.

---

## Notas de diseño del prompt

- **"respétalo, no inventes requisitos"** → evita el sesgo de Copilot de agregar features que no pediste.
- **"no sustituyas librerías"** → sin esto, Copilot puede cambiar Prisma por Mongoose y romper la consistencia.
- **"pregúntame antes de asumir"** → fuerza el ciclo de feedback en lugar de generar basura silenciosamente.
- **Entregables numerados** → Copilot entrega en orden y puedes verificar uno por uno.
- **Restricciones explícitas** → espejo del "fuera de alcance" del spec, reforzado para que no se le escape.