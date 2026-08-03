# Nivel 3 — Workflows con IA 🟠

> **Meta:** Usar la IA como parte de un proceso, no solo para generar código. Construir herramientas que ejecuten tareas repetitivas con supervisión humana.
>
> **Dificultad:** Intermedio | **Proyecto:** 3 | **Tiempo estimado:** 90-120 minutos

---

## 🧠 Teoría — De prompts a procesos

### El salto mental

Hasta ahora la IA fue un **generador**: escribís un prompt, obtenés código. Es útil, pero es el uso más básico.

El salto a **workflows** es cuando la IA deja de ser un generador y pasa a ser un **procesador**:

```
Entrada (código, texto, datos) → [IA + reglas] → Salida estructurada (reporte, resumen, transformación)
```

La diferencia es sutil pero profunda:
- **Generador:** "Escribí una función que valide emails" → obtenés código
- **Workflow:** "Tomá este archivo, analizá cada función, y devolvé un reporte markdown con problemas encontrados" → obtenés un proceso

### System prompts vs user prompts

Hasta ahora usaste **user prompts** — la instrucción que le das a la IA en cada interacción.

Los **system prompts** son diferentes: definen el rol, las reglas, el formato de salida, y persisten durante toda la conversación. Son la diferencia entre:

> "Analizá este código y decime si tiene problemas"

y

> "Sos un code reviewer senior especializado en Node.js. Siempre respondés en markdown con esta estructura:
> - Resumen (1 línea)
> - Problemas encontrados (tabla: línea, severidad, descripción)
> - Sugerencias (lista numerada)
> - Puntaje general (1-10)
>
> No inventes problemas. Si no hay nada que reportar, decilo explícitamente."

El system prompt **define el comportamiento**. El user prompt **define la tarea concreta**.

### Pipelines de transformación

Un workflow con IA suele ser una cadena de pasos:

```
1. Leer archivo de entrada
2. Aplicar reglas de análisis (IA + lógica local)
3. Estructurar resultados
4. Escribir archivo de salida
```

Cada paso puede involucrar IA o no. La clave es que **la IA es un componente del pipeline**, no el pipeline entero. El código que escribís orquesta el proceso, la IA ejecuta las partes que requieren criterio.

### Determinismo vs creatividad

La IA es inherentemente no-determinística — el mismo prompt puede dar resultados distintos. En un workflow, eso es un problema.

**Estrategias para mitigarlo:**
- **System prompts fijos** — el comportamiento base no cambia entre ejecuciones
- **Formato de salida explícito** — JSON o markdown estructurado, no prosa libre
- **Validación post-procesamiento** — verificá que la salida tenga la estructura esperada antes de usarla
- **Fallbacks** — si la IA no produce algo válido, reintentá con un prompt más específico

---

## 🛠️ Práctica — CLI de code review

Vas a construir una herramienta de línea de comandos que analice archivos JavaScript y genere un reporte de code review. La IA va a ser el motor de análisis, pero el CLI (el workflow) lo escribís vos.

### Setup

```bash
mkdir -p projects/level-03-workflows/review-cli
cd projects/level-03-workflows/review-cli
npm init -y
```

### Paso 1: El pipeline sin IA

Primero construí el esqueleto del workflow sin inteligencia artificial. Un script que:

1. Recibe un path de archivo como argumento
2. Lee el archivo
3. Aplica reglas básicas (líneas muy largas, funciones muy grandes, console.log en producción)
4. Genera un reporte markdown

Prompt inicial:

> "Creá un CLI tool en Node.js que analice archivos JavaScript. Debe:
> - Aceptar --file (ruta del archivo) y --output (ruta del reporte, opcional, default review.md)
> - Leer el archivo y contar: líneas totales, funciones declaradas, console.logs
> - Detectar líneas de más de 80 caracteres
> - Detectar funciones de más de 30 líneas
> - Generar un reporte markdown con: resumen, tabla de métricas, y sección de advertencias
> - Usar solo módulos nativos de Node.js (fs, path)
> - Ser un solo archivo index.js"

### Paso 2: Agregá el system prompt

Ahora modificá el CLI para que también pueda generar un análisis cualitativo usando IA. Creá un segundo modo:

