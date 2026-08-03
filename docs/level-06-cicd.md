# Nivel 6 — CI/CD con IA 🔵

> **Meta:** Integrar IA en el pipeline de CI/CD. Aprender a automatizar code review, security audit y release notes — pero sobre todo, aprender a **probar** que esos gates funcionan.
>
> **Dificultad:** Intermedio | **Proyectos:** 4 (2 core + 1 profundidad + 1 stretch) | **Tiempo estimado:** 4-5 horas

---

## 🧠 Teoría — El pipeline es un gate. Los gates se prueban.

En los niveles anteriores construiste gates locales (workflows en N3, security audit en N5). El CI lo lleva a otro nivel: **el pipeline es el portero de tu repo**. Nada entra a `main` sin pasar por él.

### Un gate que no podés testear no es un gate

Esta es la frase que resume el nivel. Un workflow que "se supone que bloquea" pero que nunca probaste contra código malo es una decoración, no una protección. En CI esto es más peligroso que en local:

- **Falso negativo silencioso** — el gate no detecta el problema, el código malo entra a `main`, y nadie se entera hasta producción.
- **Falso positivo ruidoso** — el gate bloquea merges legítimos, los devs aprenden a ignorarlo o a hacer "workaround", y eventualmente lo `#skip-checks`.
- **Gate muerto** — el paso existe pero no hace nada (un `exit 0` olvidado, un glob que no matchea, un paso que corre sobre un diff vacío).

La regla: **todo gate de CI se prueba con dos casos — uno que debe fallar y uno que debe pasar.** Si solo probaste que pasa, no sabés si bloquea. Si solo probaste que bloquea, no sabés si deja pasar lo bueno.

### Gates determinísticos vs. IA en CI

| | Detector determinístico | Análisis con IA |
|---|---|---|
| **Velocidad** | Milisegundos | Segundos (latencias, tokens) |
| **Determinismo** | Mismo input → mismo output | Puede variar entre corridas |
| **Falsos positivos** | Bajos (reglas claras) | Altos (ve patrones, no contexto) |
| **Falsos negativos** | Altos (solo lo que programaste) | Bajos (entiende contexto) |
| **Bloquea el merge** | ✅ Sí, es confiable | ⚠️ Cuidado — puede bloquear de más |

**Regla de oro:** lo que **bloquea** el merge debe ser determinístico o de confianza alta. La IA es excelente para **informar** (comentarios, sugerencias, contexto) pero peligrosa como **bloqueo duro** — un falso positivo de IA frena el equipo.

Esto no significa "no uses IA para bloquear". Significa: cuando la IA bloquea, el criterio de bloqueo debe ser **estricto y verificable** (ej: "bloqueo solo si hay un hallazgo de severidad crítica de un detector determinístico", no "bloqueo si la IA tiene alguna duda").

### El orden de los gates importa

```
Commit → Lint (rápido) → Test (determinístico) → Build → Audit determinístico → AI review (informa, no bloquea) → Merge
```

- **Primero lo rápido y determinístico** — falla temprano, cuesta poco.
- **La IA al final** — como informante, no como portero principal.
- **Nunca pongas un gate caro adelante de uno barato** — correr build antes de lint es desperdiciar minutos.

Si el orden está mal, el pipeline se vuelve lento y la gente empieza a saltearlo. Un gate que nadie espera no es un gate — es un speed bump que aprenden a esquivar.

### El "why" de cada proyecto de este nivel

- **Proyecto 1 (PR review)** — automatizar la primera lectura de un PR. La IA comenta, no bloquea.
- **Proyecto 2 (Release notes)** — automatizar la comunicación del cambio. La IA resume, un humano edita.
- **Proyecto 3 (Prove the gate)** ⭐ el corazón — demostrar que tus gates de verdad bloquean y dejan pasar.
- **Proyecto 4 (Audit your pipeline)** — mirar tu propio pipeline con ojo crítico y encontrarle los defectos.

---

## 🛠️ Proyecto 1 — AI-powered GitHub Action (core)

> **Descripción:** Un GitHub Action que corre un code review automático en cada PR, con un gate que bloquea en hallazgos críticos.

### El flujo que vas a construir

```
PR abierto → Checkout → Diff → [analyze-pr.js] → JSON → Gate (bloquea si crítico) → Comentario en el PR
```

### Setup

```bash
mkdir -p projects/level-06-cicd/.github/workflows
mkdir -p projects/level-06-cicd/scripts
cd projects/level-06-cicd
npm init -y
```

