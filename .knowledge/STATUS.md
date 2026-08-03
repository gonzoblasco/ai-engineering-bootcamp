# STATUS — AI Engineering Bootcamp

**Estado:** ✅ COMPLETADO (10/10 niveles)
**Última actualización:** 2026-08-03
**Versión canónica:** commit `ee2cc7d` — consolidada en GitHub (gonzoblasco/ai-engineering-bootcamp)

---

## Progreso

| Nivel | Tema | Estado |
|-------|------|--------|
| 1 | Hello World (landing page) | ✅ |
| 2 | Prompts que funcionan (API REST) | ✅ |
| 3 | Workflows con IA (CLI + code review) | ✅ |
| 4 | Prompt Library (templates) | ✅ |
| 5 | Seguridad y auditoría (security CLI) | ✅ |
| 6 | CI/CD con IA (GitHub Actions) | ✅ |
| 7 | Microservicios (3 servicios + event bus) | ✅ |
| 8 | Producción y cloud (Docker + CloudFormation) | ✅ |
| 9 | Multiplicador de equipo (standards + dashboard) | ✅ |
| 10 | Sistema completo (auth + gateway + CI/CD) | ✅ |

**Curso completo: 10/10 niveles.**

## Arquitectura del proyecto

- **Niveles 1-7:** lineales, cada uno con carpeta propia (`projects/level-NN-*/`).
- **Niveles 8-10 (convergentes, ADR-001):** extienden el sistema del N7 en `projects/level-07-microservices/` — cloud (N8), estándares/dashboard (N9), sistema completo con auth + gateway + CI/CD (N10).

## Entregables

- **Docs:** 10 guías de nivel (teoría + práctica + LinkedIn + self-review) en `docs/`.
- **Proyectos resueltos:** 7 proyectos (los N7-10 comparten folder convergente).
- **Skill extraída:** `pipeline-detector` (patrón "detectores locales + validación cruzada" que apareció 5 veces en el curso).

## Decisiones clave

- **ADR-001:** niveles 8-10 convergentes (no crean carpeta nueva, transforman el N7). Lección general: "patrón por inercia vs contexto cambiado".
- **Canónica = versión local (2026-08-03).** La versión legada del repo (docs es/en duplicados, proyectos TASK.md) quedó en tag `backup-original-remote`.

## Issues conocidos

- Los posts de LinkedIn de los niveles quedaron sin publicar (decisión: eran el ejercicio de reflexión, no el fin).
- Sin mecanismo de verificación automática al final de cada nivel (tests contra el proyecto del alumno) — mejora futura.

## Próximos pasos (si se retoma)

- Considerar agregar verificación automática por nivel.
- Posible conversión a contenido para posicionamiento (LinkedIn/tutorials).
