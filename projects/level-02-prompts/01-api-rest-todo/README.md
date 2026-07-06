# Proyecto 2.1 — API REST de To-Do list (Node.js + Express)

> **Nivel:** 2 — Prompts que funcionan 🟢
> **Dificultad:** Principiante-Intermedio
> **Documentación:** [level-02-prompts.md](../../../docs/level-02-prompts.md)

## Descripción

Construye una API REST completa usando SOLO prompts. Sin escribir código manualmente.

## Prompt inicial sugerido

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

## Pasos

1. Usa el prompt anterior en Copilot Chat con `@workspace`
2. Crea los archivos según las sugerencias
3. Instala dependencias y ejecuta
4. Pide tests: *"Genera tests con Jest para cada endpoint"*
5. Pide mejoras: *"Añade paginación y filtering al GET /tasks"*

## Criterios de completitud

- [ ] API funciona con todos los endpoints
- [ ] Validación de input implementada
- [ ] Manejo de errores centralizado
- [ ] Tests con Jest pasando
- [ ] Documentaste qué prompts usaste