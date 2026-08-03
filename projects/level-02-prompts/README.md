# Nivel 2 — Prompts que funcionan

Master prompt engineering para generación de código. Cuatro proyectos (3 core + 1 stretch) que van de "la API funciona" a "el prompt y el test deciden".

## Proyectos

| # | Proyecto | Tipo | Enseña |
|---|----------|------|--------|
| 1 | REST API (todo list) | 🟢 core | CRUD + validación + tests con prompts |
| 2 | Refactor legacy code | 🟢 core | Analizar y limpiar código con IA |
| 3 | Prompt A/B showdown | 🟡 core | Medir el costo real de un prompt vago |
| 4 | Break it on purpose | 🟠 stretch | Tests como árbitro entre vos y la IA |

## Estructura del folder

```
level-02-prompts/
├── verify.js              # auto-check de esfuerzo (template del N1)
├── tasks-api/             # Proyectos 1, 3 y 4
│   ├── index.js
│   ├── routes/tasks.js
│   └── services/tasksService.js
├── 02-refactor-legacy/    # Proyecto 2 (legacy messy app)
├── project-3-ab-notes.md  # Proyecto 3 — tu comparación A/B (crealo vos)
└── project-4-bughunt-notes.md  # Proyecto 4 — stretch (opcional)
```

> Nota: el doc del nivel referencia `02-refactor-legacy/` para el proyecto 2. Si no existe todavía, crealo vos con una app Express desordenada (o pedile a la IA que genere una).

## Cómo empezar

1. Leé la guía completa en `docs/level-02-prompts.md`
2. Proyecto 1: generá la API REST y agregale tests
3. Proyecto 2: refactoreá el código legacy
4. Proyecto 3: construí el mismo endpoint con prompt vago vs estructurado y anotá la diferencia
5. (Stretch) Proyecto 4: pedile a la IA código con bug sutil y probalo con tests
6. Corré `node verify.js` para confirmar el esfuerzo
7. Pasá el self-review y avanzá al Nivel 3

## Verificación

```bash
node verify.js
```

Confirma estructura + evidencia (esfuerzo), no calidad. La calidad la juzgás vos contra el self-review de la guía.