### Paso 1: El analizador de diff

Construí un script que lea un diff de git y devuelva hallazgos. No necesita IA para empezar — reglas determinísticas primero:

Prompt:

> "Creá `scripts/analyze-pr.js`, un CLI en Node.js que analice un diff de git.
>
> Uso: `node scripts/analyze-pr.js --diff <ruta-al-diff>` — imprime un JSON con `{ summary, findings, suggestions }`.
>
> Debe detectar, sobre **líneas agregadas**:
> - **Secrets hardcodeados** (high): `password`, `api_key`, `token`, `secret` con valores literales; JWT (`eyJ...`)
> - **console.log** (low): debugging residual
> - **Funciones grandes** (medium): más de ~50 líneas agregadas en una función
> - **Archivo nuevo sin test** (medium): `.js/.ts` nuevo sin su `.test.js` correspondiente
> - **package.json sin lockfile** (medium): se tocó `package.json` pero no `package-lock.json`/`yarn.lock`
>
> Cada finding: `{ file, line, type, severity, description }`. severity ∈ high/medium/low.
> Cada suggestion: un string con la acción concreta."

El punto: este script es **determinístico**. Mismo diff, mismo output. Eso lo hace seguro para el gate.

### Paso 2: El gate

Agregá un paso que **falle el check** si hay hallazgos críticos (severity high). Esto es el "gate" del Proyecto 3 — por ahora lo creás, después lo probás:

Prompt:

> "Agregá al script `analyze-pr.js` un modo `--gate` que, además del análisis, salga con exit code 1 si hay hallazgos de severity `high`. El output JSON debe incluir `gate: { blocked: true, reasons: [...] }`."

### Paso 3: El workflow

Prompt:

> "Creá `.github/workflows/pr-review.yml` que corra en `pull_request` (types: opened, synchronize). Debe:
> 1. Checkout con `fetch-depth: 0`
> 2. Setup Node 20
> 3. Generar el diff: `git diff origin/${{ github.base_ref }}...HEAD > /tmp/pr-diff.txt`
> 4. Correr `node scripts/analyze-pr.js --diff /tmp/pr-diff.txt` y guardar el JSON
> 5. **Gate**: si `gate.blocked`, marcar el check como fallido
> 6. Postear un comentario con el resumen (archivos, líneas, hallazgos) usando `actions/github-script`
> 7. Auto-etiquetar según el resultado: `security:critical`, `needs-review`, `ready-to-merge`
>
> Permisos: `pull-requests: write`, `issues: write`, `contents: read`."

> 💡 **La decisión clave de diseño:** el gate bloquea por **severidad high determinística** (secrets, por ejemplo), no por cualquier opinión de IA. Así el pipeline es estricto donde debe y permisivo donde la IA solo informa. Esta decisión la vas a defender en el Proyecto 4.

### Criterios de completitud

- [ ] El workflow corre en cada PR
- [ ] `analyze-pr.js --gate` falla con exit 1 si hay hallazgos high
- [ ] El comentario se postea (o actualiza) en el PR
- [ ] El auto-labeling funciona
- [ ] Probaste el script localmente contra un diff real antes de subir

---

## 🛠️ Proyecto 2 — Automated release notes (core)

> **Descripción:** Un GitHub Action que genera release notes desde el historial de commits, agrupados por tipo y resumidos.

### El flujo

```
Tag vX.Y.Z → Fetch commits desde el tag anterior → Clasificar (feat/fix/chore/breaking) → Generar markdown → Postear al Release
```

### Setup

```bash
mkdir -p projects/level-06-cicd/scripts
```

### Paso 1: El generador local

Prompt:

> "Creá `scripts/generate-release-notes.js`, un CLI que genere release notes desde el historial de git.
>
> Uso: `node scripts/generate-release-notes.js [--from <ref>] [--to <ref>]` — escribe `CHANGELOG.md`.
>
> Debe:
> 1. Obtener los tags con `git tag --sort=-creatordate`; si no hay `--from`, usar el tag anterior (o el primer commit si hay un solo tag).
> 2. Obtener el log entre refs con `git log --oneline --format='%s||%h||%an'`.
> 3. Clasificar cada commit por conventional commits: `feat`→features, `fix`→fixes, `chore|refactor|test|docs|ci|style|perf|build`→chores, `BREAKING CHANGE` o `!:`→breaking, resto→other.
> 4. Generar markdown con secciones por categoría, cada ítem con su hash y autor.
> 5. Si no hay cambios, escribir '*No hay cambios nuevos.*'"

