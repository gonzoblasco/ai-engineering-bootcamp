# ADR-001 — Los niveles finales del bootcamp son convergentes, no lineales

## Status
Aceptado

## Contexto
Los niveles 1-7 del bootcamp siguen un patrón lineal: cada nivel crea una carpeta de proyecto nueva (`projects/level-NN-*`). Este patrón se repitió 7 veces.

En el nivel 8, la tendencia fue aplicar el mismo patrón (crear `projects/level-08-cloud/`) cuando el nivel 8 NO construye algo nuevo — **transforma el sistema del nivel 7** (lo Dockeriza y lo cloudiza).

## Decisión
Los niveles 8-10 son convergentes: no crean carpetas nuevas, extienden sistemas de niveles anteriores. La práctica del nivel 8 vive dentro de `projects/level-07-microservices/`.

## Lección general (la que vale, no el caso específico)
**Cuando un patrón se repite muchas veces, el riesgo no es equivocarse en el patrón — es aplicarlo por inercia cuando el contexto ya cambió.**

La señal de alerta no es "¿lo sé hacer?" sino "¿es este caso realmente igual a los que ya resolví?".

## Migracion

Migrado a ADR global: [`docs/adr/ADR-001-patron-convergente.md`](../../../docs/adr/ADR-001-patron-convergente.md)

---

## Consecuencias
- N9 (multiplicador de equipo) y N10 (sistema completo) **confirmaron la predicción**: ambos extendieron el N7 (standards + dashboard, y luego auth + gateway + CI/CD). El patrón convergente se validó.
- Antes de crear cualquier carpeta/estructura nueva, preguntar si el nivel construye algo nuevo o transforma lo existente.
- El sistema final vive íntegro en `projects/level-07-microservices/` — es el "contrato" del capstone.
