# Proyecto 2.1 — API REST de To-Do list (Node.js + Express)

> **Nivel:** 2 — Prompts que funcionan 🟢
> **Dificultad:** Principiante-Intermedio
> **Instrucciones:** [`TASK.md`](./TASK.md) · **Docs del nivel:** [level-02-prompts.md](../../../docs/level-02-prompts.md)

## 📌 Estado

✅ **Completado**

## 📝 Descripción

API REST para gestionar un To-Do list, construida con Express.js usando ES modules. Incluye validación de input con `express-validator`, manejo de errores centralizado mediante middleware, y tests con Jest + supertest. Toda la API fue generada con un único prompt estructurado (rol + contexto + tarea + restricciones).

## 🛠️ Stack

- **Node.js** + **Express.js** — servidor HTTP y routing
- **express-validator** — validación declarativa de inputs
- **dotenv** — configuración por entorno
- **uuid** (`node:crypto`) — identificadores únicos
- **Jest** + **supertest** — tests de integración de endpoints

## 🚀 Cómo ejecutarlo

```bash
# 1. Instala dependencias
npm install

# 2. (Opcional) Copia el .env de ejemplo
cp .env.example .env

# 3. Modo desarrollo (recarga automática con --watch)
npm run dev

# 4. Tests
npm test
```

El servidor levanta en `http://localhost:3000`. Endpoint de salud: `GET /health`.

### Ejemplos de uso

```bash
# Listar tareas (con paginación y filtering)
curl http://localhost:3000/tasks
curl 'http://localhost:3000/tasks?page=2&limit=5'
curl 'http://localhost:3000/tasks?title=api&done=false'
curl 'http://localhost:3000/tasks?page=1&limit=3&title=docs&done=true'

# Crear tarea
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Aprender prompts","done":false}'

# Actualizar tarea
curl -X PUT http://localhost:3000/tasks/<id> \
  -H "Content-Type: application/json" \
  -d '{"done":true}'

# Eliminar tarea
curl -X DELETE http://localhost:3000/tasks/<id>
```

#### Respuesta de GET /tasks con paginación

```json
{
  "data": [ /* array de tareas */ ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 15,
    "totalPages": 2,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## ✨ Features

- [x] CRUD completo: `GET /tasks`, `GET /tasks/:id`, `POST /tasks`, `PUT /tasks/:id`, `DELETE /tasks/:id`
- [x] Validación de input con `express-validator` (título obligatorio, `done` booleano)
- [x] Manejo de errores centralizado en un único middleware
- [x] Respuestas 404 con JSON consistente (no HTML de Express)
- [x] Separación `app.js` / `server.js` para testear sin abrir sockets
- [x] Configuración por entorno con `.env`
- [x] Tests de integración con Jest + supertest (46 tests, todos pasan)
- [x] Endpoint `GET /health` para healthchecks
- [x] **Paginación** en `GET /tasks` (`?page=1&limit=10`) con metadatos `{ page, limit, total, totalPages, hasNext, hasPrev }`
- [x] **Filtering** en `GET /tasks` por título (`?title=api`, substring case-insensitive) y estado (`?done=true|false`)

## 📂 Estructura

```
01-api-rest-todo/
├── .env.example          # Template de variables de entorno
├── .env                  # Configuración local (no se sube a git)
├── .gitignore
├── package.json
├── src/
│   ├── server.js          # Punto de entrada: levanta el servidor HTTP
│   ├── app.js             # App Express: middlewares + rutas + manejadores
│   ├── config/
│   │   └── index.js       # Config centralizada (dotenv)
│   ├── routes/
│   │   └── taskRoutes.js  # Rutas de /tasks + validaciones
│   ├── controllers/
│   │   └── taskController.js  # Lógica de cada endpoint
│   ├── models/
│   │   └── taskModel.js   # Almacén en memoria (Map) — sustituible por DB
│   └── middleware/
│       ├── validateTask.js   # Reglas de express-validator
│       ├── validateResult.js # Recolecta errores de validación -> 400
│       ├── notFound.js       # 404 para rutas inexistentes
│       └── errorHandler.js   # Manejo de errores centralizado
└── tests/
    └── taskRoutes.test.js    # 13 tests de integración
```

## 📝 Prompts usados

### Prompt 1 — Generación de la API (rol + contexto + tarea + restricciones)

```
Actúa como un ingeniero senior de Node.js.
Crea una API REST para un To-Do list con Express.js.

Requisitos:
- Endpoints: GET /tasks, GET /tasks/:id, POST /tasks, PUT /tasks/:id, DELETE /tasks/:id
- Validación de input con express-validator
- Manejo de errores centralizado con middleware
- Estructura: routes/, controllers/, models/, middleware/
- Usa ES modules (import/export)
- Incluye un archivo .env para configuración
- Código production-ready con comentarios explicativos

Genera todos los archivos necesarios.
```

### Prompt 2 — Tests (encadenado sobre lo construido)

```
Genera tests con Jest para cada endpoint
```

### Prompt 3 — Mejas: paginación y filtering (prompt iterativo)

```
Añade paginación y filtering al GET /tasks
```

## ✅ Criterios de completitud

- [x] API funciona con todos los endpoints
- [x] Validación de input implementada
- [x] Manejo de errores centralizado
- [x] Tests con Jest pasando (13/13)
- [x] Documentaste qué prompts usaste