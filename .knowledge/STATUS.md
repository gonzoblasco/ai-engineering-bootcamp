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
- **⚠️ Detached HEAD recurrente en el repo del proyecto** (2026-08-03): al llegar, `main` estaba en `ee2cc7d` pero los commits nuevos se creaban desacoplados (HEAD en el aire). Se corrigió con `git branch -f main <sha> && git checkout main` (fast-forward lineal, sin pérdida). **Lección:** tras cada sesión, verificar `git status` para confirmar que se está en la branch y no en detached HEAD antes de commitear. El patrón se repetía porque los commits se hacían sin checkout previo de la branch.

## Expansión en curso — Nivel 1 (2026-08-03)

Convertir el bootcamp en una estructura de educación en línea completa, nivel por nivel. Empezando por el Nivel 1.

**Nivel 1 expandido ✅** — de 2 a 4 proyectos:
- Proyectos 1-2 (core, existentes): landing page + password generator.
- **Proyecto 3 (nuevo, core)** — *Iteración deliberada*: reconstruir el generator con 3 estrategias de prompt (vague/specific/constrained) y comparar. Enseña el "porqué" (especificidad = habilidad, no regalo).
- **Proyecto 4 (nuevo, stretch)** — *Modo auditor*: encontrar el bug en código generado roto antes de correrlo. Enseña "don't trust, verify".

**Mecanismo de verificación ✅** — `projects/level-01-hello-world/verify.js`: script que confirma esfuerzo (estructura + evidencia), no calidad. Es el **template para niveles futuros**: misma estructura de checks por proyecto + rúbrica de auto-evaluación.

**Filosofía:** agregar profundidad (el porqué) antes que cantidad (más proyectos iguales). El N1 no necesitaba más ejercicios del mismo tipo — necesitaba ejercicios que enseñen a *dirigir* y *auditar* la IA.

## Próximos pasos (si se retoma)

- Aplicar el template de verificación (verify.js) a los niveles 2-10.
- Expandir el siguiente nivel (N2 — Prompts) con la misma profundidad.
- Posible conversión a contenido para posicionamiento (LinkedIn/tutorials).
