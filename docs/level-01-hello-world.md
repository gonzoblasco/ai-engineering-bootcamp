# Nivel 1 — Hello World con IA 🟢

> **Meta:** Tu primera app generada con IA. Sin experiencia previa necesaria.
>
> **Dificultad:** Principiante | **Proyecto:** 1 | **Tiempo estimado:** 30-60 minutos

---

## 🧠 Teoría — ¿Qué está pasando cuando la IA "escribe código"?

### No es magia, es probabilidad

Cuando le pedís a una IA que genere código, lo que realmente está haciendo es **predecir la siguiente palabra** (o token) más probable dado el contexto. No "piensa" como un programador — reconoce patrones de millones de repositorios y completa lo que estadísticamente debería ir después.

Esto tiene implicaciones importantes:

- **La IA es excelente para código común** — CRUDs, APIs REST, componentes UI. Son patrones que aparecen millones de veces en el training data.
- **La IA es mala para código original** — algoritmos nuevos, arquitecturas innovadoras, edge cases raros. Ahí tenés que pensar vos.
- **La IA alucina** — inventa APIs que no existen, funciones que no hacen lo que dice la doc, imports equivocados. Siempre hay que verificar.

### Prompt vs Autocomplete

Dos formas de interactuar con la IA:

| | Autocomplete | Chat/Prompt |
|---|---|---|
| **Cómo funciona** | Escribís y la IA completa | Le escribís una instrucción |
| **Cuándo usarlo** | Código boilerplate, patrones conocidos | Funcionalidades nuevas, refactors, preguntas |
| **Riesgo** | Aceptás sin pensar | Podés iterar y corregir |
| **Control** | Bajo | Alto |

**Regla de oro:** el autocomplete es para velocidad, el prompt es para precisión. Si no sabés exactamente qué va a generar, usá prompt.

### El ciclo virtuoso

```
Pensá → Prompt → Revisá → Iterá
```

1. **Pensá** — ¿qué querés que haga? Tenelo claro antes de escribir.
2. **Prompt** — escribí la instrucción lo más específica posible.
3. **Revisá** — leé el código generado. ¿Entendés cada línea? ¿Hay algo raro?
4. **Iterá** — pedí cambios, correcciones, mejoras.

Este ciclo es lo único que realmente importa. El tool (Copilot, Claude, Codex) es secundario.

---

## 🛠️ Práctica — Tu primera landing page

Vas a crear una landing page personal usando solo prompts de IA. El objetivo no es la página — es **aprender a pedir**.

### Setup

1. Abrí tu editor (VS Code, Cursor, el que uses)
2. Creá una carpeta: `projects/level-01-hello-world/landing-page/`
3. Abrí el chat de tu IA (Copilot Chat, Claude, etc.)

### Paso 1: El primer prompt

Escribí este prompt en el chat:

> "Create a personal landing page with HTML, CSS, and vanilla JavaScript. Include a hero section with my name and tagline, an about section, a projects section with 3 cards, and a contact form. Make it responsive."

**¿Por qué este prompt funciona?**
- Especifica el lenguaje (HTML, CSS, JS)
- Describe las secciones (hero, about, projects, contact)
- Pide responsive (una restricción concreta)
- No asume conocimiento del tool

### Paso 2: Revisá lo que generó

Antes de aceptar, preguntate:
- ¿Entiendo qué hace cada sección?
- ¿Los nombres de clases tienen sentido?
- ¿Hay algo que no pedí y apareció?

Si algo no te gusta, **iterá**. Por ejemplo:

> "Make the hero section full-screen with a gradient background. Use a modern font from Google Fonts."

### Paso 3: Pedí una explicación

Este es el paso más importante del nivel. Pedile a la IA:

> "Explain the CSS layout you used. Why did you choose flexbox over grid for the projects section?"

**¿Por qué?** Porque si no entendés lo que generó, no podés mantenerlo, debuggearlo, ni mejorarlo. La IA no reemplaza tu criterio — lo aumenta.

### Paso 4: Abrí en el navegador

Guardá los archivos y abrí `index.html` en tu browser. ¿Se ve bien? ¿Es responsive? ¿El formulario hace algo?

### Criterios de completitud

- [ ] La página se ve en el browser
- [ ] Es responsive (probá redimensionando la ventana)
- [ ] Usaste al menos 3 prompts diferentes para iterar
- [ ] Le pediste una explicación de algún fragmento de código
- [ ] Entendés cada línea del HTML/CSS/JS que generaste

---

## 📣 LinkedIn — Post para publicar

Cuando termines el nivel, publicá algo como esto:

---

**Mi primera app con IA en 30 minutos 🚀**

Arranqué el AI Engineering Bootcamp — 10 niveles para aprender desarrollo asistido por IA de forma estructurada.

Nivel 1: una landing page personal generada con IA.

Lo que aprendí:
- La IA no "piensa código", predice patrones. Hay que revisar siempre.
- El prompt correcto es más importante que el tool que uses.
- Pedir explicaciones del código generado es el paso que más enseña.

Próximo nivel: APIs REST con prompts avanzados.

¿Usás IA para codificar? ¿Cuál fue tu mayor aprendizaje?

#AIEngineering #AIAssistedDevelopment #CodingWithAI #Bootcamp

---

## Self-review

Antes de pasar al Nivel 2, respondé:

- [ ] ¿Entendés la diferencia entre autocomplete y prompt?
- [ ] ¿Sabés por qué la IA a veces genera código incorrecto?
- [ ] ¿Podés iterar sobre código generado sin empezar de cero?
- [ ] ¿Le pediste una explicación a la IA de algo que no entendías?

→ Si respondiste "sí" a todo, avanzá al **Nivel 2**.
