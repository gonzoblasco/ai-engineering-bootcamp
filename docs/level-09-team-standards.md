# Nivel 9 — Multiplicador de equipo con IA 👥

> **Meta:** Escalar estándares de equipo usando IA. Definir reglas reutilizables, validar que el código las cumple, visualizar el estado en un dashboard — y **probar** que tu validador de estándares detecta cuando alguien las viola.
>
> **Dificultad:** Avanzado | **Proyectos:** 4 (2 core + 1 profundidad + 1 stretch) | **Tiempo estimado:** 3-4 horas
>
> **Nota:** este nivel extiende el sistema del **Nivel 7/8** (mismo folder, ADR-001). Reusás los microservicios, los Dockerfiles y el CloudFormation template.

---

## 🧠 Teoría — La IA como capa de estándares

### El cuello de botella del código

Cuando un equipo crece, el problema no es escribir código — es **mantener consistencia**. Cada dev tiene su propio estilo, sus propias convenciones, su propia idea de "código limpio". Sin estándares, el review se vuelve una guerra de gustos y el código se degrada.

Tradicionalmente, escalar estándares requería un **equipo de plataforma**: gente dedicada a definir reglas, escribirlas, hacerlas cumplir, y monitorear que se respeten. Caro y lento.

### La IA invierte la ecuación

Con IA, **una sola persona puede definir y hacer cumplir estándares que normalmente requerirían un equipo**. La IA es la "capa de estándares":

```
Standards (config) → [IA + detectores] → Validación → Dashboard
```

La persona define las reglas una vez (en un config reutilizable), la IA y los detectores las aplican a todo el código, y el dashboard muestra el estado en tiempo real.

### El multiplicador real

Esto es lo que hace que la IA sea un **multiplicador de equipo**, no solo un generador de código:

| Sin IA | Con IA como capa de estándares |
|--------|-------------------------------|
| Cada dev tiene sus convenciones | Un config central define todo |
| El review es subjetivo | Los detectores validan objetivamente |
| El estándar se desactualiza | Se actualiza en un lugar |
| No hay visibilidad del estado | Dashboard en tiempo real |
| El onboarding es lento | El estándar está documentado y aplicado |

### Estándares como código

La clave es que los estándares sean **código, no documentación**. Un archivo `standards.json` que los detectores puedan leer y aplicar es mucho más poderoso que un `CONVENTIONS.md` que nadie lee.

```
standards.json
├── services: { required: [...], healthCheckPath: "/health" }
├── style: { maxLineLength: 100, maxFunctionLines: 30, noConsoleLogInSrc: true }
├── security: { detectSecrets: true }
├── docs: { requireReadmePerService: true }
└── testing: { requireTestsForNewFiles: true }
```

### El dashboard como contrato visual

Un dashboard de calidad no es un lujo — es la **verificación continua** de que los estándares se cumplen. Muestra:
- Qué estándares se cumplen y cuáles no
- Dónde están las violaciones
- La tendencia (¿mejora o empeora?)
- El score general

Si el equipo ve el dashboard, el estándar se vuelve real. Si no lo ve, es teoría.

### El tema que este nivel lleva al extremo

Desde el N1 venís con **"don't trust, verify"**. Acá se aplica literal al estándar mismo:

- El validador (`standards/validate.js`) es el **árbitro** entre el código y el estándar.
- Un validador que nunca viste fallar no te dice nada: podés creer que el equipo cumple los estándares porque "el dashboard da 100", pero el validador puede no detectar las violaciones.
- La prueba de fuego: **violá el estándar a propósito y confirmá que el validador lo agarra.**

El estándar más caro no es el que no se cumple — es el que **tu validador no mide** y que se degrada silenciosamente mientras el dashboard muestra verde.

---

## 🛠️ Proyecto 1 — Los estándares como código (core)

> **Descripción:** Definir los estándares de equipo en `standards/standards.json` — la fuente de verdad única.

### Pasos

1. Creá `standards/standards.json` con los estándares. Prompt:

> "Creá un archivo standards/standards.json que defina estándares de equipo para un sistema de microservicios Node.js:
>
> - **services**: required = users-service, orders-service, notifications-service; healthCheckPath = /health
> - **commit**: format = type(scope): description; allowedTypes = [feat, fix, chore, refactor, docs, test, perf, ci, style]
> - **style**: maxLineLength = 100; maxFunctionLines = 30; noConsoleLogInSrc = true
> - **security**: detectSecrets = true
> - **docs**: requireReadmePerService = true
>
> El archivo debe ser JSON válido y ser la fuente de verdad."

