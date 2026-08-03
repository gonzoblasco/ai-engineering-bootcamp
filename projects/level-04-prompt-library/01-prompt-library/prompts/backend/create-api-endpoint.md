# Create API endpoint (Express + TypeScript)

## Cuándo usarlo
Cuando necesitas crear un endpoint REST completo en un proyecto Express + TypeScript. Cubre ruta, controller, validación Zod, manejo de errores y test unitario.

## Prompt
```
Crea un endpoint {{HTTP_METHOD}} en la ruta "{{ROUTE}}" para el recurso {{RESOURCE_NAME}}.

Requisitos:
- Usa Express + TypeScript
- Valida el input con Zod (schema: {{ZOD_SCHEMA}})
- Devuelve HTTP {{SUCCESS_STATUS}} en caso de éxito
- Maneja errores con el patrón de middleware centralizado
- Genera el controller, la ruta y el test unitario

Contexto del proyecto:
{{PROJECT_CONTEXT}}
```

## Ejemplo de uso
**Input:**
- `{{HTTP_METHOD}}` = POST
- `{{ROUTE}}` = /api/users
- `{{RESOURCE_NAME}}` = User
- `{{ZOD_SCHEMA}}` = { email: z.string().email(), name: z.string().min(2), age: z.number().min(0) }
- `{{SUCCESS_STATUS}}` = 201
- `{{PROJECT_CONTEXT}}` = Proyecto Express + Prisma + TypeScript, estructura en capas (controllers/routes/middleware)

**Output esperado:**
- `src/controllers/userController.ts` — función `createUser` con try/catch
- `src/routes/userRoutes.ts` — `router.post('/', createUser)`
- `src/schemas/userSchema.ts` — schema Zod
- `tests/userController.test.ts` — caso éxito 201 + caso validación falla 400

## Notas
- Asume que Express, Zod y Jest ya están configurados en el proyecto
- Si usas otro ORM (no Prisma), ajusta la capa de persistencia manualmente
- Para endpoints GET, ajusta `{{SUCCESS_STATUS}}` a 200
