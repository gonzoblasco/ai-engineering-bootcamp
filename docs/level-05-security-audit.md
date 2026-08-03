# Nivel 5 — Seguridad y auditoría con IA 🔴

> **Meta:** Usar la IA como primer filtro de seguridad. Aprender qué detecta bien, qué no, y cómo construir un pipeline de auditoría automatizada.
>
> **Dificultad:** Intermedio-Avanzado | **Proyecto:** 7 (5 pasos core + 2 ejercicios) | **Tiempo estimado:** 2-3 horas

---

## 🧠 Teoría — IA como filtro de seguridad, no como auditor

### Lo que la IA detecta bien

La IA es excelente para encontrar **patrones de vulnerabilidad conocidos** porque aparecen millones de veces en su training data:

| Vulnerabilidad | Por qué la IA la detecta bien |
|---|---|
| **Hardcoded secrets** | Patrón claro: `password =`, `API_KEY=`, `token = "..."` |
| **SQL injection** | Strings concatenadas en queries: `"SELECT * FROM users WHERE id = " + id` |
| **XSS** | `innerHTML`, `dangerouslySetInnerHTML`, template strings sin escape |
| **Dependencias viejas** | `package.json` con versiones específicas — la IA conoce CVEs públicos |
| **Permisos excesivos** | `chmod 777`, `CORS: *`, `admin: admin` |

Son patrones. La IA vive de patrones.

### Lo que la IA NO detecta

| Vulnerabilidad | Por qué la IA falla |
|---|---|
| **Lógica de negocio** | "Cualquier usuario puede cancelar cualquier pedido" no es un patrón, es una regla de negocio |
| **Autorización contextual** | "Este usuario debería poder ver esta factura" depende del estado de la sesión, no del código |
| **Timing attacks** | No se ven en el código fuente |
| **Vulnerabilidades zero-day** | No están en el training data |
| **Falsos positivos** | La IA marca `password` en un test como secreto — no entiende que es un test |

**Regla de oro:** la IA es un **primer filtro**. Encuentra lo obvio rápido. Lo sutil, lo contextual, lo nuevo — lo revisa un humano.

### Security posture scoring

Un audit de seguridad no es una lista de "está bien / está mal". Es un espectro:

```
Crítico → Alto → Medio → Bajo → Informativo
```

Cada hallazgo tiene:
- **Severidad** — impacto potencial
- **Confianza** — qué tan seguro estoy de que es real (no falso positivo)
- **Remediación** — qué hacer para arreglarlo
- **Contexto** — dónde está, por qué pasa, cómo explotarlo

La IA puede asignar severidad y sugerir remediación. La confianza y el contexto los tiene que validar un humano.

### El pipeline de auditoría

```
Código fuente → [Detectores locales] → [Análisis IA] → Reporte consolidado
```

1. **Detectores locales** — reglas rápidas y determinísticas (regex, AST parsing). Cero falsos positivos.
2. **Análisis IA** — contexto, patrones difusos, sugerencias. Puede tener falsos positivos.
3. **Reporte consolidado** — merge de ambos, con severidad, confianza, y remediación.

---

## 🛠️ Práctica — Security Audit CLI

Vas a construir un CLI que analice un proyecto Node.js en busca de vulnerabilidades comunes, combinando reglas locales con análisis de IA.

### Setup

```bash
mkdir -p projects/level-05-security-audit/security-cli/{detectors,reports}
cd projects/level-05-security-audit/security-cli
npm init -y
```

### Paso 1: Detector de secrets hardcodeados

Construí un detector local que busque patrones de secrets en archivos de código:

Prompt:

