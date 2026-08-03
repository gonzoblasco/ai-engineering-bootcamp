# Copilot Instructions — pr_vscode_niveles

## Stack tecnológico

- **Runtime:** Node.js (ESM, `"type": "module"` en package.json)
- **Framework:** Express.js
- **Testing:** Jest + Supertest
- **ORM:** Prisma (cuando se necesite persistencia)
- **Utilidades:** dotenv, express-validator, uuid, bcrypt, jsonwebtoken

## Convenciones de naming

- **Archivos:** camelCase (`taskController.js`, `authRoutes.js`)
- **Funciones y variables:** camelCase (`listTasks`, `createUser`)
- **Constantes:** UPPER_SNAKE_CASE (`MAX_RETRIES`, `JWT_SECRET`)
- **Clases:** PascalCase (si se usan)
- **Endpoints:** kebab-case en URLs (`/api/reset-tokens`)

## Estructura de carpetas obligatoria

```
src/
  app.js          # Monta Express (middlewares, rutas, error handlers)
  server.js       # Levanta el servidor HTTP (importa app)
  config/         # Configuración y variables de entorno
  controllers/     # Handlers de rutas (request → response)
  middleware/      # Middlewares (auth, validation, errorHandler, notFound)
  models/          # Lógica de datos / acceso a DB
  routes/         # Definición de rutas Express
  utils/           # Helpers y utilidades
tests/            # Espeja la estructura de src/
```

**Regla:** `app.js` y `server.js` son archivos separados. `app.js` exporta la instancia de Express para que los tests la importen sin levantar el servidor.

## Patrones a seguir

- **Separación por capas:** Route → Controller → Model. El controller delega lógica de negocio en el modelo, nunca accede a DB directamente.
- **Error handling centralizado:** Los controllers pasan errores con `next(err)`. Un middleware `errorHandler` al final de la cadena los captura y responde con JSON.
- **404 antes de errorHandler:** El middleware `notFound` va antes de `errorHandler` para capturar rutas inexistentes.
- **Health check:** Todo proyecto expone `GET /health` → `{ status: "ok" }`.
- **Factory function:** Si la app necesita configuración dinámica, usar `createApp()` que retorna la instancia de Express.
- **Validación de input:** Usar `express-validator` en las rutas, antes del controller.

## Patrones a evitar

- ❌ No usar `require()` — este repo es ESM, usar `import/export`
- ❌ No omitir la extensión `.js` en los imports (`import { x } from './y.js'`, no `'./y'`)
- ❌ No poner try/catch en cada controller — delegar al errorHandler
- ❌ No usar `app.listen()` en `app.js` — solo en `server.js`
- ❌ No mezclar lógica de DB en los controllers
- ❌ No usar `var` — usar `const` por defecto, `let` si necesita reasignación

## Reglas de seguridad

- ❌ No usar `eval()` ni `Function()`
- ❌ No usar `innerHTML` (en cualquier código frontend)
- ❌ No hardcodear secrets — usar `dotenv` y `process.env`
- ✅ Sanitizar todo input de usuario con `express-validator`
- ✅ Hashear passwords con `bcrypt` (nunca en texto plano)
- ✅ Validar JWT en middleware de auth antes de llegar al controller
- ✅ Usar parámetros parametrizados en queries (nunca string concatenation con SQL)

## Reglas de testing

- **Framework:** Jest con `--experimental-vm-modules` (ESM)
- **Integración:** Supertest importando `app` directamente (sin levantar servidor)
- **Estructura:** `tests/` espeja `src/` (`tests/taskModel.test.js` para `src/models/taskModel.js`)
- **Cobertura mínima:** 80%
- **Qué testear:**
  - Cada endpoint (status code + body shape)
  - Casos de error (400, 404, 500)
  - Validación de input
  - Modelos/unitarios para lógica de negocio
- **Naming:** `*.test.js` (no `*.spec.js`)
- **Estilo:** `describe`/`it` con texto en español

## Formato de commits

Conventional Commits:

```
feat: añadir endpoint de refresh tokens
fix: corregir validación de email duplicado
docs: actualizar README del proyecto
refactor: extraer validación a middleware
test: añadir tests de integración para /tasks
chore: actualizar dependencias
```

- Mensaje en infinitivo, minúscula, sin punto final
- Máximo 72 caracteres en el título
- Body opcional separado por línea en blanco

## Estilo de código

- JSDoc en toda función exportada
- Comentarios en español
- Imports agrupados: (1) node builtins, (2) externos, (3) internos
- Sin punto y coma al final (estilo del repo)
- Comillas simples para strings