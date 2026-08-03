# Proyecto 4.1 — Prompt library (repo Git)

> 📋 **Instrucciones del ejercicio**
> Este archivo describe el brief y los criterios de completitud del proyecto.
> La documentación del proyecto resultante (qué se construyó, cómo ejecutarlo) está en [`README.md`](./README.md).

> **Nivel:** 4 — Plantillas y automatización 🟡
> **Dificultad:** Intermedio
> **Documentación:** [level-04-prompt-library.md](../../../docs/level-04-prompt-library.md)

## Descripción

Colección organizada de prompts categorizados y reutilizables.

## Estructura

```
prompts/
├── backend/
│   ├── create-api-endpoint.md
│   ├── create-middleware.md
│   ├── database-schema-design.md
│   └── error-handling-pattern.md
├── frontend/
│   ├── create-react-component.md
│   ├── responsive-layout.md
│   └── form-validation.md
├── testing/
│   ├── unit-test-template.md
│   ├── integration-test-template.md
│   └── e2e-test-template.md
├── refactoring/
│   ├── extract-function.md
│   ├── apply-design-pattern.md
│   └── simplify-logic.md
├── security/
│   ├── security-audit.md
│   ├── input-validation-review.md
│   └── dependency-check.md
└── README.md
```

## Formato de cada prompt

```markdown
# [Nombre del prompt]

## Categoría
[backend/frontend/testing/refactoring/security]

## Cuándo usarlo
[Descripción del escenario]

## Prompt
[El prompt con placeholders {{LIKE_THIS}}]

## Ejemplo de uso
[Input de ejemplo → Output esperado]

## Notas
[Consideraciones, limitaciones]
```

## Criterios de completitud

- [ ] Al menos 15 prompts categorizados
- [ ] Formato estandarizado
- [ ] Cada prompt tiene ejemplo de uso
- [ ] README con índice
