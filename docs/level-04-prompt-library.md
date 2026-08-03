# Nivel 4 — Prompt Library 🟢

> **Meta:** Dejar de escribir prompts desde cero. Construir un sistema de templates reutilizables, parametrizables y versionados.
>
> **Dificultad:** Intermedio | **Proyecto:** 4 | **Tiempo estimado:** 90-120 minutos

---

## 🧠 Teoría — Por qué una prompt library cambia el juego

### El problema de los prompts descartables

Cada vez que abrís un chat con la IA, escribís prompts desde cero. Si sos meticuloso, son buenos prompts. Pero el esfuerzo de escribirlos **no persiste** — la próxima vez que necesites un code review, volvés a escribir "Sos un code reviewer senior...".

Eso es trabajo perdido. Y peor: cada vez que reescribís, el prompt es **ligeramente diferente**, lo que produce resultados inconsistentes.

### Templates con variables

Un template es un prompt con partes variables:

```
Eres un revisor de código especializado en {{language}}.
Analiza el siguiente archivo ({{fileName}}) y genera un reporte con:
- Problemas de seguridad
- Problemas de performance
- Problemas de legibilidad
- Sugerencias de mejora

Código:
{{code}}
```

Las variables (`{{language}}`, `{{fileName}}`, `{{code}}`) se reemplazan en el momento de uso. El template es el mismo siempre; los valores cambian.

### Composición de prompts

Los prompts no deberían ser monolíticos. Un prompt de "code review" puede estar compuesto por:

```
role-definition.prompt.md  → "Sos un revisor senior especializado en X"
rules.prompt.md            → "Siempre respondé en markdown con tabla"
code-review.prompt.md      → → incluye los dos anteriores + instrucción específica
```

Esto permite:
- Reutilizar el role definition en múltiples prompts
- Cambiar las reglas de formato en un solo lugar
- Versionar cada componente por separado

### Testing de prompts

¿Cómo sabés si un prompt es bueno? No es subjetivo — se puede medir:

- **Consistencia:** el mismo input produce el mismo output (o similar)
- **Completitud:** cubre todos los casos que debería cubrir
- **Robustez:** funciona con inputs inesperados (código vacío, errores, archivos enormes)

Un sistema de prompt library debería permitirte versionar prompts y comparar resultados entre versiones.

---

## 🛠️ Práctica — Sistema de Prompt Library

Vas a construir un sistema que almacene, renderice y gestione prompts como templates reutilizables.

### Setup

```bash
mkdir -p projects/level-04-prompt-library/prompt-library/{prompts,examples}
cd projects/level-04-prompt-library/prompt-library
npm init -y
```

### Paso 1: La estructura de templates

Creá una carpeta `prompts/` con esta estructura:

```
prompts/
├── roles/
│   ├── code-reviewer.prompt.md
│   └── api-designer.prompt.md
├── rules/
│   ├── markdown-format.prompt.md
│   └── no-hallucinations.prompt.md
└── workflows/
    ├── review-code.prompt.md
    └── generate-api.prompt.md
```

Cada archivo es un template con variables `{{variable}}`.

Prompt para generar los templates iniciales:

> "Creame 5 templates de prompt en markdown para una prompt library. Cada template usa variables {{variable}} para parametrización. Los templates son:
>
> 1. `roles/code-reviewer.prompt.md` — define el rol de revisor senior de Node.js
> 2. `rules/markdown-format.prompt.md` — reglas de formato de respuesta en markdown
> 3. `rules/no-hallucinations.prompt.md` — instrucción para no inventar APIs que no existen
> 4. `workflows/review-code.prompt.md` — compone el rol + reglas + instrucción de review. Debe incluir {{fileName}} y {{code}} como variables.
> 5. `workflows/generate-api.prompt.md` — compone rol de API designer + reglas + instrucción de generación. Debe incluir {{endpoints}} y {{stack}} como variables.
>
> Cada template debe ser concreto y usable. Nada de "sos un asistente útil" — esto es para producción."

