# Input validation review

## Cuándo usarlo
Cuando necesitas revisar y fortalecer la validación de inputs en una API o formulario para prevenir inyecciones, XSS, y datos malformados.

## Prompt
```
Revisa y fortalece la validación de inputs en el siguiente código.

Código a revisar:
```
{{CODE_TO_REVIEW}}
```

Requisitos:
- Identifica todos los puntos de entrada de datos (req.body, req.params, req.query, headers, file uploads)
- Verifica que cada input tenga validación de tipo, longitud, formato y rango
- Asegura sanitización contra XSS (escapar HTML, usar DOMPurify en frontend)
- Verifica protección contra NoSQL injection (si usa MongoDB) o SQL injection (si usa SQL)
- Añade validación con {{VALIDATION_LIBRARY}} (Zod / Joi / express-validator)
- Para file uploads: verifica tipo MIME, tamaño máximo, y escaneo de malware
- Stack: {{TECH_STACK}}

Contexto del proyecto:
{{PROJECT_CONTEXT}}
```

## Ejemplo de uso
**Input:**
- `{{CODE_TO_REVIEW}}` = endpoint POST /api/users con body { email, name, age, role }
- `{{VALIDATION_LIBRARY}}` = Zod
- `{{TECH_STACK}}` = Express + TypeScript
- `{{PROJECT_CONTEXT}}` = API REST de usuarios

**Output esperado:**
- Schema Zod con validaciones estrictas:
  - `email`: `z.string().email().max(255).trim().toLowerCase()`
  - `name`: `z.string().min(2).max(100).trim().regex(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s'-]+$/)` — evita caracteres especiales
  - `age`: `z.number().int().min(0).max(150)`
  - `role`: `z.enum(['user', 'admin']).default('user')` — evita privilege escalation
- Middleware de validación que rechaza requests con 400 + detalles de error
- Sanitización: `name` se escapa antes de devolver en responses HTML
- Protección contra prototype pollution: no usar `_.merge` o `Object.assign` con user input
- Rate limiting específico para este endpoint: 5 requests/min desde misma IP

## Notas
- Nunca confíes en validación solo del frontend — siempre valida en el backend
- Zod es preferible a Joi en proyectos TypeScript por su inferencia de tipos automática
- Para sanitización HTML en Node.js, usa `sanitize-html` o `xss`
- Los parámetros de ruta (`req.params`) también necesitan validación — especialmente si se usan en queries
- Para IDs, valida que sean UUIDs o ObjectIds según tu BD, no solo strings