> --ai — habilita análisis con IA (simulado con reglas locales si no tenés acceso a API)

El modo --ai debe:
1. Leer el archivo
2. Construir un system prompt con el rol de code reviewer
3. Pasar el contenido del archivo como contexto
4. Devolver un análisis estructurado

Para simularlo sin API real, implementá reglas locales que imiten el criterio de un revisor:
- Complejidad ciclomática (if anidados, switches largos)
- Nombres de variables poco descriptivos (menos de 3 caracteres)
- Falta de manejo de errores (try/catch ausente en operaciones riesgosas)
- Código comentado

Prompt para esta parte:

> "Agregá un modo --ai a mi CLI de code review. Cuando se activa, debe analizar el archivo con estas reglas adicionales:
> - Detectar funciones con más de 3 niveles de anidación (if dentro de for dentro de if)
> - Detectar variables con nombres de 1 o 2 caracteres (excepto i, j, k en loops)
> - Detectar operaciones sin try/catch (JSON.parse, fetch, readFile)
> - Detectar bloques de código comentado (más de 3 líneas consecutivas comentadas)
>
> El reporte debe incluir una sección "Análisis con IA" con estos hallazgos, cada uno con línea, severidad (baja/media/alta), y sugerencia."

### Paso 3: Probá el workflow completo

Ejecutá el CLI contra el proyecto del nivel 2:

```bash
node index.js --file ../level-02-prompts/tasks-api/routes/tasks.js --output review-tasks-api.md --ai
```

Abrí el reporte generado. ¿Tiene sentido? ¿Las reglas detectaron problemas reales? ¿Falsos positivos?

### Paso 4: Iterá el system prompt

El system prompt que definiste en el paso 2 probablemente no sea perfecto. Modificá las reglas, ajustá severidades, agregá nuevas detecciones. Cada iteración es un ciclo de mejora del workflow.

Probá con distintos archivos:
- Tu propio código del nivel 1
- Código de un proyecto open source chico
- Código deliberadamente mal escrito (para ver si lo detecta)

### Paso 5: Hacé el workflow portable

Agregá un binario al package.json para que se pueda ejecutar desde cualquier lado:

```json
"bin": {
  "review-cli": "./index.js"
}
```

Y un shebang al inicio de index.js:

```js
#!/usr/bin/env node
```

Ahora cualquiera en tu equipo puede correr `npx review-cli --file ./src/index.ts` sin saber que existe el script.

### Criterios de completitud

- [ ] El CLI funciona sin IA (modo básico con reglas de estilo)
- [ ] El CLI funciona con --ai (reglas de complejidad, nombres, errores, código comentado)
- [ ] Probaste contra al menos 2 archivos diferentes
- [ ] Iteraste el system prompt al menos una vez
- [ ] Agregaste bin al package.json
- [ ] El reporte markdown es legible y útil
- [ ] Identificaste al menos un falso positivo y ajustaste la regla

---

## 📣 LinkedIn — Post para publicar

---

**De "escribí código" a "construí un proceso con IA" 🔄**

Nivel 3 del AI Engineering Bootcamp: Workflows con IA.

Construí un CLI tool que analiza código y genera reportes de code review automáticos. La IA no escribe el código — es el motor de análisis dentro de un pipeline que yo diseñé.

Lo que aprendí:
- System prompts > user prompts cuando querés comportamiento consistente
- La IA es un componente del pipeline, no el pipeline entero
- Un workflow bien diseñado se puede compartir como `npx` y cualquiera lo usa

Próximo nivel: Prompt Library — sistema de templates reutilizables.

#AIEngineering #CodeReview #CLITools #NodeJS #DeveloperTools

---

## Self-review

Antes de pasar al Nivel 4, respondé:

- [ ] ¿Entendés la diferencia entre un generador y un workflow con IA?
- [ ] ¿Construiste un pipeline donde la IA es un componente, no el producto?
- [ ] ¿Probaste el CLI contra código real y ajustaste reglas?
- [ ] ¿El workflow es portable (bin en package.json)?
- [ ] ¿Identificaste limitaciones de la IA en el análisis (falsos positivos, contexto limitado)?

→ Si respondiste "sí" a todo, avanzá al **Nivel 4**.