### Paso 2: El motor de renderizado

Construí un script que lea templates, reemplace variables, y soporte composición (un template puede incluir a otro con `{{include:ruta}}`).

Prompt:

> "Creá un script render.js que:
> - Lea un template markdown desde la carpeta prompts/
> - Reemplace variables {{variable}} con valores pasados como objeto
> - Soporte composición: si encuentra {{include:roles/code-reviewer}} lo reemplaza con el contenido de ese template
> - Soporte includes anidados (un include dentro de otro include)
> - Lance error si falta una variable requerida
> - Lance error si hay includes circulares
> - Use solo módulos nativos de Node.js (fs, path)
>
> Ejemplo de uso:
> ```js
> const render = require('./render');
> const prompt = render('workflows/review-code', {
>   fileName: 'routes/tasks.js',
>   code: '...',
> });
> ```"

### Paso 3: El CLI

Creá un CLI que permita:

- `prompt-library list` — lista todos los templates disponibles
- `prompt-library list --category workflows` — filtra por categoría
- `prompt-library show review-code` — muestra el template renderizado (con includes resueltos pero variables como {{placeholder}})
- `prompt-library render review-code --var fileName=index.js --var code="..."` — renderiza y muestra el prompt listo para copiar
- `prompt-library render review-code --var fileName=index.js --var code="..." --copy` — copia al clipboard

Prompt:

> "Creá un CLI prompt-library.js que use el motor de render.js del paso anterior. Debe soportar los comandos list, show, y render con las opciones descritas. Usá shebang y agregá bin al package.json como 'prompt-library'."

### Paso 4: Probá el sistema

Renderizá el template de code review contra el código del nivel 2:

```bash
node prompt-library.js render workflows/review-code \
  --var fileName=routes/tasks.js \
  --var code="$(cat ../level-02-prompts/tasks-api/routes/tasks.js)"
```

¿El prompt resultante es coherente? ¿Los includes se resolvieron bien? ¿Falta alguna variable?

### Paso 5: Agregá un template nuevo

Creá un template para generar tests:

```
workflows/generate-tests.prompt.md
```

Que incluya `roles/code-reviewer` (porque para escribir tests hay que entender el código) y agregue instrucciones específicas para generar tests con Jest.

### Criterios de completitud

- [ ] La carpeta prompts/ tiene al menos 5 templates en 3 categorías
- [ ] El motor de renderizado soporta variables, includes, includes anidados, y detección de errores
- [ ] El CLI tiene los comandos list, show, y render funcionando
- [ ] Probaste renderizar al menos 2 templates diferentes
- [ ] Agregaste un template nuevo (generate-tests)
- [ ] El sistema está publicado como bin en package.json

---

## 📣 LinkedIn — Post para publicar

---

**Dejé de escribir prompts desde cero y empecé a versionarlos 📦**

Nivel 4 del AI Engineering Bootcamp: Prompt Library.

Construí un sistema de templates reutilizables con:
- Variables parametrizables ({{fileName}}, {{code}})
- Composición de prompts (roles + reglas + workflows)
- CLI para listar, mostrar y renderizar
- Detección de errores (variables faltantes, includes circulares)

Ahora mi code review prompt es el mismo siempre. Y si lo mejoro, todos los reviews futuros mejoran automáticamente.

Próximo nivel: Seguridad y auditoría con IA.

#AIEngineering #PromptEngineering #DeveloperTools #NodeJS #BestPractices

---

## Self-review

Antes de pasar al Nivel 5, respondé:

- [ ] ¿Entendés por qué los prompts descartables son trabajo perdido?
- [ ] ¿Construiste un motor de renderizado con composición?
- [ ] ¿El CLI es usable y cubre list, show, render?
- [ ] ¿Probaste includes anidados y detección de errores?
- [ ] ¿Agregaste al menos un template propio?

→ Si respondiste "sí" a todo, avanzá al **Nivel 5**.
