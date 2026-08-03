# Nivel 3 — Workflows con IA

Diseñar workflows estructurados con gates y checkpoints. Cuatro proyectos (3 core + 1 stretch) que van de "la CLI funciona" a "el gate se prueba y se audita".

## Proyectos

| # | Proyecto | Tipo | Enseña |
|---|----------|------|--------|
| 1 | Workflow automation script | 🟢 core | CLI con pre-flight + gates + report |
| 2 | AI code review system | 🟢 core | Review estructurado con dimensiones |
| 3 | Prove the gate | 🟡 core | Testear que cada gate bloquea cuando debe |
| 4 | Audit your own workflow | 🟠 stretch | Auditar el diseño del workflow |

## Estructura del folder

```
level-03-workflows/
├── verify.js              # auto-check de esfuerzo (template del N1)
├── review-cli/            # Proyecto 2 (ya resuelto)
│   ├── index.js
│   └── package.json
├── workflow/              # Proyecto 1 (crealo vos: CLI con preflight + gates)
├── gates.test.js          # Proyecto 3 — tests de tus gates (crealo vos)
└── project-4-audit-notes.md  # Proyecto 4 — stretch (opcional)
```

## Cómo empezar

1. Leé la guía completa en `docs/level-03-workflows.md`
2. Proyecto 1: construí el workflow automation CLI con pre-flight y gates
3. Proyecto 2: usá/mejorá el review-cli existente con dimensiones de review
4. Proyecto 3: escribí tests que prueben que cada gate bloquea y permite
5. (Stretch) Proyecto 4: auditá tu propio workflow con la rúbrica de gates
6. Corré `node verify.js` para confirmar el esfuerzo
7. Pasá el self-review y avanzá al Nivel 4

## Verificación

```bash
node verify.js
```

Confirma estructura + evidencia (esfuerzo), no calidad. La calidad la juzgás vos contra el self-review de la guía.
