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

## Expansión en curso — Niveles 1-5 (2026-08-03)

Convertir el bootcamp en una estructura de educación en línea completa, nivel por nivel.

**Nivel 1 expandido ✅** — de 2 a 4 proyectos (ver arriba): landing + password gen (core) + *Iteración deliberada* (core, 3 estrategias de prompt) + *Modo auditor* (stretch, encontrar bug). verify.js creado como template.

**Nivel 2 expandido ✅** — de 2 a 4 proyectos:
- Proyectos 1-2 (core, existentes): REST API todo list + refactor legacy code.
- **Proyecto 3 (nuevo, core)** — *Prompt A/B showdown*: construir el mismo endpoint con prompt vago vs estructurado y medir el delta. Enseña que en codebases existentes el contexto lo es todo (el AI no matchea patrones que nunca vio).
- **Proyecto 4 (nuevo, stretch)** — *Break it on purpose*: pedirle a la IA código con bug sutil, escribir hipótesis antes de correr, probar con tests que fallan, y verificar el fix. Extiende "don't trust, verify" del N1 de sintaxis a lógica — tests como árbitro.

**Mecanismo de verificación ✅** — verify.js del N2 creado (mismo template del N1, adaptado: API + tests + notas A/B + bug-hunt). El patrón escala.

**Filosofía:** misma del N1 — profundidad antes que cantidad. El N2 no necesitaba más endpoints; necesitaba ejercicios que enseñen a *medir el prompt* y *verificar con tests*.

**Nivel 3 expandido ✅** — de 2 a 4 proyectos:
- Proyectos 1-2 (core, existentes): workflow automation CLI + AI code review system (review-cli ya resuelto).
- **Proyecto 3 (nuevo, core)** — *Prove the gate*: diseñar un workflow, listar los gates con posición, y escribir tests con caso de bloqueo Y caso de paso para cada gate. Deliberadamente romper el input y ver el gate parar. Enseña que "un gate que no se puede testear no es un gate, es una esperanza" — el diseño se prueba por sus fallas, no por el happy path.
- **Proyecto 4 (nuevo, stretch)** — *Audit your own workflow*: auditar el diseño con rúbrica (orden, poder de bloqueo, necesidad) comparando con el review de la IA. Extiende "don't trust, verify" de código a diseño de proceso.

**Mecanismo de verificación ✅** — verify.js del N3 creado (mismo template, adaptado: review CLI + workflow automation + tests de gates + audit). El patrón escala por tercer nivel.

**Filosofía:** misma — profundidad antes que cantidad. El N3 necesitaba ejercicios que enseñen a *probar los gates* y *auditar el diseño*, no más CLIs.

**Nivel 4 expandido ✅** — de 3 a 5 proyectos:
- Proyectos 1-3 (core, existentes): template system + code review prompt + refactoring prompt. El sistema `prompt-library/` ya existe resuelto (render.js con includes y validación de variables).
- **Proyecto 4 (nuevo, core)** — *Template quality audit*: auditar dos templates con rúbrica de 4 ejes (specificity, stability, testability, reusability) puntuando 0-2, y correrlos de verdad contra código real. Enseña que "un template que se lee bien pero rinde mal es peor que no tener template — da falsa confianza".
- **Proyecto 5 (nuevo, stretch)** — *Template versioning*: congelar baseline (v1), cambiar el template, observar el impacto en renders viejos, escribir changelog. Enseña que "un template compartido es una API — cambiarlo sin avisar es un breaking change silencioso".

**Mecanismo de verificación ✅** — verify.js del N4 creado (mismo template, adaptado: librería + templates review/refactor + quality audit + versioning). El patrón escala por cuarto nivel.

**Filosofía:** misma — profundidad antes que cantidad. El N4 necesitaba ejercicios que enseñen a *evaluar* y *versionar* templates, no más templates.

**Nivel 5 expandido ✅** — de 5 pasos a 5 pasos + 2 ejercicios:
- Pasos 1-5 (core, existentes): Security Audit CLI (detectores secrets/injection/CVEs + ai-analyzer + CLI). Nivel ya tenía teoría fuerte del "primer filtro" (qué detecta la IA bien vs mal). Proyecto `security-cli/` ya resuelto.
- **Ejercicio 6 (nuevo, core)** — *Exploit Lab*: escribir un exploit real contra tu propio código vulnerable, con predicción antes de correr, y confirmar que tu auditoría detecta lo mismo que el exploit. Enseña que "un detector que no coincide con un exploit real no está funcionando — el exploit es la prueba de fuego de tu auditoría". Lleva "don't trust, verify" al extremo: probás que la vulnerabilidad existe porque la explotás.
- **Ejercicio 7 (nuevo, stretch)** — *Falso Positivo Hunt*: crear código inocente que engañe, cazar los falsos positivos, y ajustar el ai-analyzer para reducirlos sin romper la detección real. Enseña el problema #1 de la seguridad asistida por IA: la confianza falsa.