### Criterios de completitud

- [ ] `standards/standards.json` existe y es JSON válido
- [ ] Define servicios, estilo, seguridad y docs
- [ ] Entendés por qué el estándar como código gana sobre la documentación

---

## 🛠️ Proyecto 2 — El validador + el dashboard (core)

> **Descripción:** Construir el validador que aplica los estándares al sistema, y el dashboard que visualiza el estado.

### Pasos

1. Creá `standards/validate.js`. Prompt:

> "Creá un script standards/validate.js que:
> - Lea standards/standards.json
> - Valide el sistema contra los estándares:
>   - **Services**: que existan los servicios requeridos (carpetas con index.js)
>   - **Health check**: que cada servicio HTTP tenga /health
>   - **Style**: detectar líneas > maxLineLength y funciones > maxFunctionLines
>   - **Security**: detectar secrets hardcodeados (patrones de password/token)
>   - **Docs**: que cada servicio tenga README.md
> - Devuelva `{ score, checks: [{name, status, details}], violations: [...] }`
> - Use solo módulos nativos y exporte `validate(projectRoot, standards)`"

2. Creá el dashboard `dashboard/index.html` que muestre score, checks, violaciones y servicios.

3. Creá `generate-dashboard-data.js` que ejecute el validador y escriba `dashboard/data.json`.

4. Corré el flujo:
```bash
node standards/validate.js
node generate-dashboard-data.js
# Abrí dashboard/index.html
```

### Criterios de completitud

- [ ] `standards/validate.js` valida el sistema contra los estándares
- [ ] El validador detecta al menos 3 tipos de violaciones
- [ ] `dashboard/index.html` muestra score, checks, violaciones y servicios
- [ ] Corriste validar → generar data → abrir dashboard
- [ ] Corregiste al menos una violación y el dashboard reflejó la mejora

---

## 🛠️ Proyecto 3 — Prove the standards 🔴 core (el corazón del nivel)

> **Descripción:** Demostrá que tu validador de estándares de verdad detecta violaciones. Un validador que nunca viste fallar te da falsa seguridad — y el estándar que tu validador no mide se degrada silenciosamente mientras el dashboard muestra verde.

Los proyectos 1-2 construyen los estándares, el validador y el dashboard. Acá los **sometés a prueba**. El mismo principio del N6 (gate), N7 (event flow) y N8 (validador de infra), ahora sobre estándares de equipo.

### Pasos

1. **Creá un fixture de sistema roto.** Escribí un proyecto de prueba (por ejemplo en `standards/fixtures/`) que **viole deliberadamente** los estándares:
   - Un servicio sin `index.js` (viola `services`)
   - Un servicio sin endpoint `/health` (viola `health-check`)
   - Una línea de más de 100 caracteres (viola `style`)
   - Un secret hardcodeado como `const PASSWORD = "s3cr3t"` (viola `security`)
   - Un servicio sin `README.md` (viola `docs`)

2. **Escribí `standards/validate.test.js`** que pruebe, con `node --test`:
   - Que el sistema **bueno** (el real N7/N8) pasa la validación con score alto
   - Que el fixture **roto** baja el score y reporta las violaciones correctas
   - Que el validador detecta **cada tipo** de violación que plantaste (services, health-check, style, security, docs)

3. **Probalo.** Corré `node --test standards/validate.test.js`. Si una violación plantada no se detecta, tu validador de estándares tiene un agujero — lo acabas de encontrar antes que el equipo.

4. **Rompé algo a propósito.** Si tu validador no mide un estándar que esperás, ese es el hallazgo más valioso: significa que tu estándar es teoría, no un gate.

### Criterios de completitud

- [ ] Creaste un fixture de sistema que viola al menos 3 estándares deliberadamente
- [ ] `standards/validate.test.js` verifica que el sistema bueno pasa y el roto falla
- [ ] El test confirma que el validador detecta cada tipo de violación plantada
- [ ] Encontraste al menos un caso donde el validador NO mide algo (o confirmaste que mide todo)
- [ ] Entendés por qué un estándar sin validador probado es teoría, no un gate