### Paso 2: Resumen con IA (simulada con reglas)

Acá entra la IA. En un pipeline real llamarías a un modelo; acá simulás el resumen con heurísticas que hacen el mismo trabajo conceptual: **resumir un grupo de commits en un bullet conciso**.

Prompt:

> "Agregá a `generate-release-notes.js` un paso de resumen: en vez de listar cada commit suelto, agrupar por categoría y generar **un bullet por tema**.
>
> Simulá la 'IA' con una heurística: los commits que comparten palabra clave (ej: 'auth', 'api', 'stripe') se agrupan en un solo bullet. Ej:
> - 3 commits sobre auth → `- Mejoras en autenticación (3 commits)`
>
> Esto imita lo que hace un LLM al resumir, pero es determinístico y testeable. En el README documentá que en producción esto se reemplaza por una llamada real a un modelo."

> 💡 **El punto:** el valor de la IA acá no es "escribir", es **reducir ruido**. 40 commits no son release notes; 6 temas sí. La IA resume, pero un humano edita antes de publicar. La release note automática es un borrador de alta calidad, no el producto final.

### Paso 3: El workflow

Prompt:

> "Creá `.github/workflows/release-notes.yml` que corra en `push` de tags `v*.*.*`. Debe:
> 1. Checkout con `fetch-depth: 0`
> 2. Setup Node 20
> 3. Correr `node scripts/generate-release-notes.js --to ${{ github.ref_name }}`
> 4. Commitear el `CHANGELOG.md` actualizado (user github-actions[bot])
> 5. Crear el Release con `softprops/action-gh-release@v2`, usando `CHANGELOG.md` como body
>
> Permisos: `contents: write`."

### Criterios de completitud

- [ ] El action corre al publicar un tag
- [ ] Los commits se agrupan por tipo (feat/fix/chore/breaking)
- [ ] El resumen agrupa por tema (simulando IA)
- [ ] El version bump es correcto según conventional commits
- [ ] Las release notes se postean al Release

---

## 🛠️ Proyecto 3 — Prove the CI gate 🔴 core (el corazón del nivel)

> **Descripción:** Demostrá que tus gates de CI de verdad bloquean y de verdad dejan pasar. Hasta que no lo probás, tu pipeline es una decoración.

Este es el proyecto que separa "creé un workflow" de "construí un pipeline confiable". El Proyecto 1 creó el gate. Acá lo **sometés a prueba**.

### Pasos

1. **Creá un diff malo (fixture).** Escribí `fixtures/bad.diff` — un diff que represente un PR que DEBE ser bloqueado: contiene un secret hardcodeado (`api_key = "sk-..."`), un `console.log`, y un archivo nuevo sin test.

2. **Creá un diff bueno (fixture).** Escribí `fixtures/good.diff` — un diff que represente un PR legítimo que DEBE pasar: código limpio, con su test, sin secrets.

3. **Escribí `scripts/test-gate.js`.** Un script que corre el gate contra AMBOS fixtures y verifica:
   - `bad.diff` → `--gate` **debe** salir con exit 1 (bloquea)
   - `good.diff` → `--gate` **debe** salir con exit 0 (deja pasar)
   - Si cualquiera de los dos falla, el script falla con un mensaje claro.

   Esto es tu **test del gate**. Igual que `node --test` prueba tu código, `test-gate.js` prueba tu pipeline.

4. **Conectá `test-gate.js` al workflow.** Agregá un paso que corra los tests del gate en cada PR (o en un push a `main`), para que el propio pipeline se pruebe a sí mismo. Un pipeline que no puede probar sus gates es un pipeline que no sabés si funciona.

5. **Probalo.** Corré `node scripts/test-gate.js` localmente y confirmá que pasa. Después rompé el `bad.diff` a propósito (cambiá el secret por una línea inocente) y confirmá que el test ahora **falla** — esa es la señal de que tu test de gate funciona.

### Criterios de completitud

- [ ] `fixtures/bad.diff` bloquea con `--gate` (exit 1)
- [ ] `fixtures/good.diff` pasa con `--gate` (exit 0)
- [ ] `scripts/test-gate.js` verifica ambos casos y falla si alguno no cumple
- [ ] El test del gate corre en el propio workflow de CI
- [ ] Rompiste un fixture a propósito y el test falló (demostraste que el test funciona)

