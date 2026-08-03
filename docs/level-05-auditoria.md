# Nivel 5 — Auditoría de código IA 🟠

> **Objetivo:** Auditar y validar código generado por IA. Crítico para el puesto.
>
> **Dificultad:** Intermedio-Avanzado | **Proyectos:** 2 | **Tiempo estimado:** 4-5 horas

## Skills que ganarás

- [ ] Code audit sistemático
- [ ] Security review de código IA
- [ ] Detección de edge cases
- [ ] AI-as-reviewer patterns
- [ ] Crear checklists de validación

---

## Proyecto 1: Audit checklist + script

**Descripción:** Crea un checklist de revisión de código IA y un script que automatice parte de la validación.

### Checklist a crear

```
docs/checklists/
├── ai-code-audit-checklist.md
├── security-checklist.md
└── performance-checklist.md
```

### Categorías del checklist

1. **Seguridad:** SQL injection, XSS, CSRF, secrets en código, input validation
2. **Performance:** N+1 queries, memory leaks, blocking calls, missing indexes
3. **Edge cases:** null/undefined, empty arrays, concurrent access, rate limiting
4. **Calidad:** Naming, DRY, SOLID, error handling, logging
5. **Tests:** Cobertura, edge cases testeados, mocks apropiados

### Script de validación

Crea un script Node.js que:
- Analice un archivo/directorio
- Detecte patrones comunes de problemas (regex-based)
- Genere un reporte

### Criterios de completitud

- [ ] 3 checklists creados y documentados
- [ ] Script de validación funcional
- [ ] Script genera reporte legible
- [ ] Probado sobre código del Nivel 3

---

## Proyecto 2: Code review con IA como reviewer

**Descripción:** Usa Copilot para que revise su propio código y compara con revisión manual.

### Pasos

1. Toma el sistema de auth del Nivel 3
2. Pídele a Copilot: *"Revisa este código como un senior engineer. Busca bugs, security issues, performance problems y mejoras de arquitectura"*
3. Documenta los hallazgos de Copilot
4. Haz una revisión manual del mismo código
5. Compara: ¿Qué encontró Copilot? ¿Qué encontraste tú? ¿Qué se perdió?
6. Documenta las diferencias en `docs/ai-vs-human-review.md`

### Criterios de completitud

- [ ] Review con IA documentado
- [ ] Review manual documentado
- [ ] Comparación crítica escrita
- [ ] Conclusiones sobre cuándo confiar en IA vs revisión humana

---

## Self-review

- ¿Tu checklist cubre seguridad, performance, edge cases y calidad?
- ¿El script de validación detecta problemas reales?
- ¿Entiendes las limitaciones de la IA como reviewer?

→ Si respondiste "sí" a todo, avanza al **Nivel 6**.