# Users Service

Microservicio de usuarios del sistema del AI Engineering Bootcamp.

## Endpoints

- `GET /health` — health check
- `POST /users` — crea un usuario `{ name, email }`
- `GET /users` — lista usuarios
- `GET /users/:id` — obtiene un usuario
- `DELETE /users/:id` — elimina un usuario

## Eventos

- **Emite:** `user.created`, `user.deleted`
- **Consume:** ninguno

## Puerto

`3001`
