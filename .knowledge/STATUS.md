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

## Nivel 7 expandido ✅ (2026-08-03) — Microservicios

**Nivel 7 expandido** — de 2 a 4 proyectos (núcleo físico convergente N7-N10, ADR-001):
- Proyectos 1-2 (core, existentes): two-service system (users + notifications vía event bus) + event-driven (orders + retry + dashboard). El sistema ya estaba materializado de niveles previos.
- **Proyecto 3 (nuevo, core, el corazón)** — *Prove the event flow*: `event-contract.js` declara el contrato de eventos como código (payload required + productores/consumidores), y `event-flow.test.js` prueba: entrega a todos los suscriptores, aislamiento de fallos (_safeCall), cumplimiento del contrato, y flujo real user.created → notifications.
- **Proyecto 4 (nuevo, stretch)** — *Audit the boundaries*: cuestionar cada límite de servicio (¿cambian por razones distintas?), auditar el contrato, evaluar idempotencia, escribir `project-7-boundary-audit.md`.

**Materialización:** `event-contract.js` (6 eventos reales del sistema: user.created/registered/deleted, order.created/updated/cancelled), `event-flow.test.js` (5 tests), `verify.js`. README actualizado.

**Verificación:** verify.js del N7 creado (mismo template). **Pasa 15/15** (stretch no-bloqueante). Se probó de verdad: romper el `_safeCall` hace fallar el test de aislamiento (not ok) → el test detecta el defecto. Sistema completo N7-N10 corre end-to-end vía gateway (health agregado 4/4 ok, crear usuario ok).

**Filosofía:** misma — profundidad antes que cantidad. El N7 no necesitaba más servicios; necesitaba *probar* que los eventos fluyen, que un handler roto no tumba el bus, y que los payloads cumplen el contrato. Los eventos son una API asíncrona — un contrato que nadie chequea se rompe en runtime, silenciosamente.

## Nivel 8 expandido ✅ (2026-08-03) — Producción y cloud

**Nivel 8 expandido** — de 1 proyecto grande (8 pasos) a 4 proyectos, manteniendo la profundidad original:
- Proyectos 1-2 (core, existentes): Dockerizar el sistema (Dockerfiles + docker-compose) + generar CloudFormation template + validador cruzado. El `cloudformation/template.yml` y `validate.js` ya existían materializados de niveles previos.
- **Proyecto 3 (nuevo, core, el corazón)** — *Prove the validator*: `cloudformation/fixtures/` con templates deliberadamente rotos (port-mismatch, missing-health-check, missing-listener, exposed-port) y `cloudformation/validate.test.js` que confirma que el validador detecta cada tipo de defecto. El template bueno debe seguir pasando. Enseña que "un validador de infraestructura que nunca viste fallar no te protege de nada".
- **Proyecto 4 (nuevo, stretch)** — *Audit the IaC decisions*: separar qué decisiones de infraestructura son humanas (AZs, sizing, seguridad) y cuáles la IA puede traducir, cuestionar los defaults de la IA, escribir `project-8-infra-audit.md`.

**Materialización:** agregados 4 fixtures de templates rotos, `cloudformation/validate.test.js` (5 tests). Se encontró y corrigió un bug real en `validate.js`: el check de `exposed-port` usaba un regex con lookahead `(?=...\$)` con flag `/m`, lo que hacía que `$` matcheara al final de cada línea y capturara el cuerpo del security group vacío → falso negativo de seguridad. Se reemplazó por extracción del bloque por indentación, más robusta. También se corrigió un falso positivo: cuando `ServiceSecurityGroup` usa `SourceSecurityGroupId` (lo correcto), el array de CidrIp queda vacío y `[].every()` daba `true`; ahora requiere `allOpen.length > 0`.

**Verificación:** verify.js del N8 creado (mismo template, adaptado: Dockerfiles + CloudFormation + proof del validador). **Pasa 15/15** (stretch no-bloqueante). Se probó de verdad: el fixture `exposed-port.yml` es detectado, el template bueno pasa limpio, y `validate.test.js` pasa 5/5.

**Filosofía:** misma — profundidad antes que cantidad. El N8 no necesitaba más templates de cloud; necesitaba *probar* que el validador de infra detecta los errores que bloquearían un deploy. La infra con IA no es "copiar y pegar un template" — es generar rápido y validar duro.

## Nivel 9 expandido ✅ (2026-08-03) — Multiplicador de equipo

