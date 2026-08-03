# Nivel 9 — Multiplicador de equipo con IA 👥

> **Meta:** Escalar estándares de equipo usando IA. Definir reglas reutilizables, validar que el código las cumple, y visualizar el estado en un dashboard.
>
> **Dificultad:** Avanzado | **Proyecto:** 9 (extiende el N7/N8) | **Tiempo estimado:** 120-150 minutos

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
├── commit: { format: "type(scope): description", allowedTypes: [...] }
├── style: { maxLineLength: 80, maxFunctionLines: 30 }
├── health: { requiredPath: "/health", requiredOn: ["users", "orders"] }
├── security: { detectSecrets: true, detectInjection: true }
└── testing: { requireTestsForNewFiles: true }
```

### El dashboard como contrato visual

Un dashboard de calidad no es un lujo — es la **verificación continua** de que los estándares se cumplen. Muestra:
- Qué estándares se cumplen y cuáles no
- Dónde están las violaciones
- La tendencia (¿mejora o empeora?)
- El score general

Si el equipo ve el dashboard, el estándar se vuelve real. Si no lo ve, es teoría.

---

## 🛠️ Práctica — Estándares + Dashboard sobre el sistema N7/N8

Vas a definir estándares de equipo para el sistema de microservicios, construir un validador que los aplique, y visualizar todo en un dashboard.

### Setup

```bash
cd projects/level-07-microservices  # reusás el sistema
mkdir -p standards dashboard
```

### Paso 1: Los estándares

Definí los estándares como código.

Prompt:

> "Creá un archivo standards/standards.json que defina estándares de equipo para un sistema de microservicios Node.js:
>
> ```json
> {
>   "services": {
>     "required": ["users-service", "orders-service", "notifications-service"],
>     "healthCheckPath": "/health"
>   },
>   "commit": {
>     "format": "type(scope): description",
>     "allowedTypes": ["feat", "fix", "chore", "refactor", "docs", "test", "perf", "ci", "style"],
>     "requireScope": false
>   },
>   "style": {
>     "maxLineLength": 80,
>     "maxFunctionLines": 30,
>     "noConsoleLogInSrc": true
>   },
>   "security": {
>     "detectSecrets": true,
>     "detectInjection": true,
>     "detectVulnerableDeps": true
>   },
>   "testing": {
>     "requireTestsForNewFiles": true
>   },
>   "docs": {
>     "requireReadmePerService": true,
>     "requireApiDocPerService": true
>   }
> }
> ```
>
> Ajustá los valores si querés (por ejemplo, maxLineLength podría ser 100 para JS moderno). El archivo debe ser válido JSON y ser la fuente de verdad de los estándares."

### Paso 2: El validador de estándares

Ahora construí un script que lea los estándares y valide el sistema contra ellos.

Prompt:

> "Creá un script standards/validate.js que:
> - Lea standards/standards.json
> - Valide el sistema contra los estándares:
>   - **Services**: que existan los servicios requeridos (carpetas con index.js)
>   - **Health check**: que cada servicio HTTP tenga un endpoint /health
>   - **Style**: detectar líneas > maxLineLength y funciones > maxFunctionLines en el código
>   - **Security**: correr detectores básicos de secrets (patrones de password/token) — reutilizá la lógica de niveles anteriores si podés
>   - **Docs**: que cada servicio tenga un README.md
> - Devuelva un objeto con el resultado por estándar:
>   ```js
>   {
>     score: 87,  // 0-100
>     checks: [
>       { name: "services", status: "pass" | "fail" | "warn", details: [...] },
>       { name: "health-check", status: "...", details: [...] },
>       ...
>     ],
>     violations: [
>       { standard: "style", file: "users-service/index.js", line: 42, message: "Línea de 95 caracteres (max 80)" }
>     ]
>   }
> ```
> - Use solo módulos nativos (fs, path)
> - Exporte la función validate(projectRoot, standards) para que el dashboard la pueda usar"

### Paso 3: El dashboard

Construí un dashboard HTML que visualice el estado del sistema.

Prompt:

> "Creá un dashboard (dashboard/index.html) que muestre el estado de calidad del sistema de microservicios. El dashboard debe:
>
> - Cargar el resultado de standards/validate.js (simulado en un archivo data.json, o con valores de ejemplo embebidos)
> - Mostrar:
>   - **Score general** grande (0-100) con color (verde > 80, amarillo 60-80, rojo < 60)
>   - **Checks por estándar** — cada uno con su estado (pass/fail/warn) y detalles
>   - **Violaciones** — tabla con standard, archivo, línea, mensaje
>   - **Servicios** — tarjetas mostrando cada servicio y su estado
> - Estilo: moderno, limpio, con una sola librería (o CSS puro). No usar frameworks.
> - Todo en un solo archivo index.html con CSS y JS embebidos
> - Debe verse bien en desktop y mobile
>
> Usá datos de ejemplo realistas (no vacíos) para que se vea el dashboard funcionando. Ejemplo: users-service y orders-service pasan health check, notifications-service no tiene README, hay 2 violaciones de style, score 85."

### Paso 4: Conectá el validador al dashboard

Prompt:

> "Creá un script generate-dashboard-data.js que:
> - Ejecute standards/validate.js contra el proyecto
> - Serialice el resultado a JSON
> - Lo escriba como dashboard/data.json
> - Imprima un resumen con el score y los checks fallidos
>
> Después el dashboard/index.html debe leer dashboard/data.json (podés embederlo en el HTML al generar, o hacer que lo lea con fetch si lo servís localmente)."

### Paso 5: Probá el sistema completo

```bash
node standards/validate.js
node generate-dashboard-data.js
# Abrí dashboard/index.html en el navegador
```

Si hay violaciones (seguro las hay en algún lado), corregí el código y volvé a generar. El dashboard debería reflejar la mejora.

### Criterios de completitud

- [ ] standards/standards.json define estándares como código
- [ ] standards/validate.js valida el sistema contra los estándares
- [ ] El validador detecta al menos 3 tipos de violaciones
- [ ] El dashboard muestra score, checks, violaciones, y servicios
- [ ] Corriste el flujo completo: validar → generar data → abrir dashboard
- [ ] Corregiste al menos una violación y el dashboard reflejó la mejora
- [ ] Entendés cómo una persona con IA escala estándares de equipo

---

## 📣 LinkedIn — Post para publicar

---

**Una persona + IA = el equipo de plataforma que no tenías 👥**

Nivel 9 del AI Engineering Bootcamp: Multiplicador de equipo.

Definí estándares de equipo como código (standards.json) y construí:
- Un validador que los aplica a todo el sistema
- Un dashboard que muestra el estado de calidad en tiempo real

Lo que aprendí:
- Los estándares como código > los estándares como documentación
- Una persona con IA puede hacer cumplir reglas que antes requerían un equipo de plataforma
- El dashboard no es un lujo — es la verificación continua de que los estándares se cumplen
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
- [ ] ¿Entendés el concepto de la IA como capa de estándares?

→ Si respondiste "sí" a todo, avanzá al **Nivel 10**.
