# Nivel 6 — CI/CD con IA 🔵

> **Meta:** Integrar IA en pipelines de CI/CD. Automatizar release notes, code review en PRs, y detección de breaking changes sin bloquear el deploy.
>
> **Dificultad:** Intermedio-Avanzado | **Proyecto:** 6 | **Tiempo estimado:** 90-120 minutos

---

## 🧠 Teoría — IA en el pipeline, no como gatekeeper

### El problema de la IA en CI/CD

El peor error es poner la IA como **gatekeeper** — "si la IA no aprueba, no se deploya". La IA alucina, tiene falsos positivos, y no entiende contexto de negocio. Si bloquea un deploy por un falso positivo, el equipo pierde confianza en el pipeline y lo terminan salteando.

El rol correcto de la IA en CI/CD es **asistente**, no juez:

| Rol | Qué hace | ¿Bloquea? |
|-----|----------|-----------|
| **Comentarista** | Analiza el PR y deja comentarios | No |
| **Generador** | Crea release notes, changelogs, resúmenes | No |
| **Detector** | Marca posibles problemas (secrets, breaking changes) | No |
| **Sugeridor** | Propone mejoras, tests faltantes, refactors | No |
| **Gatekeeper** | Bloquea si detecta X | ❌ No |

### El diff como input de IA

El input más valioso para la IA en CI/CD es el **diff** — no el código completo, sino lo que cambió. Un diff bien estructurado le dice a la IA:

- Qué archivos cambiaron
- Qué líneas se agregaron, modificaron, o eliminaron
- Qué funciones/componentes se tocaron
- Qué dependencias cambiaron

Un prompt efectivo para release notes:

```
Generá release notes en markdown para un changelog a partir de este diff.

Formato:
- ## Features — nuevas funcionalidades
- ## Fixes — correcciones de bugs
- ## Chores — cambios de infraestructura, dependencias, tooling
- ## Breaking Changes — cambios que rompen compatibilidad

Agrupá los cambios por tipo. Si un commit no encaja claramente, ponelo en "Otros".

Diff:
{{diff}}
```

### Triggers de CI/CD

Los workflows de IA deberían ejecutarse en momentos específicos:

| Trigger | Qué hacer |
|---------|-----------|
| `push: tags` (v*) | Generar release notes |
| `pull_request` | Comentar con análisis del diff |
| `push: main` | Verificar que no se hardcodearon secrets |
| `schedule` (semanal) | Auditoría de dependencias |

Cada trigger tiene un output diferente y un nivel de urgencia distinto. Las release notes son informativas. El análisis de PR es útil pero no urgente. La detección de secrets en main debería ser más rápida.

### El workflow como pipeline de datos

Un workflow de CI/CD con IA es un pipeline de datos:

```
Evento (push/PR) → Input (diff/código) → Procesamiento (IA + reglas) → Output (comentario/archivo/notificación)
```

Cada paso debe ser:
- **Idempotente** — mismo input produce mismo output (o similar)
- **Rápido** — la IA no debería tomar más de 30 segundos
- **No bloqueante** — el pipeline principal sigue aunque la IA falle

---

## 🛠️ Práctica — Workflows de GitHub Actions

Vas a crear dos workflows de GitHub Actions que usen IA para generar release notes y comentar en PRs.

### Setup

```bash
mkdir -p projects/level-06-cicd/.github/workflows
cd projects/level-06-cicd
npm init -y
```

### Paso 1: Release Notes Generator

Creá un workflow que se ejecute cuando se pushee un tag semver (v*.*.*).

Prompt:

> "Creá un workflow de GitHub Actions en .github/workflows/release-notes.yml que:
> - Se ejecute en push de tags con formato v*.*.* (ej: v1.2.3)
> - Obtenga el diff entre el tag actual y el tag anterior (o el primer commit si no hay tag previo)
> - Use un script de Node.js (scripts/generate-release-notes.js) que:
>   - Lea el diff desde git log
>   - Clasifique los commits en Features, Fixes, Chores, Breaking Changes
>   - Genere un archivo CHANGELOG.md en la raíz del proyecto
> - El script debe usar reglas locales para clasificar commits (no IA externa):
>   - feat: → Features
>   - fix: → Fixes
>   - chore:, ci:, refactor:, style: → Chores
>   - BREAKING CHANGE o !: después del tipo → Breaking Changes
> - El workflow debe:
>   - Hacer checkout del repo con fetch-depth: 0 (para tener todo el historial)
>   - Setup Node.js
>   - Ejecutar el script
>   - Commitear y pushear el CHANGELOG.md actualizado
>   - Crear una Release en GitHub con las notas generadas"

### Paso 2: PR Review Commenter

Creá un workflow que comente en PRs con un análisis del diff.

Prompt:

