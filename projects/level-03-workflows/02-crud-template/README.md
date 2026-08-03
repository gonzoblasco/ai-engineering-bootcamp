# Proyecto 3.2 — CRUD con validación y manejo de errores (template)

> **Nivel:** 3 — Workflows estructurados 🟡
> **Dificultad:** Intermedio
> **Instrucciones:** [`TASK.md`](./TASK.md) · **Docs del nivel:** [level-03-workflows.md](../../../docs/level-03-workflows.md)

## 📌 Estado

✅ **Completado**

## 📝 Descripción

API REST con dos CRUDs (Products y Users) generados a partir de un mismo
**prompt template reutilizable** con placeholders. El objetivo del proyecto
es demostrar que un template bien diseñado produce código consistente
sin importar la entidad.

El template vive en [`docs/templates/crud-template.md`](./docs/templates/crud-template.md)
y usa los placeholders `{{ENTITY_NAME}}`, `{{FIELDS}}` y `{{RELATIONS}}`.

## 🛠️ Stack

- **Node.js + Express** — servidor HTTP (ES Modules)
- **Prisma + SQLite** — persistencia
- **Zod** — validación de input
- **bcrypt** — hash de passwords
- **Jest + Supertest** — tests E2E

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

- [x] Prompt template con placeholders `{{ENTITY_NAME}}`, `{{FIELDS}}`, `{{RELATIONS}}`
- [x] CRUD de Products generado y funcional (5 endpoints)
- [x] CRUD de Users generado y funcional (5 endpoints)
- [x] Validación de input con Zod en POST y PUT
- [x] Middleware de validación genérico (`validate.js`)
- [x] Middleware de manejo de errores centralizado (`errorHandler.js`)
- [x] Mapeo de errores de Prisma: P2002 → 409, P2025 → 404
- [x] Hash de passwords con bcrypt (Users)
- [x] Password nunca se devuelve en respuestas (Users)
- [x] Validación de FK: verificar que `userId` exista antes de crear Product
- [x] `include` de relaciones en `getById` (Product incluye user, User incluye products)
- [x] Formato de respuesta consistente: `{ data }` / `{ error: { code, message } }`
- [x] Tests E2E con Supertest (20 tests, 10 por entidad)

## 📂 Estructura

```
02-crud-template/
  package.json
  jest.config.js
  .env.example
  prisma/
    schema.prisma                 # modelos Product + User con relación
  src/
    app.js                        # wiring de Express + rutas + errorHandler
    server.js                     # arranque del servidor
    config/
      index.js                    # env vars
      db.js                       # Prisma client
    middleware/
      errorHandler.js             # manejo centralizado (Prisma → HTTP)
      validate.js                 # wrapper Zod → middleware
    controllers/
      productController.js        # create, getAll, getById, update, remove
      userController.js           # create, getAll, getById, update, remove
    routes/
      productRoutes.js            # POST/GET/GET:id/PUT:id/DELETE:id
      userRoutes.js               # POST/GET/GET:id/PUT:id/DELETE:id
    schemas/
      productSchema.js            # createProductSchema, updateProductSchema
      userSchema.js               # createUserSchema, updateUserSchema
  tests/
    product.test.js               # 10 tests E2E
    user.test.js                  # 10 tests E2E
  docs/
    templates/
      crud-template.md            # ⭐ prompt template reutilizable
```

## 🔄 Verificación de consistencia

Ambos CRUDs siguen exactamente el mismo patrón:

| Aspecto | Products | Users |
|---------|----------|-------|
| Estructura de archivos | `schemas/`, `controllers/`, `routes/` | idéntica |
| Endpoints | POST, GET, GET/:id, PUT/:id, DELETE/:id | idéntica |
| Validación | Zod + `validate` middleware | idéntica |
| Status codes | 201, 200, 204, 400, 404, 409 | idéntica |
| Formato respuesta | `{ data }` / `{ error: { code, message } }` | idéntica |
| Manejo de errores | `errorHandler` centralizado | idéntica |
| Tests | 10 casos E2E con Supertest | idéntica |
| Relaciones | `include: { user }` en getById | `include: { products }` en getById |
| Caso especial | valida FK `userId` antes de crear | hashea password, nunca la devuelve |

## ✅ Criterios de completitud

- [x] Prompt template con placeholders funcionando
- [x] CRUD de Products generado y funcional
- [x] CRUD de Users generado y funcional
- [x] Estructura consistente entre ambos
- [x] Template guardado y documentado