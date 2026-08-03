# CRUD Template — Prompt reutilizable

> **Uso:** Reemplazar los placeholders `{{ENTITY_NAME}}`, `{{FIELDS}}`, `{{RELATIONS}}`
> y pegar el prompt resultante en Copilot Chat para generar un CRUD completo
> y consistente para cualquier entidad.

---

## Placeholders

| Placeholder | Descripción | Ejemplo |
|-------------|-------------|---------|
| `{{ENTITY_NAME}}` | Nombre de la entidad en PascalCase | `Product` |
| `{{entity}}` | Nombre en camelCase (derivado) | `product` |
| `{{FIELDS}}` | Lista de campos con tipo, validación y restricciones | ver abajo |
| `{{RELATIONS}}` | Relaciones con otras entidades (FK, belongsTo, hasMany) | ver abajo |

### Formato de `{{FIELDS}}`

```
- name: String, requerido, min 1, max 100
- price: Float, requerido, > 0
- description: String, opcional, max 500
- stock: Int, requerido, >= 0
```

### Formato de `{{RELATIONS}}`

```
- Product belongsTo User (campo userId, FK → User.id)
- User hasMany Products
```

Si la entidad no tiene relaciones, usar: `Ninguna`

---

## Prompt

```
Actúa como un backend engineer senior. Genera un CRUD completo para la
entidad {{ENTITY_NAME}} usando el siguiente stack y convenciones.

### Stack
- Node.js + Express (ES Modules — import/export)
- Prisma + SQLite
- Zod (validación de input)
- Jest + Supertest (testing E2E)

### Campos de la entidad
{{FIELDS}}

### Relaciones
{{RELATIONS}}

### Estructura de archivos a generar

1. `prisma/schema.prisma` — añadir el modelo {{ENTITY_NAME}} con los
   campos y relaciones especificadas. Incluir `id` (String, cuid),
   `createdAt` y `updatedAt` (DateTime) automáticamente.

2. `src/schemas/{{entity}}Schema.js` — exportar dos schemas Zod:
   - `create{{ENTITY_NAME}}Schema` — valida el body de POST
   - `update{{ENTITY_NAME}}Schema` — igual al create pero todos
     los campos son opcionales (`.partial()`)

3. `src/controllers/{{entity}}Controller.js` — exportar 5 handlers:
   - `create`   — POST, crea un registro, responde 201
   - `getAll`   — GET, lista todos, responde 200
   - `getById`  — GET /:id, busca por ID, responde 200 o 404
   - `update`   — PUT /:id, actualiza, responde 200 o 404
   - `remove`   — DELETE /:id, elimina, responde 204 o 404

4. `src/routes/{{entity}}Routes.js` — router de Express con:
   - POST   /        → create   (con middleware de validación)
   - GET    /        → getAll
   - GET    /:id     → getById
   - PUT    /:id     → update   (con middleware de validación)
   - DELETE /:id     → remove

5. `src/middleware/validate.js` — middleware genérico que recibe un
   schema Zod, valida `req.body` y responde 400 con formato de error
   si la validación falla.

6. `src/middleware/errorHandler.js` — middleware centralizado que:
   - Mapea `PrismaClientKnownRequestError`:
     - P2002 (unique constraint) → 409 Conflict
     - P2025 (record not found)  → 404 Not Found
   - Errores de Zod → 400 Bad Request
   - Errores genéricos → 500 Internal Server Error

7. `tests/{{entity}}.test.js` — tests E2E con Supertest que cubran:
   - Creación exitosa (201 + data)
   - Validación fallida (400)
   - Obtención por ID (200)
   - ID inexistente (404)
   - Actualización (200)
   - Eliminación (204)

### Reglas obligatorias

- Todo input se valida con Zod antes de llegar al controller
- Respuestas JSON consistentes:
  - Éxito: `{ data: {...} }` o `{ data: [...] }`
  - Error:   `{ error: { code, message } }`
- Status codes: 201 (create), 200 (get/update), 204 (delete),
  400 (validation), 404 (not found), 409 (conflict)
- Si la entidad tiene relaciones:
  - Validar que el FK exista antes de crear (query Prisma + 404 si no existe)
  - Incluir la relación en getById con `include`
- Si un campo se llama "password":
  - Hashear con bcrypt antes de guardar
  - Nunca incluirlo en las respuestas (omitir del select o hacer delete)
- Los tests deben usar una base de datos SQLite de test separada
  (variable `DATABASE_URL` apuntando a `file:./test.db`)
- Los tests deben limpiar la BD entre cada test (beforeEach)

### Formato de salida

Genera cada archivo con su ruta como encabezado en un comentario:

// === src/controllers/productController.js ===

No expliques el código. Solo genera los archivos.
```

---

## Ejemplo de uso

### Para generar Products

Reemplazar:

```
{{ENTITY_NAME}} → Product
{{entity}}      → product
{{FIELDS}}      → - name: String, requerido, min 1, max 100
                   - price: Float, requerido, > 0
                   - description: String, opcional, max 500
                   - stock: Int, requerido, >= 0
{{RELATIONS}}   → - Product belongsTo User (campo userId, FK → User.id)
```

### Para generar Users

Reemplazar:

```
{{ENTITY_NAME}} → User
{{entity}}      → user
{{FIELDS}}      → - name: String, requerido, min 1, max 100
                   - email: String, requerido, formato email, único
                   - password: String, requerido, min 8
{{RELATIONS}}   → - User hasMany Products
```

---

## Verificación de consistencia

Después de generar ambos CRUDs, verificar:

- [ ] Misma estructura de carpetas
- [ ] Mismos status codes en las mismas operaciones
- [ ] Mismo formato de respuesta (`{ data }` / `{ error: { code, message } }`)
- [ ] Mismo patrón de validación (Zod + middleware)
- [ ] Mismo patrón de manejo de errores (errorHandler centralizado)
- [ ] Mismos casos de test cubiertos
- [ ] Mismo estilo de código (ES Modules, async/await, naming)