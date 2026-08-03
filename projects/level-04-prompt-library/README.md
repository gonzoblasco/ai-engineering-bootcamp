# Nivel 4 — Prompt Library

Construir y mantener una librería de prompts reutilizables. Cinco proyectos (3 core + 2 new) que van de "la librería existe" a "el template se audita y se versiona".

## Proyectos

| # | Proyecto | Tipo | Enseña |
|---|----------|------|--------|
| 1 | Prompt template system | 🟢 core | Sistema con variables + CLI |
| 2 | Code review prompt | 🟢 core | Template con dimensiones y severidades |
| 3 | Refactoring prompt | 🟢 core | Template con restricciones de comportamiento |
| 4 | Template quality audit | 🟡 core | Evaluar si un template es bueno o solo plausible |
| 5 | Template versioning | 🟠 stretch | Gestionar el cambio de templates |

## Estructura del folder

```
level-04-prompt-library/
├── verify.js              # auto-check de esfuerzo (template del N1)
├── prompt-library/        # Proyecto 1 (ya resuelto)
│   ├── render.js          # motor con includes + validación de variables
│   ├── prompt-library.js  # CLI (list, show, render)
│   └── prompts/           # templates .prompt.md (workflows/, roles/, rules/)
├── project-4-quality-audit.md  # Proyecto 4 — tu audit con rúbrica (crealo vos)
└── project-5-versioning.md     # Proyecto 5 — stretch (opcional)
```

## Cómo empezar

1. Leé la guía completa en `docs/level-04-prompt-library.md`
2. Proyecto 1: usá/mejorá el sistema de templates existente
3. Proyecto 2: completá el code review template con dimensiones + severidades + {{rules}}
4. Proyecto 3: creá el refactoring template con restricciones de comportamiento
5. Proyecto 4: auditá dos templates con la rúbrica (specificity, stability, testability, reusability)
6. (Stretch) Proyecto 5: simulá un cambio de template y documentá el impacto
7. Corré `node verify.js` para confirmar el esfuerzo
8. Pasá el self-review y avanzá al Nivel 5

## Verificación

```bash
node verify.js
```

Confirma estructura + evidencia (esfuerzo), no calidad. La calidad la juzgás vos contra el self-review de la guía.