> 💡 **La conclusión:** un gate que no probaste contra un caso que debe fallar te da falsa seguridad. El Proyecto 3 es lo que hace que tu CI sea un portero de verdad, no una puerta pintada en la pared. Si el gate falla en bloquear lo malo, tu pipeline entero es teatro.

---

## 🛠️ Proyecto 4 — Audit your own pipeline 🟠 stretch

> **Descripción:** Mirá tu propio pipeline de CI con ojo crítico y encontrale los defectos. El mejor way de entender los límites de un sistema es atacarlo.

### Pasos

1. **Cazá falsos positivos.** Corré `analyze-pr.js` contra un diff con código inocente que *parezca* sospechoso (una variable llamada `password` en un test, un string que contiene `SELECT` que no es SQL, un `console.log` legítimo). ¿Cuántos falsos positivos marcó?

2. **Cazá falsos negativos.** ¿Qué código malo NO detecta tu pipeline? Probá con: SQL injection por concatenación de strings, un secret en una línea larga que tu regex no agarra, una función grande repartida en varios commits. ¿Se te escapó algo?

3. **Revisá el orden de los gates.** Mirá tu `pr-review.yml`: ¿corre el lint antes del build? ¿El análisis pesado va al final? ¿El gate determinístico va antes que la IA? Si el orden está mal, anotá cómo lo arreglarías.

4. **Escribí tu análisis** en `project-6-pipeline-audit.md`:
   - Qué detectó bien tu pipeline
   - Qué falsos positivos y negativos encontraste
   - Un ajuste concreto que harías (y por qué)
   - Una frase: *¿por qué un pipeline que solo deja pasar no es un pipeline?*

### Criterios de completitud

- [ ] Corriste tu pipeline contra código inocente y listaste los falsos positivos
- [ ] Corriste contra código malo que esperabas que detecte y buscaste falsos negativos
- [ ] Revisaste el orden de los gates con criterio
- [ ] Escribiste `project-6-pipeline-audit.md` con tu análisis
- [ ] Podés explicar por qué la falsa seguridad es peor que no tener pipeline

> 💡 **La conclusión:** el pipeline que "siempre pasa" es el más peligroso — o no detecta nada, o nadie lo toma en serio. Un pipeline honesto reporta sus propios límites. Auditarlo es la diferencia entre usar CI como herramienta y creerte que el CI te salva.

---

## 📣 LinkedIn — Post para publicar

---

**Construí un pipeline de CI que se prueba a sí mismo ⚙️**

Nivel 6 del AI Engineering Bootcamp: CI/CD con IA.

Construí:
- Un GitHub Action que hace code review automático en cada PR
- Release notes generadas desde el historial de commits
- Y lo más importante: **un test que prueba que mis gates bloquean**

La lección que me llevo:
- Un gate que no podés testear no es un gate
- Lo que bloquea el merge debe ser determinístico; la IA informa, no bloquea de más
- El orden importa: rápido y determinístico primero, IA al final
- Un pipeline que siempre pasa es sospechoso

La IA no reemplaza al portero. Lo hace más inteligente.

Próximo: arquitectura y microservicios con IA.

#AIEngineering #CI #DevOps #GitHubActions #NodeJS

---

## Self-review

Antes de pasar al Nivel 7, respondé:

- [ ] ¿Entendés la diferencia entre un gate determinístico y uno con IA?
- [ ] ¿Por qué lo que bloquea el merge debe ser determinístico o de confianza alta?
- [ ] ¿Construiste un action que analiza PRs y un gate que bloquea en hallazgos críticos?
- [ ] ¿Generaste release notes desde el historial, agrupadas y resumidas?
- [ ] ¿Probaste tu gate contra un diff malo (debe fallar) y uno bueno (debe pasar)?
- [ ] ¿Tu pipeline se prueba a sí mismo en CI?
- [ ] ¿Auditaste tu pipeline y encontraste sus falsos positivos/negativos?

→ Si respondiste "sí" a todo, avanzá al **Nivel 7**.

---

## Verificación (auto-check)

Corré el checklist para confirmar que completaste los proyectos:

```bash
cd projects/level-06-cicd
node verify.js
```

`verify.js` chequea: los workflows y scripts del Proyecto 1-2, el test del gate con sus fixtures (Proyecto 3, core) y el registro de auditoría del pipeline (Proyecto 4, stretch). Confirma *esfuerzo*, no *calidad* — la calidad la juzgás vos contra el self-review de arriba.

> Mismo template que los niveles 1-5. Confirma esfuerzo + rúbrica que guía el juicio.
