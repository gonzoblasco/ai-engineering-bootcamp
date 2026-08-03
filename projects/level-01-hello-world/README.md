# Nivel 1 — Hello World

Primer contacto con la IA como copiloto. Tres proyectos (2 core + 1 stretch) que te llevan de "aceptar autocomplete" a "dirigir y auditar la IA".

## Proyectos

| # | Proyecto | Tipo | Enseña |
|---|----------|------|--------|
| 1 | Landing page personal | 🟢 core | Primer contacto con Copilot Chat |
| 2 | Password generator | 🟢 core | Iterar y refinar un mini-app |
| 3 | Iteración deliberada | 🟡 core | Cómo los prompts cambian el resultado |
| 4 | Modo auditor | 🟠 stretch | Detectar y corregir código roto |

## Estructura del folder

```
level-01-hello-world/
├── verify.js            # auto-check de esfuerzo (template para niveles futuros)
├── landing-page/        # Proyecto 1
│   ├── index.html
│   ├── styles.css
│   └── script.js
├── password-generator/  # Proyecto 2 (crealo vos)
├── project-3-notes.md   # Proyecto 3 — tu comparación de prompts (crealo vos)
└── project-4-notes.md   # Proyecto 4 — stretch, tu análisis de bugs (opcional)
```

## Cómo empezar

1. Leé la guía completa en `docs/level-01-hello-world.md`
2. Hacé los proyectos 1 y 2 como en la guía
3. Proyecto 3: reconstruí el generator con 3 estrategias de prompt distintas y anotá la diferencia
4. (Stretch) Proyecto 4: encontrá el bug antes de correrlo
5. Corré `node verify.js` para confirmar que completaste el esfuerzo
6. Pasá el self-review y avanzá al Nivel 2

## Verificación

```bash
node verify.js
```

Confirma que los archivos y la evidencia existen (esfuerzo), no la calidad. La calidad la juzgás vos contra el self-review de la guía.