**Mecanismo de verificación ✅** — verify.js del N5 creado (mismo template, adaptado: security-cli + detectores + exploit lab + falsos positivos). El patrón escala por quinto nivel.

**Filosofía:** misma — profundidad antes que cantidad. El N5 ya tenía el "porqué" en la teoría; le faltaba el lado *ofensivo* (explotar) y el *problemático* (falsos positivos).

## Batch de materialización — Proyectos de ejemplo completos (2026-08-03)

Se materializaron los artefactos estructurales que las guías expandidas referencian, para que las carpetas de proyecto reflejen los docs y corran de punta a punta (el "contrato" del curso):

- **N1** — `password-generator/` (HTML+CSS+JS) agregado.
- **N2** — `tasks-api/tasks.test.js` (8 tests, zero-deps, `node --test`) + `index.js` exporta `app` (testable) + `02-refactor-legacy/app.js` (app desordenada para refactorizar).
- **N3** — `workflow/` CLI (pre-flight + gates + report) con lógica extraída a `workflow/gates.js` testeable + `gates.test.js` (12 tests).
- **N4** — `review-code.prompt.md` actualizado (severidades BLOCKING/WARNING/SUGGESTION + variable `{{rules}}`) + `refactor-code.prompt.md` nuevo (4 patrones + restricción de comportamiento).
- **N5** — `vulnerable-app.js` (app deliberadamente vulnerable) + `exploit.js` (demuestra SQLi + secret leak) + `package.json` (express).

**Verificación:** los verify.js de N1-N5 confirman el esfuerzo. **N3 (11/11) y N5 (9/9) pasan completos.** Los checks que quedan "missing" en N1/N2/N4 son **solo las notas de reflexión del alumno** (project-N-notes.md) — intencional, el repo de ejemplo no resuelve el trabajo de escritura del estudiante.

**Bugs de verify.js corregidos en el proceso:**
- Rutas absolutas de `walk`/`findFiles` leídas con `readIf` (relativo) → leían vacío. Se lee con `readFileSync` directo.
- Regex de extensión con doble backslash (`\\.`) en N3 → no matcheaba archivos.
- N2: `testFiles` eran solo nombres de archivo sin carpeta → `readIf` no encontraba los tests.
- N4: `find('review')` atrapaba `roles/code-reviewer` en vez de `workflows/review-code`.
- Lección (para skills/futuros verify): **un regex de extensión en un literal va con un solo backslash, y los paths que devuelve walk/findFiles son absolutos — no pasar por readIf(relativo).**

## Nivel 6 expandido ✅ (2026-08-03) — CI/CD con IA

**Nivel 6 expandido** — de 2 a 4 proyectos:
- Proyectos 1-2 (core, existentes): AI-powered GitHub Action (PR review) + automated release notes. El `analyze-pr.js` y `generate-release-notes.js` ya existían.
- **Proyecto 3 (nuevo, core, el corazón)** — *Prove the CI gate*: crear `fixtures/bad.diff` (PR que DEBE ser bloqueado: secret hardcodeado) y `fixtures/good.diff` (PR legítimo que DEBE pasar), y `scripts/test-gate.js` que corre el gate contra ambos y falla si alguno no cumple. Conectado al workflow vía job `prove-gate` — el pipeline se prueba a sí mismo en cada PR.
- **Proyecto 4 (nuevo, stretch)** — *Audit your pipeline*: cazar falsos positivos/negativos del propio pipeline, revisar el orden de los gates, escribir `project-6-pipeline-audit.md`.

**Materialización:** agregado `--gate` a `analyze-pr.js` (bloquea con exit 1 si hay hallazgos high determinísticos — secrets), fixtures bad/good, `test-gate.js`, gate + job `prove-gate` en `pr-review.yml`, README actualizado. CHANGELOG.md era un placeholder trackeado → eliminado (es output del script, no fuente, igual que workflow-report/security-audit del batch anterior).

**Verificación:** verify.js del N6 creado (mismo template). **Pasa 13/13** (stretch no-bloqueante). El test del gate se probó de verdad: bad.diff → exit 1, good.diff → exit 0.

**Filosofía:** misma — profundidad antes que cantidad. El N6 no necesitaba más workflows; necesitaba *probar* que el gate bloquea lo malo y deja pasar lo bueno. Lleva el tema "un gate que no podés testear no es un gate" del N3 (local) al CI remoto.

## Próximos pasos (si se retoma)

- Expandir el siguiente nivel (N7 — arquitectura/microservicios) con la misma profundidad.
- Aplicar el template de verificación (verify.js) a los niveles 7-10.
- Posible conversión a contenido para posicionamiento (LinkedIn/tutorials).
