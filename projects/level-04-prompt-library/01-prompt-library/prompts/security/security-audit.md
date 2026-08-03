# Security audit

## Cuándo usarlo
Cuando necesitas auditar un proyecto en busca de vulnerabilidades de seguridad comunes. Cubre OWASP Top 10, secretos expuestos, dependencias vulnerables y malas prácticas.

## Prompt
```
Realiza una auditoría de seguridad del siguiente código/proyecto.

Código a auditar:
```
{{CODE_TO_AUDIT}}
```

Requisitos:
- Revisa vulnerabilidades OWASP Top 10: {{OWASP_FOCUS}}
- Busca secretos expuestos (API keys, tokens, contraseñas hardcodeadas)
- Revisa dependencias con vulnerabilidades conocidas
- Verifica sanitización de inputs y outputs
- Revisa configuración de CORS, CSP, y headers de seguridad
- Para cada hallazgo, indica: severidad (critical/high/medium/low), ubicación, descripción y fix sugerido
- Stack: {{TECH_STACK}}

Contexto del proyecto:
{{PROJECT_CONTEXT}}
```

## Ejemplo de uso
**Input:**
- `{{CODE_TO_AUDIT}}` = (se pega el código o se indica la ruta del proyecto)
- `{{OWASP_FOCUS}}` = injection, broken authentication, sensitive data exposure, security misconfiguration
- `{{TECH_STACK}}` = Express + TypeScript + Prisma + PostgreSQL
- `{{PROJECT_CONTEXT}}` = API REST de e-commerce en producción

**Output esperado:**
Informe estructurado con hallazgos como:
- 🔴 **CRITICAL** — `src/config/database.ts:12` — Credenciales de BD hardcodeadas. Fix: usar variables de entorno (`process.env.DATABASE_URL`)
- 🔴 **CRITICAL** — `src/routes/users.ts:45` — SQL injection en query raw con concatenación de strings. Fix: usar query parametrizada de Prisma (`prisma.$queryRaw\`...\``)
- 🟠 **HIGH** — `src/app.ts:8` — CORS configurado como `origin: '*'`. Fix: restringir a dominios específicos
- 🟠 **HIGH** — `package.json` — Dependencia `jsonwebtoken@8.5.1` tiene vulnerabilidad conocida (CVE-2022-23529). Fix: actualizar a `jsonwebtoken@9.0.0+`
- 🟡 **MEDIUM** — Sin rate limiting en endpoints de login. Fix: añadir `express-rate-limit`
- 🟢 **LOW** — Sin header `X-Content-Type-Options: nosniff`. Fix: añadir con `helmet`

## Notas
- Ejecuta `npm audit` o `yarn audit` como primer paso para dependencias
- Para secretos en el historial de git, usa `git secrets` o `truffleHog`
- La auditoría de seguridad no reemplaza un pentest profesional — es una primera línea de defensa
- Prioriza los hallazgos críticos y altos — no te pierdas en los low si hay críticos sin resolver