> "Creá un detector de secrets hardcodeados en Node.js. Debe escanear archivos .js, .ts, .env, .json, .yaml, y .yml buscando:
> - Asignaciones a variables con nombres como password, secret, token, apiKey, api_key, apikey, credentials, auth
> - URLs con credenciales incrustadas (https://user:pass@host)
> - Archivos .env con valores que no son placeholders
> - Tokens JWT hardcodeados (strings que empiezan con eyJ)
> - Private keys (-----BEGIN.*PRIVATE KEY-----)
>
> Debe devolver un array de objetos con: { file, line, type, secret, context }
> type puede ser: 'password', 'api-key', 'jwt-token', 'private-key', 'url-credentials'
> context es la línea completa (truncada a 120 caracteres)
>
> Ignorá node_modules/ y .git/ automáticamente.
> Ignorá valores que sean claramente placeholders (ej: 'your-password-here', 'CHANGE_ME')."

### Paso 2: Detector de SQL injection y XSS

Prompt:

> "Creá un detector de SQL injection y XSS en Node.js. Debe escanear archivos .js y .ts buscando:
>
> SQL Injection:
> - Strings concatenadas en queries SQL: `'SELECT * FROM ' +`, `` `SELECT * FROM ${` ``
> - Template literals dentro de db.query(), db.execute(), pool.query()
> - Uso de .exec() con strings dinámicos en SQLite
>
> XSS:
> - innerHTML, outerHTML, insertAdjacentHTML
> - dangerouslySetInnerHTML en JSX
> - document.write()
> - Uso de .html() de jQuery
>
> Debe devolver: { file, line, type, snippet, risk }
> type: 'sql-injection' | 'xss'
> risk: 'high' | 'medium'
> snippet: 50 caracteres alrededor del hallazgo"

### Paso 3: Detector de dependencias con CVEs

Prompt:

> "Creá un detector de dependencias vulnerables en Node.js. Debe:
> - Leer package.json y package-lock.json
> - Tener una lista interna de paquetes con CVEs conocidos (simulada, con al menos 10 entradas)
> - Comparar las versiones instaladas contra la lista
> - Detectar versiones exactas (ej: express@4.17.1) y rangos (ej: ^4.16.0)
> - Devolver: { package, installed, vulnerable, cve, severity, fixedIn }
>
> Lista simulada de vulnerabilidades (para el ejercicio):
> - express < 4.18.0 → CVE-2022-24999, high (Open Redirect)
> - lodash < 4.17.21 → CVE-2021-23337, high (Prototype Pollution)
> - axios < 0.21.2 → CVE-2021-3749, medium (SSRF)
> - json5 < 2.2.2 → CVE-2022-46175, high (Prototype Pollution)
> - minimist < 1.2.6 → CVE-2021-44906, medium (Prototype Pollution)
> - node-fetch < 2.6.7 → CVE-2022-0235, medium (URL Injection)
> - shelljs < 0.8.5 → CVE-2022-0144, high (Command Injection)
> - follow-redirects < 1.14.8 → CVE-2022-0536, medium (Credentials Leak)
> - qs < 6.7.3 → CVE-2022-24999, medium (Prototype Pollution)
> - ejs < 3.1.7 → CVE-2022-29078, high (RCE)"

### Paso 4: Análisis con IA (simulado)

Ahora conectá los detectores locales con un análisis de IA. Como no tenemos acceso a una API de IA en este ejercicio, simulá el análisis con reglas contextuales:

Prompt:

> "Creá un módulo ai-analyzer.js que tome los hallazgos de los detectores locales y los enriquezca con:
>
> 1. **Severidad consolidada** — si un hallazgo aparece en múltiples detectores, subí la severidad
> 2. **Falso positivo** — detectá patrones que probablemente sean falsos positivos:
>    - Secrets en archivos de test (__tests__, *.test.js, *.spec.js)
>    - SQL injection en archivos que no importan db/sql libraries
>    - XSS en archivos que no son componentes UI
> 3. **Remediación sugerida** — para cada hallazgo, generá una sugerencia concreta
> 4. **Puntaje general** — 1-10 basado en: cantidad de hallazgos, severidad máxima, proporción de falsos positivos
>
> El módulo debe exportar: function analyze(results, projectRoot) → { score, summary, findings }"

### Paso 5: El CLI completo

Prompt:

> "Creá un CLI security-audit.js que:
> - Acepte --path (ruta del proyecto a auditar, default .)
> - Acepte --output (ruta del reporte, default security-audit.md)
> - Acepte --ai (habilita análisis con IA simulado)
> - Corra todos los detectores sobre los archivos del proyecto
> - Si --ai está activo, pase los resultados por el ai-analyzer
> - Genere un reporte markdown con:
>   - Resumen ejecutivo (puntaje, total de hallazgos, críticos)
>   - Tabla de hallazgos (archivo, línea, tipo, severidad, descripción)
>   - Detalle por categoría (secrets, injection, dependencies)
>   - Recomendaciones priorizadas
> - Use shebang y agregue bin al package.json como 'security-audit'"

### Criterios de completitud

- [ ] El detector de secrets encuentra al menos 3 tipos diferentes
- [ ] El detector de SQL injection y XSS funciona
- [ ] El detector de dependencias detecta versiones vulnerables
- [ ] El análisis con IA (simulado) asigna severidad y detecta falsos positivos
- [ ] Probaste contra un proyecto real (ej: el nivel 2 o 3)
- [ ] El reporte markdown es legible y accionable
- [ ] Agregaste al menos un detector propio

---

## 🛠️ Ejercicio 6 — Exploit Lab 🔴 core

> **Descripción:** Escribí un exploit real contra tu propio código vulnerable. Enseña a *entender* la vulnerabilidad atacándola, no solo detectándola.

Un detector te dice *dónde* está el problema. Un exploit te demuestra *por qué* es un problema. Hasta que no lo explotás, no lo entendés de verdad.

### Pasos

1. **Creá un objetivo vulnerable.** Escribí (o pedile a la IA que escriba) una app Express mínima con una de estas vulnerabilidades deliberadas:
   - SQL injection en un endpoint de búsqueda
   - XSS reflejado en un parámetro de query
   - Secrets hardcodeados en un endpoint de auth
2. **Escribí el exploit ANTES de correrlo.** En un archivo `exploit.js` (o un curl), documentá tu predicción: qué endpoint vas a atacar, con qué payload, y qué esperás que pase.
3. **Ejecutá el exploit.** Demostrá que la vulnerabilidad es real:
   - SQLi: `' OR '1'='1` te devuelve más datos de los que debería
   - XSS: un `<script>alert(1)</script>` se ejecuta en el navegador
   - Secrets: extraés la credencial hardcodeada
4. **Confirmá que tu auditoría lo detecta.** Corré tu `security-audit --path <objetivo> --ai` y verificá que marca la misma vulnerabilidad. ¿Coinciden? ¿Tu exploit encontró algo que el auditor no?
5. **Remedialo** y re-ejecutá el exploit. Confirmá que ya no funciona.

### Criterios de completitud

- [ ] Escribiste tu predicción del exploit antes de correrlo
- [ ] El exploit demostró la vulnerabilidad (no solo la nombraste)
- [ ] Tu auditoría detecta la misma vulnerabilidad que el exploit
- [ ] Después de remediar, el exploit ya no funciona
- [ ] Podés explicar la vulnerabilidad *desde el lado del atacante*

> 💡 **La conclusión:** un detector que no coincide con un exploit real no está funcionando. El exploit es la prueba de fuego de tu auditoría — si el auditor no encuentra lo que el atacante sí explota, tu pipeline te está dando falsa seguridad.

---

## 🛠️ Ejercicio 7 — Falso Positivo Hunt 🟠 stretch

> **Descripción:** Corré tu auditoría contra código deliberadamente inocente y cazá los falsos positivos. Enseña el problema #1 real de la seguridad asistida por IA: la confianza falsa.

El peor falso positivo no es un fastidio — es una distracción que tapa el hallazgo real. Aprender a reconocerlos es tan importante como detectar vulnerabilidades.

### Pasos

1. **Creá código inocente que engañe.** Escribí (o pedile a la IA que escriba) un archivo que *parezca* vulnerable pero no lo sea:
   - `password` como nombre de variable en un test
   - Un string con `SELECT` que no es SQL (una constante, una plantilla)
   - `innerHTML` en un componente que escapa correctamente
2. **Corré tu auditoría** contra ese archivo con `--ai`.
3. **Registrá cada falso positivo:** qué marcó, por qué es falso, y qué regla/pista lo delataría.
4. **Ajustá tu ai-analyzer** para reducir al menos un falso positivo (mejor heurística, mejor contexto).
5. **Re-coré** y confirmá que el falso positivo desapareció sin romper la detección real.
6. Escribí una frase: qué aprendiste sobre por qué la IA marca de más, y cómo lo manejás en un pipeline real.

### Criterios de completitud

- [ ] Creaste código inocente que engaña a tu auditoría
- [ ] Registraste cada falso positivo con su causa
- [ ] Ajustaste el analizador y eliminaste al menos un falso positivo
- [ ] Confirmaste que la detección real sigue funcionando
- [ ] Podés explicar por qué los falsos positivos son peligrosos, no solo molestos

> 💡 **La conclusión:** la IA marca de más porque ve patrones, no contexto. En un pipeline real, los falsos positivos son el mayor costo oculto — cada uno es ruido que puede tapar el hallazgo que importa. El detector que aprende a callarse cuando debe vale más que el que nunca se calla.

---

## 📣 LinkedIn — Post para publicar

---

**Usé IA para auditar seguridad. Esto es lo que aprendí 🛡️**

Nivel 5 del AI Engineering Bootcamp: Seguridad y auditoría con IA.

Construí un Security Audit CLI que combina:
- Detectores locales (secrets, SQL injection, XSS, CVEs)
- Análisis de IA para contexto y falsos positivos
- Reporte consolidado con puntaje y remediación

Lo más importante que aprendí:
- La IA es excelente para patrones conocidos (secrets, injection)
- La IA es pésima para contexto de negocio (autorización, lógica)
- El mejor pipeline: detectores locales rápidos + IA contextual + humano valida

La IA no reemplaza al auditor. Lo hace más rápido.

Próximo nivel: CI/CD con IA — GitHub Actions + release notes automáticos.

#AIEngineering #Security #DevSecOps #NodeJS #CyberSecurity

---

## Self-review

Antes de pasar al Nivel 6, respondé:

- [ ] ¿Entendés qué vulnerabilidades la IA detecta bien y cuáles no?
- [ ] ¿Construiste detectores locales para secrets, injection, y dependencias?
- [ ] ¿El análisis de IA (simulado) asigna severidad y detecta falsos positivos?
- [ ] ¿Probaste contra un proyecto real y revisaste los resultados?
- [ ] ¿El reporte generado es accionable (no solo una lista de problemas)?
- [ ] ¿Demostraste una vulnerabilidad con un exploit, no solo la nombraste?
- [ ] ¿Reduciste falsos positivos sin romper la detección real?

→ Si respondiste "sí" a todo, avanzá al **Nivel 6**.

---

## Verificación (auto-check)

Corré el checklist para confirmar que completaste los ejercicios:

```bash
cd projects/level-05-security-audit
node verify.js
```

`verify.js` chequea: el security-cli con detectores, la evidencia del exploit lab (ejercicio 6) y el registro de falsos positivos (ejercicio 7). Confirma *esfuerzo*, no *calidad* — la calidad la juzgás vos contra el self-review de arriba.

> Mismo template que los niveles 1-4. Confirma esfuerzo + rúbrica que guía el juicio.
