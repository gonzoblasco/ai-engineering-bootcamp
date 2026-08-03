# Nivel 6 — CI/CD con IA

## Proyecto: Workflows de GitHub Actions

Workflows de CI/CD que usan IA (simulada con reglas locales) para generar release notes automáticas y comentar en PRs con análisis del diff.

### Archivos

- `.github/workflows/release-notes.yml` — workflow para release notes en tags v*
- `.github/workflows/pr-review.yml` — workflow para análisis de PRs
- `scripts/generate-release-notes.js` — clasificador de commits por conventional commits
- `scripts/analyze-pr.js` — analizador de diff con detección de hallazgos
- `package.json` — dependencias

### Cómo empezar

1. Leé la guía en `docs/level-06-cicd.md`
2. Construí los scripts primero (probálos localmente)
3. Creá los workflows de GitHub Actions
4. Probá los workflows en un repo de prueba
5. Revisá los comentarios generados en PRs reales