> 💡 **La conclusión:** un estándar que tu validador nunca viste fallar no está siendo cumplido — está siendo ignorado. Violar el estándar a propósito es la única forma de saber si tu gate de calidad funciona. El dashboard que "siempre da 100" es sospechoso — o el equipo es perfecto, o tu validador no mide lo correcto.

---

## 🛠️ Proyecto 4 — Audit the standards 🟠 stretch

> **Descripción:** Mirá críticamente los estándares que definiste y el validador que los aplica. Separá los estándares que se pueden probar de los que son aspiracionales.

### Pasos

1. **Inventariá los estándares.** Para cada estándar en `standards.json`, anotá: ¿se puede verificar automáticamente con el validador, o es aspiracional (depende del juicio humano)?

2. **Cazá falsos positivos.** Un validador que reporta violaciones donde no las hay pierde credibilidad rápido. ¿El tuyo tiene falsos positivos? (por ejemplo, marcar como "secret" algo que es un placeholder).

3. **Cazá falsos negativos.** ¿Hay violaciones que el validador NO detecta? (por ejemplo, un secret con otro formato, o una función grande que el regex no atrapa).

4. **Agregá un estándar.** Elegí un estándar que le faltaría a tu sistema y agregalo a `standards.json` + `validate.js`. Escribí un test para él.

5. **Escribí tu análisis** en `project-9-standards-audit.md`:
   - 1 estándar que se puede probar y cómo lo verifica el validador
   - 1 estándar aspiracional (o un falso positivo que encontraste)
   - El estándar nuevo que agregaste
   - Una frase: *¿por qué un estándar sin gate es teoría?*

### Criterios de completitud

- [ ] Inventariaste cuáles estándares se pueden probar y cuáles no
- [ ] Encontraste al menos un falso positivo o falso negativo del validador
- [ ] Agregaste un estándar nuevo con su test
- [ ] Escribiste `project-9-standards-audit.md`
- [ ] Podés explicar la diferencia entre un estándar enforceable y uno aspiracional

> 💡 **La conclusión:** los estándares no valen por lo que dicen, valen por lo que el validador puede probar. Un estándar aspiracional que nadie puede medir es un deseo, no una regla.

---

## 📣 LinkedIn — Post para publicar

---

**Una persona + IA = el equipo de plataforma que no tenías 👥**

Nivel 9 del AI Engineering Bootcamp: Multiplicador de equipo.

Definí estándares de equipo como código (standards.json) y construí:
- Un validador que los aplica a todo el sistema
- Un dashboard que muestra el estado de calidad en tiempo real
- Y probé que el validador detecta cuando alguien los viola

Lo que aprendí:
- Los estándares como código > los estándares como documentación
- Una persona con IA puede hacer cumplir reglas que antes requerían un equipo de plataforma
- El dashboard no es un lujo — es la verificación continua de que los estándares se cumplen
- Un estándar que tu validador nunca vio fallar no está siendo cumplido, está siendo ignorado
- El verdadero multiplicador de la IA no es generar código, es escalar consistencia

Próximo nivel: el sistema completo — juntando todo.

#AIEngineering #DeveloperExperience #EngineeringStandards #NodeJS #TeamScaling

---

## Self-review

Antes de pasar al Nivel 10, respondé:

- [ ] ¿Definiste estándares como código (no como documentación)?
- [ ] ¿El validador aplica los estándares al sistema?
- [ ] ¿El dashboard muestra el estado de calidad?
- [ ] ¿Corrigiste al menos una violación y viste la mejora?
- [ ] ¿Probaste que tu validador detecta violaciones (no solo que el sistema cumple)?
- [ ] ¿Entendés el concepto de la IA como capa de estándares?

→ Si respondiste "sí" a todo, avanzá al **Nivel 10**.

---

## Verificación (auto-check)

Corré el checklist para confirmar que completaste los proyectos:

```bash
cd projects/level-07-microservices
node verify.js
```

`verify.js` chequea: `standards.json` (Proyecto 1), el validador y el dashboard (Proyecto 2), los fixtures de sistema roto y el test del validador (Proyecto 3, core) y el registro de auditoría de estándares (Proyecto 4, stretch). Confirma *esfuerzo*, no *calidad* — la calidad la juzgás vos contra el self-review de arriba.

> Mismo template que los niveles 1-8. Confirma esfuerzo + rúbrica que guía el juicio.
