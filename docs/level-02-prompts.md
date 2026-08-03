# Nivel 2 — Prompts que funcionan 🟡

> **Meta:** Entender qué hace que un prompt genere código correcto, mantenible y predecible.
>
> **Dificultad:** Principiante → Intermedio | **Proyecto:** 2 | **Tiempo estimado:** 60-90 minutos

---

## 🧠 Teoría — Anatomía de un prompt efectivo

### El problema del prompt vago

Probá este prompt en cualquier IA:

> "Hacé una API REST con Express."

¿Qué va a generar? Algo. Pero no sabés qué. Puede ser un CRUD de usuarios, un endpoint de salud, o una API de tareas. Puede usar MongoDB, SQLite, o un array en memoria. Puede tener validación o no.

El problema no es la IA — es que **le estás pidiendo que adivine**. Y cuando adivina, el resultado es impredecible.

### Las 4 dimensiones de un prompt

Un prompt efectivo tiene que cubrir estas 4 cosas:

| Dimensión | Pregunta | Ejemplo |
|-----------|----------|---------|
| **Contexto** | ¿En qué proyecto/stack estoy? | "Estoy en un proyecto Node.js con Express y SQLite" |
| **Output** | ¿Qué quiero exactamente? | "Un endpoint GET /tasks que devuelva JSON" |
| **Formato** | ¿Cómo quiero la respuesta? | "Un solo archivo index.js, con comentarios en español" |
| **Restricciones** | ¿Qué NO quiero? | "Sin autenticación, sin TypeScript, sin dependencias extra" |

Un prompt completo combina las 4:

> "Estoy en un proyecto Node.js con Express. Necesito un endpoint GET /tasks que devuelva un array de objetos con id, title, done, y createdAt. Usá un array en memoria como base de datos. Devolvé los errores como { error: string } con el status code correspondiente. Generalo como un solo archivo index.js."

**La diferencia no es magia — es especificidad.**

### Few-shot: el acelerador

El mejor prompt muchas veces no es una instrucción, sino **un ejemplo**. Esto se llama few-shot prompting:

> "Necesito un endpoint similar a este, pero para tasks:
> ```js
> app.get('/users', (req, res) => {
>   res.json(users);
> });
> ```"

La IA entiende el patrón mucho más rápido con un ejemplo que con tres párrafos de descripción. Esto es clave cuando trabajás con código existente — mostrale el patrón, no se lo expliques.

### Chain of thought: pedile que piense

Para problemas más complejos, pedile que razone antes de escribir:

> "Pensá paso a paso qué endpoints necesito para un CRUD de tasks, qué validaciones debería tener cada uno, y después generá el código."

La IA comete menos errores cuando "piensa en voz alta" antes de producir código. No es que razone como humano — es que el proceso de desglosar el problema reduce la probabilidad de saltarse pasos.

### El prompt no es el código

Esto es lo que más cuesta aprender: **el prompt es el borrador, no el producto final**. El código generado siempre necesita revisión. La habilidad no es escribir el prompt perfecto de entrada — es iterar rápido.

```
Prompt → Código → Revisión → Feedback → Código corregido
```

Cada ciclo es más rápido que el anterior. La IA aprende de tu feedback dentro de la misma conversación.

---

## 🛠️ Práctica — API REST de tareas

Vas a construir una API REST para un gestor de tareas usando solo prompts. El objetivo no es la API — es **aprender a especificar**.

### Setup

```bash
mkdir -p projects/level-02-prompts/tasks-api
cd projects/level-02-prompts/tasks-api
npm init -y
npm install express
```

### Paso 1: El primer prompt — vago a propósito

Empezá mal, a propósito. Escribí:

> "Hacé una API REST con Express."

Generá el código, revisalo, y fijate qué decisiones tomó la IA por vos. ¿Qué base de datos eligió? ¿Qué recursos modeló? ¿Cómo maneja errores?

Anotá todo lo que **no te gusta** o **no esperabas**. Esa lista es tu checklist para el paso 2.

