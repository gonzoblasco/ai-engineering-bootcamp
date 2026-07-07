# Proyecto 6.1 — GitHub Actions workflow con IA

> 📋 **Instrucciones del ejercicio**
> Este archivo describe el brief y los criterios de completitud del proyecto.
> La documentación del proyecto resultante (qué se construyó, cómo ejecutarlo) está en [`README.md`](./README.md).

> **Nivel:** 6 — CI/CD con IA 🟠
> **Dificultad:** Avanzado
> **Documentación:** [level-06-cicd.md](../../../docs/level-06-cicd.md)

## Descripción

Pipeline que genera tests con IA, corre linter, ejecuta tests y reporta.

## Workflow a crear

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

## Pasos

1. Crea el workflow con Copilot: *"Genera un GitHub Actions workflow que corra ESLint, genere tests faltantes, ejecute tests y haga code review con IA"*
2. Implementa cada job
3. Prueba el pipeline con un PR real
4. Itera y mejora

## Criterios de completitud

- [x] Workflow funcional en GitHub Actions
- [x] Job de linting funciona
- [x] Job de test generation con IA
- [x] Job de code review con IA
- [x] Reporte consolidado
