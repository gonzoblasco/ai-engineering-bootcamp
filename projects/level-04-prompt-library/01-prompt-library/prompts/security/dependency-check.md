# Dependency check

## Cuándo usarlo
Cuando necesitas auditar las dependencias de un proyecto en busca de vulnerabilidades conocidas, licencias problemáticas, dependencias no mantenidas o innecesarias.

## Prompt
```
Audita las dependencias del proyecto en busca de problemas de seguridad y mantenibilidad.

Requisitos:
- Ejecuta el equivalente a `{{AUDIT_COMMAND}}` (npm audit / yarn audit / pip audit / cargo audit)
- Identifica dependencias con vulnerabilidades conocidas (CVE) y sugiere actualizaciones
- Revisa licencias de dependencias — marca las que no sean compatibles con {{LICENSE_TYPE}}
- Identifica dependencias no mantenidas (sin commits en > 1 año)
- Sugiere eliminar dependencias no usadas
- Revisa dependencias transitivas problemáticas
- Stack: {{TECH_STACK}}

Contexto del proyecto:
{{PROJECT_CONTEXT}}
```

## Ejemplo de uso
**Input:**
- `{{AUDIT_COMMAND}}` = npm audit
- `{{LICENSE_TYPE}}` = MIT
- `{{TECH_STACK}}` = Node.js + Express
- `{{PROJECT_CONTEXT}}` = API REST en producción, package.json con 200+ dependencias

**Output esperado:**
Informe de dependencias:
- 🔴 **VULNERABILIDADES CRÍTICAS:**
  - `express@4.18.2` → actualizar a `4.21.0+` (CVE-2024-29041: open redirect)
  - `body-parser@1.20.2` → actualizar a `1.20.3+` (CVE-2024-45590: DoS)
- 🟠 **LICENCIAS PROBLEMÁTICAS:**
  - `some-lib@2.0.0` usa GPL-3.0 — incompatible con MIT. Sugerir alternativa: `another-lib` (MIT)
- 🟡 **NO MANTENIDAS:**
  - `abandoned-pkg@1.5.0` — último commit hace 2 años, 50 issues abiertos sin respuesta
- 🟢 **NO USADAS (sugerir eliminar):**
  - `moment@2.30.1` — no se usa en el código (verificado con `npx depcheck`). Usar `date-fns` o `luxon` si se necesita
  - `lodash@4.17.21` — solo se usa `_.get`, reemplazable por optional chaining (`?.`)
- 📊 **Resumen:** 2 críticas, 1 licencia, 1 no mantenida, 2 no usadas

## Notas
- Ejecuta `npx depcheck` o `npm-check` para encontrar dependencias no usadas
- Para licencias, usa `npx license-checker --summary` o `fossa-cli`
- Las dependencias transitivas se auditan con `npm audit` (incluye la flag `--all` para ver el árbol completo)
- No actualices todo de golpe en producción — prioriza críticas, prueba en staging, y despliega con rollback plan
- Considera usar `renovate` o `dependabot` para automatizar actualizaciones de dependencias