### Paso 2: Especificá las 4 dimensiones

Ahora escribí un prompt que cubra contexto, output, formato y restricciones:

> "Estoy en un proyecto Node.js con Express (ya instalado). Necesito una API REST para un gestor de tareas con estos endpoints:
>
> - GET /tasks — lista todas las tareas
> - GET /tasks/:id — obtiene una tarea por ID
> - POST /tasks — crea una tarea (campos: title obligatorio, done opcional con default false)
> - PUT /tasks/:id — actualiza una tarea
> - DELETE /tasks/:id — elimina una tarea
>
> Usá un array en memoria como base de datos. Validá que title sea string no vacío en POST y PUT. Devolvé errores como { error: string } con el status code HTTP correspondiente (400 para validación, 404 si no existe, 500 para error interno). Generalo como un solo archivo index.js con los endpoints en orden REST convencional."

Compará el resultado con el del paso 1. La diferencia en calidad y predictibilidad es el argumento más fuerte para escribir prompts estructurados.

### Paso 3: Agregá un middleware con few-shot

Ahora necesitás logging de cada request. En vez de describir cómo funciona un middleware, mostrale el patrón:

> "Necesito un middleware similar a este, pero que logee method, url, y response time en milisegundos:
> ```js
> app.use((req, res, next) => {
>   console.log(`${req.method} ${req.url}`);
>   next();
> });
> ```"

### Paso 4: Chain of thought para features complejas

Pedile que agregue paginación. Pero antes de escribir código, que razone:

> "Pensá paso a paso cómo implementar paginación en GET /tasks. Considerá: cómo pasar page y limit, cómo calcular el offset, qué devolver además de los datos (total, page, totalPages). Después de pensar, generá el código."

### Paso 5: Refactor con feedback

Ahora pedile un cambio más grande:

> "Refactorizá el código para separar las rutas en un archivo routes/tasks.js y la lógica de negocio en services/tasksService.js. Mantené la misma funcionalidad."

Este paso prueba si el código generado es mantenible. Si la IA no puede refactorizarlo limpiamente, el prompt original tenía problemas de estructura.

### Criterios de completitud

- [ ] La API corre con `node index.js` y responde a requests
- [ ] Probaste cada endpoint con curl, httpie, o Postman
- [ ] Los errores de validación devuelven 400 con mensaje claro
- [ ] Los IDs inexistentes devuelven 404
- [ ] Agregaste un middleware de logging
- [ ] Agregaste paginación a GET /tasks
- [ ] Refactorizaste a múltiples archivos
- [ ] Le pediste a la IA que explique al menos una decisión de diseño

---

## 📣 LinkedIn — Post para publicar

---

**Lo que aprendí cuando dejé de pedirle "hacé una API" a la IA 🧠**

Nivel 2 del AI Engineering Bootcamp: Prompts que funcionan.

El mayor aprendizaje: **la calidad del código generado depende casi linealmente de la calidad del prompt.**

Lo que cambié:
- Antes: "Hacé una API REST" → código impredecible
- Ahora: contexto + output + formato + restricciones → código que puedo mantener

Bonus: el few-shot prompting (dar un ejemplo en vez de describir) me ahorró párrafos enteros de explicación.

Próximo nivel: workflows con IA — CLI tools + code review automatizado.

#AIEngineering #PromptEngineering #AIAssistedDevelopment #NodeJS #ExpressJS

---

## Self-review

Antes de pasar al Nivel 3, respondé:

- [ ] ¿Entendés las 4 dimensiones de un prompt efectivo?
- [ ] ¿Probaste la diferencia entre un prompt vago y uno estructurado?
- [ ] ¿Usaste few-shot para enseñarle un patrón a la IA?
- [ ] ¿Le pediste chain of thought para un problema complejo?
- [ ] ¿El código generado resistió un refactor a múltiples archivos?

→ Si respondiste "sí" a todo, avanzá al **Nivel 3**.
