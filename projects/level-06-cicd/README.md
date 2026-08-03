# Nivel 6 — CI/CD con IA

## Proyecto: Workflows de GitHub Actions + gate verificado

Workflows de CI/CD que usan IA (simulada con reglas locales) para generar release notes automáticas, comentar en PRs con análisis del diff, y **probar que el gate de verdad bloquea**.

### Proyectos

1. **PR review** (`core`) — `.github/workflows/pr-review.yml` + `scripts/analyze-pr.js`
   Analiza el diff de cada PR (secrets, console.logs, funciones grandes, tests faltantes, lockfile) y postea un comentario. Incluye un **gate** (`--gate`) que falla el check si hay hallazgos de severidad high.

2. **Release notes** (`core`) — `.github/workflows/release-notes.yml` + `scripts/generate-release-notes.js`
   Genera release notes desde el historial de commits al publicar un tag, agrupados por tipo (feat/fix/chore/breaking) y resumidos.

3. **Prove the gate** (`core`, profundidad) — `scripts/test-gate.js` + `fixtures/`
   Demuestra que el gate bloquea lo malo y deja pasar lo bueno. Corre el gate contra `fixtures/bad.diff` (debe bloquear) y `fixtures/good.diff` (debe pasar). El workflow lo ejecuta en cada PR vía el job `prove-gate` — el pipeline se prueba a sí mismo.

4. **Audit your pipeline** (`stretch`) — `project-6-pipeline-audit.md`
   Revisar tu propio pipeline con ojo crítico: falsos positivos, falsos negativos, y orden de los gates.

### Archivos

- `.github/workflows/pr-review.yml` — análisis de PRs + gate + job prove-gate
- `.github/workflows/release-notes.yml` — release notes en tags v*
- `scripts/analyze-pr.js` — analizador de diff (determinístico) con modo `--gate`
- `scripts/generate-release-notes.js` — clasificador de commits por conventional commits
- `scripts/test-gate.js` — test del gate: corre bad.diff (debe bloquear) y good.diff (debe pasar)
- `fixtures/bad.diff` — PR que DEBE ser bloqueado (secret hardcodeado)
- `fixtures/good.diff` — PR legítimo que DEBE pasar
- `package.json` — scripts (`release-notes`, `analyze-pr`, `test-gate`)

### Cómo empezar

1. Leé la guía en `docs/level-06-cicd.md`
2. Construí los scripts primero (probálos localmente)
3. Probalo localmente:
   ```bash
   node scripts/analyze-pr.js --diff fixtures/bad.diff --gate   # exit 1, bloquea
   node scripts/analyze-pr.js --diff fixtures/good.diff --gate  # exit 0, pasa
   node scripts/test-gate.js                                    # verifica ambos
   ```
4. Creá los workflows de GitHub Actions
5. Probá los workflows en un repo de prueba
6. Revisá los comentarios generados en PRs reales

### La idea central

**Un gate que no podés testear no es un gate.** El Proyecto 3 es lo que hace que este pipeline sea confiable: `test-gate.js` prueba que el gate bloquea lo malo y deja pasar lo bueno, y el workflow lo corre en cada PR. Si el gate fallara en bloquear un secret, el test lo detectaría.
