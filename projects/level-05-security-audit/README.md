# Nivel 5 — Seguridad y auditoría con IA

Usar la IA como primer filtro de seguridad. Siete entregables (5 pasos core + 2 ejercicios) que van de "el auditor existe" a "el exploit demuestra y el falso positivo se caza".

## Proyectos

| # | Proyecto | Tipo | Enseña |
|---|----------|------|--------|
| 1-5 | Security Audit CLI (pasos 1-5) | 🟢 core | Detectores + IA + reporte |
| 6 | Exploit Lab | 🔴 core | Entender la vulnerabilidad atacándola |
| 7 | Falso Positivo Hunt | 🟠 stretch | Cazar la confianza falsa de la IA |

## Estructura del folder

```
level-05-security-audit/
├── verify.js              # auto-check de esfuerzo (template del N1)
├── security-cli/          # Pasos 1-5 (ya resuelto)
│   ├── detectors/         # secrets, injection, dependencies
│   ├── ai-analyzer.js     # severidad + falsos positivos
│   └── security-audit.js  # CLI principal
├── exploit.js             # Ejercicio 6 — tu exploit (crealo vos)
├── project-6-exploit-notes.md   # Ejercicio 6 — predicción + remediación
└── project-7-false-positives.md # Ejercicio 7 — stretch (opcional)
```

## Cómo empezar

1. Leé la guía completa en `docs/level-05-security-audit.md`
2. Construí los detectores uno por uno (pasos 1-3)
3. Conectalos con el analizador de IA (paso 4) y el CLI (paso 5)
4. Ejercicio 6: escribí un exploit contra tu propio código vulnerable y demostrá la vulnerabilidad
5. (Stretch) Ejercicio 7: creá código inocente que engañe y cazá los falsos positivos
6. Corré `node verify.js` para confirmar el esfuerzo
7. Pasá el self-review y avanzá al Nivel 6

## Verificación

```bash
node verify.js
```

Confirma estructura + evidencia (esfuerzo), no calidad. La calidad la juzgás vos contra el self-review de la guía.
