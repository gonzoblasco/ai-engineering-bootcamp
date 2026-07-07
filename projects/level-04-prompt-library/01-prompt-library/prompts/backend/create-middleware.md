# Create middleware (Express)

## Cuándo usarlo
Cuando necesitas crear un middleware de Express para autenticación, logging, rate limiting, CORS, validación o cualquier lógica transversal.

## Prompt
```
Crea un middleware de Express para {{MIDDLEWARE_PURPOSE}}.

Requisitos:
- Usa Express + TypeScript
- El middleware debe {{BEHAVIOR_DESCRIPTION}}
- En caso de error, responde con HTTP {{ERROR_STATUS}} y mensaje: "{{ERROR_MESSAGE}}"
- En caso de éxito, llama a next() y adjunta {{ATTACHED_DATA}} a req
- Exporta como función nombrada {{MIDDLEWARE_NAME}}

Contexto del proyecto:
{{PROJECT_CONTEXT}}
```

## Ejemplo de uso
**Input:**
- `{{MIDDLEWARE_PURPOSE}}` = autenticación JWT
- `{{BEHAVIOR_DESCRIPTION}}` = extraer el token del header Authorization, verificarlo con jsonwebtoken, y adjuntar el payload decodificado a req.user
- `{{ERROR_STATUS}}` = 401
- `{{ERROR_MESSAGE}}` = Token inválido o expirado
- `{{ATTACHED_DATA}}` = { userId, role } en req.user
- `{{MIDDLEWARE_NAME}}` = authenticate
- `{{PROJECT_CONTEXT}}` = Express + TypeScript, JWT secret en variable de entorno JWT_SECRET

**Output esperado:**
- `src/middleware/authenticate.ts` — extrae token de `Authorization: Bearer <token>`, verifica con `jwt.verify`, adjunta `req.user`
- Tipos extendidos de Request con `user?: { userId: string; role: string }`
- Manejo de errores: token ausente → 401, token inválido → 401, token expirado → 401

## Notas
- Requiere `jsonwebtoken` y `@types/jsonwebtoken` instalados
- Para middlewares encadenados, crea uno por archivo y compónelos en la ruta
- Si el middleware necesita acceso a BD (ej: verificar permisos), inyéctalo como dependencia