**Nivel 9 expandido** — de 1 proyecto grande (5 pasos) a 4 proyectos, manteniendo la profundidad original:
- Proyectos 1-2 (core, existentes): estándares como código (standards.json) + validador (validate.js) + dashboard. El sistema `standards/` y `dashboard/` ya existía materializado de niveles previos.
- **Proyecto 3 (nuevo, core, el corazón)** — *Prove the standards*: `standards/fixtures/broken/` con un sistema deliberadamente roto (servicio faltante, sin /health, líneas largas, secret hardcodeado, READMEs faltantes) y `standards/validate.test.js` que confirma que el validador detecta cada tipo de violación plantada. El sistema bueno debe seguir pasando con score alto.
- **Proyecto 4 (nuevo, stretch)** — *Audit the standards*: separar estándares enforceable vs aspiracional, cazar falsos positivos/negativos del validador, agregar un estándar nuevo con su test, escribir `project-9-standards-audit.md`.

**Materialización:** agregado fixture broken (users-service con secret + línea larga + sin health; orders-service con línea larga + sin health; notifications-service ausente; READMEs faltantes) y `standards/validate.test.js` (7 tests). Verificado: sistema bueno score 100/0 violaciones, fixture roto score 0/todas las categorías FAIL. El validador detecta style (líneas largas) y security (secrets) con precisión.

**Verificación:** verify.js del N9 creado (mismo template, adaptado: standards + dashboard + proof del validador). **Pasa 16/16** (stretch no-bloqueante). `node --test standards/validate.test.js` pasa 7/7.

**Filosofía:** misma — profundidad antes que cantidad. El N9 no necesitaba más estándares; necesitaba *probar* que el validador detecta cuando alguien los viola. Un estándar que tu validador nunca vio fallar no está siendo cumplido — está siendo ignorado.

## Nivel 10 expandido ✅ (2026-08-03) — El sistema completo (final boss)

**Nivel 10 expandido** — de 2 proyectos genéricos (full-stack task manager + retrospective, desalineados con la arquitectura convergente) a 4 proyectos que reflejan el sistema real N7-N9:
- Proyectos 1-2 (core, existentes materializados): sistema completo (auth + gateway + orquestador) + CI/CD (quality.yml). Ya estaban construidos de niveles previos: `auth-service/` (register/login/logout/health con event bus), `gateway/` (enruta /auth /users /orders + health agregado), `index.js` (orquestador que levanta los 5 componentes), `.github/workflows/quality.yml` (valida estándares + bloquea score<80 + comenta en PR).
- **Proyecto 3 (nuevo, core, el corazón)** — *Prove the full system*: `system.test.js` (test end-to-end) que arranca el sistema completo en `before`, verifica que el gateway enruta, el health agregado reporta todos ok, el flujo real de usuario (register → login → crear orden → listar), y los casos de error (401, 409, 404); apaga todo en `after`. Enseña que los bugs de integración son invisibles para los unit tests — el test e2e los encuentra.
- **Proyecto 4 (nuevo, stretch)** — *System retrospective*: escribir `project-10-retrospective.md` (qué salió bien, qué fue desafiante, qué harías distinto, métricas, patrones de prompts, recomendaciones).

**Materialización:** agregado `system.test.js` (10 tests, arranca/para los 5 servicios reales, usa fetch contra el gateway en :8080). Se encontró y corrigió un detalle real: los services responden 201 (no 200) en POST /users y /orders — el test ahora lo refleja. Los `console.log` de arranque de los services ensuciaban el pipe del test runner → se silencian en `before`/`after`. Se usa `--test-force-exit` porque los services abren servers que el runner no cierra solo.

**Verificación:** verify.js del N10 creado (mismo template, adaptado: sistema completo + CI/CD + proof end-to-end). **Pasa 21/21** (stretch no-bloqueante). `node --test system.test.js` pasa 10/10. Los tests previos siguen pasando: N7 event-flow 5/5, N8 validate 5/5, N9 standards 7/7. Puertos liberados tras el test (no quedan servers colgando).

**Filosofía:** misma — profundidad antes que cantidad. El N10 no necesitaba más features; necesitaba *probar* que el sistema completo funciona de punta a punta. Un sistema que nunca viste correr entero no es un sistema — es una colección de esperanzas.

## Próximos pasos (si se retoma)

- ✅ Curso completo 10/10 con niveles expandidos y verify.js en todos.
- Posible conversión a contenido para posicionamiento (LinkedIn/tutorials).
