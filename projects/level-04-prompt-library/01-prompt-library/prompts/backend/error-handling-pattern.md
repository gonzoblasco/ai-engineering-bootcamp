# Error handling pattern (Express)

## Cuándo usarlo
Cuando necesitas implementar o refactorizar el manejo de errores en una API Express. Cubre clases de error personalizadas, middleware global y respuestas estandarizadas.

## Prompt
```
Implementa un sistema de manejo de errores centralizado para Express.

Requisitos:
- Crea una clase {{ERROR_CLASS_NAME}} que extienda de Error con propiedades: statusCode, isOperational
- Crea un middleware global de errores que capture todos los errores
- En desarrollo, incluye el stack trace en la respuesta; en producción, solo el mensaje
- Estandariza el formato de respuesta de error: {{ERROR_RESPONSE_FORMAT}}
- Crea errores específicos para: {{ERROR_TYPES}}

Contexto del proyecto:
{{PROJECT_CONTEXT}}
```

## Ejemplo de uso
**Input:**
- `{{ERROR_CLASS_NAME}}` = AppError
- `{{ERROR_RESPONSE_FORMAT}}` = { status: "error", message: string, statusCode: number }
- `{{ERROR_TYPES}}` = NotFoundError (404), ValidationError (400), UnauthorizedError (401), ForbiddenError (403), ConflictError (409)
- `{{PROJECT_CONTEXT}}` = API REST con Express + TypeScript, entorno definido en NODE_ENV

**Output esperado:**
- `src/errors/AppError.ts` — clase base con statusCode, isOperational, stack
- `src/errors/NotFoundError.ts`, `ValidationError.ts`, etc. — subclases con statusCode fijo
- `src/middleware/errorHandler.ts` — middleware global (err, req, res, next)
- Respuesta en desarrollo: `{ status: "error", message, statusCode, stack }`
- Respuesta en producción: `{ status: "error", message, statusCode }`
- Errores no operacionales (bugs) → 500 + "Internal server error" en producción

## Notas
- Los errores operacionales son esperados (input inválido, recurso no encontrado); los no operacionales son bugs
- En Express 5, el middleware de errores cambia ligeramente — verifica tu versión
- Para errores asíncronos en controllers, usa un wrapper como `express-async-errors` o try/catch con next(err)
