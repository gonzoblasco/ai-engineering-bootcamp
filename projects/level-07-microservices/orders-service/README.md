# Orders Service

Microservicio de órdenes del sistema del AI Engineering Bootcamp.

## Endpoints

- `GET /health` — health check
- `POST /orders` — crea una orden `{ userId, product, amount }`
- `GET /orders` — lista órdenes (`?userId=X` filtra)
- `GET /orders/:id` — obtiene una orden

## Eventos

- **Emite:** `order.created`, `order.updated`, `order.cancelled`
- **Consume:** `user.deleted` (cancela órdenes del usuario eliminado)

## Puerto

`3002`
