# Nivel 6 — CI/CD con IA 🟠

> **Objetivo:** Integrar outputs de IA en pipelines de CI/CD, testing y linting.
>
> **Dificultad:** Avanzado | **Proyectos:** 2 | **Tiempo estimado:** 4-6 horas

## Skills que ganarás

- [ ] GitHub Actions workflows
- [ ] Pre-commit hooks con IA
- [ ] Automatización de testing con IA
- [ ] Integrar IA en pipelines existentes

---

## Proyecto 1: GitHub Actions workflow con IA

**Descripción:** Pipeline que genera tests con IA, corre linter, ejecuta tests y reporta.

### Workflow a crear

```yaml
# .github/workflows/ai-pipeline.yml
name: AI-Driven CI Pipeline

on: [push, pull_request]

jobs:
  lint:
    # ESLint + Prettier
  ai-test-generation:
    # Generar tests faltantes con IA
  test:
    # Ejecutar todos los tests
  ai-code-review:
    # Copilot revisa el PR
  report:
    # Consolidar resultados
```

### Pasos

1. Crea el workflow con Copilot: *"Genera un GitHub Actions workflow que corra ESLint, genere tests faltantes, ejecute tests y haga code review con IA"*
2. Implementa cada job
3. Prueba el pipeline con un PR real
4. Itera y mejora

### Criterios de completitud

- [ ] Workflow funcional en GitHub Actions
- [ ] Job de linting funciona
- [ ] Job de test generation con IA
- [ ] Job de code review con IA
- [ ] Reporte consolidado

---

## Proyecto 2: Pre-commit hooks con IA

**Descripción:** Hook que valide código antes de cada commit usando IA.

### Pasos

1. Configura `husky` + `lint-staged`
2. Crea un script que use Copilot CLI o un endpoint de IA para validar archivos staged
3. El hook debe: revisar seguridad, detectar bugs obvios, verificar convenciones
4. Si hay problemas críticos, bloquea el commit

### Criterios de completitud

- [ ] Pre-commit hook instalado y funcionando
- [ ] Valida código con IA antes de commit
- [ ] Bloquea commits con problemas críticos
- [ ] Documentación de cómo funciona

---

## Self-review

- ¿Tu pipeline de CI/CD integra IA de forma útil (no como gimmick)?
- ¿El pre-commit hook añade valor sin ser demasiado lento?
- ¿Entiendes cómo automatizar IA en pipelines?

→ Si respondiste "sí" a todo, avanza al **Nivel 7**.