> "Creá un workflow de GitHub Actions en .github/workflows/pr-review.yml que:
> - Se ejecute en pull_request (opened, synchronize)
> - Obtenga el diff del PR
> - Use un script de Node.js (scripts/analyze-pr.js) que:
>   - Analice el diff con reglas locales
>   - Detecte: archivos nuevos sin tests, console.logs agregados, cambios en package.json sin lockfile, funciones muy grandes (> 50 líneas agregadas en una función), secrets hardcodeados
>   - Genere un comentario markdown con: resumen (archivos cambiados, líneas agregadas/eliminadas), hallazgos (tabla con archivo, línea, tipo, severidad), sugerencias
> - El workflow debe:
>   - Hacer checkout del repo
>   - Setup Node.js
>   - Ejecutar el script
>   - Publicar el resultado como comentario en el PR usando GitHub Script (actions/github-script)
> - Si el PR ya tiene un comentario del bot, actualizarlo en vez de crear uno nuevo"

### Paso 3: El script de release notes

Prompt:

> "Creá un script Node.js scripts/generate-release-notes.js que:
> - Acepte dos argumentos: --from (tag anterior o commit) y --to (tag actual, default HEAD)
> - Ejecute `git log --oneline --format='%s||%h||%an'` entre los dos tags
> - Clasifique cada commit según el conventional commits spec:
>   - feat: → Features
>   - fix: → Fixes
>   - chore:, ci:, refactor:, style:, test:, docs:, perf: → Chores
>   - BREAKING CHANGE o ! → Breaking Changes
>   - El resto → Otros
> - Agrupe los commits por categoría
> - Genere un archivo CHANGELOG.md con:
>   ```markdown
>   # Changelog
>
>   ## [{{version}}] - {{date}}
>
>   ### Features
>   - {{commit message}} ({{author}})
>
>   ### Fixes
>   ...
>   ```
> - Use solo módulos nativos de Node.js (child_process, fs)
> - Si no hay tag anterior, use el primer commit del repo como from"

### Paso 4: El script de análisis de PR

Prompt:

> "Creá un script Node.js scripts/analyze-pr.js que:
> - Acepte un argumento --diff (ruta a un archivo con el diff del PR)
> - Analice el diff línea por línea buscando:
>   - **Archivos nuevos sin test**: si se agrega un archivo .js/.ts y no hay un archivo .test.js/.spec.js correspondiente
>   - **console.logs agregados**: líneas que empiezan con + y contienen console.log
>   - **Cambios en package.json sin lockfile**: si cambia package.json pero no package-lock.json
>   - **Funciones grandes**: bloques de + líneas entre function/const y } que sumen más de 50 líneas
>   - **Secrets hardcodeados**: patrones de password, token, apiKey en líneas +
> - Devuelva un objeto con:
>   - summary: { filesChanged, linesAdded, linesRemoved }
>   - findings: [{ file, line, type, severity, description }]
>   - suggestions: [string]
> - Use solo módulos nativos"

### Paso 5: Probá los scripts localmente

Antes de subir los workflows a GitHub, probá los scripts con un diff simulado:

```bash
# Simulá un diff
cat > /tmp/sample-diff.txt << 'EOF'
diff --git a/src/index.js b/src/index.js
+const API_KEY = "***";
+console.log("debug");
+function processData() {
+  // 50+ líneas de lógica
+  ...
+}
EOF

node scripts/analyze-pr.js --diff /tmp/sample-diff.txt
```

Y probá release notes contra el historial de este mismo proyecto:

```bash
node scripts/generate-release-notes.js --from $(git rev-list --max-parents=0 HEAD)
```

### Criterios de completitud

- [ ] El script de release notes clasifica commits por conventional commits
- [ ] El script de análisis de PR detecta al menos 3 tipos de hallazgos
- [ ] Probaste ambos scripts localmente con datos reales
- [ ] Los workflows de GitHub Actions están escritos y son sintácticamente válidos
- [ ] Entendés por qué la IA no debería ser gatekeeper en CI/CD
- [ ] Podés explicar la diferencia entre comentarista y bloqueador

---

## 📣 LinkedIn — Post para publicar

---

**Poner IA en CI/CD sin romper la confianza del equipo 🤖**

Nivel 6 del AI Engineering Bootcamp: CI/CD con IA.

Construí dos workflows de GitHub Actions:
- Release notes automáticas basadas en conventional commits
- Code review en PRs con análisis del diff

La regla de oro: **la IA comenta, no bloquea**. Si la IA se equivoca, el equipo la ignora y el deploy sigue. Si la IA acierta, el equipo la lee y mejora el código.

El día que la IA bloquee un deploy por un falso positivo, el equipo pierde confianza en el pipeline. Y sin confianza, el pipeline no sirve.

Próximo nivel: Microservicios con IA — 3 servicios con event bus.

#AIEngineering #DevOps #GitHubActions #CI_CD #ReleaseNotes

---

## Self-review

Antes de pasar al Nivel 7, respondé:

- [ ] ¿Entendés por qué la IA no debería ser gatekeeper en CI/CD?
- [ ] ¿Construiste el script de release notes con clasificación por conventional commits?
- [ ] ¿Construiste el script de análisis de PR con detección de hallazgos?
- [ ] ¿Probaste ambos scripts localmente?
- [ ] ¿Los workflows de GitHub Actions están listos para usar?

→ Si respondiste "sí" a todo, avanzá al **Nivel 7**.
