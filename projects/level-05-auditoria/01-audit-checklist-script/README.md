# Proyecto 5.1 — Audit checklist + script

> **Nivel:** 5 — Auditoría de código IA 🟠
> **Dificultad:** Intermedio-Avanzado
> **Documentación:** [level-05-auditoria.md](../../../docs/level-05-auditoria.md)

## Descripción

Crea un checklist de revisión de código IA y un script que automatice parte de la validación.

## Checklist a crear

```
docs/checklists/
├── ai-code-audit-checklist.md
├── security-checklist.md
└── performance-checklist.md
```

## Categorías del checklist

1. **Seguridad:** SQL injection, XSS, CSRF, secrets en código, input validation
2. **Performance:** N+1 queries, memory leaks, blocking calls, missing indexes
3. **Edge cases:** null/undefined, empty arrays, concurrent access, rate limiting
4. **Calidad:** Naming, DRY, SOLID, error handling, logging
5. **Tests:** Cobertura, edge cases testeados, mocks apropiados

## Script de validación

Crea un script Node.js que:
- Analice un archivo/directorio
- Detecte patrones comunes de problemas (regex-based)
- Genere un reporte

## Criterios de completitud

- [ ] 3 checklists creados y documentados
- [ ] Script de validación funcional
- [ ] Script genera reporte legible
- [ ] Probado sobre código del Nivel 3