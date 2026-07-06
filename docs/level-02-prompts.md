# Nivel 2 — Prompts que funcionan 🟢

> **Objetivo:** Aprender prompt engineering aplicado a código. La base de TODO el puesto.
>
> **Dificultad:** Principiante-Intermedio | **Proyectos:** 2 | **Tiempo estimado:** 3-4 horas

## Skills que ganarás

- [ ] Prompt estructurado (rol + contexto + tarea + restricciones)
- [ ] Few-shot prompting (dar ejemplos)
- [ ] Chain-of-thought para código
- [ ] Pedir explicaciones paso a paso
- [ ] Referenciar archivos con `#file`

---

## Proyecto 1: API REST de To-Do list (Node.js + Express)

**Descripción:** Construye una API REST completa usando SOLO prompts. Sin escribir código manualmente.

### Prompt inicial sugerido

```
Actúa como un ingeniero senior de Node.js.
Crea una API REST para un To-Do list con Express.js.

Requisitos:
- Endpoints: GET /tasks, GET /tasks/:id, POST /tasks, PUT /tasks/:id, DELETE /tasks/:id
- Validación de input con express-validator
- Manejo de errores centralizado con middleware
- Estructura: routes/, controllers/, models/, middleware/
- Usa ES modules (import/export)
- Incluye un archivo .env para configuración
- Código production-ready con comentarios explicativos

Genera todos los archivos necesarios.
```

### Pasos

1. Usa el prompt anterior en Copilot Chat con `@workspace`
2. Crea los archivos según las sugerencias
3. Instala dependencias y ejecuta
4. Pide tests: *"Genera tests con Jest para cada endpoint"*
5. Pide mejoras: *"Añade paginación y filtering al GET /tasks"*

### Criterios de completitud

- [ ] API funciona con todos los endpoints
- [ ] Validación de input implementada
- [ ] Manejo de errores centralizado
- [ ] Tests con Jest pasando
- [ ] Documentaste qué prompts usaste

---

## Proyecto 2: Refactor de código legacy

**Descripción:** Toma un proyecto intencionalmente mal escrito y refactóralo con Copilot.

### Pasos

1. Crea un archivo `legacy.js` con código feo (te lo proveeré en el nivel)
2. Pídele a Copilot: *"Analiza este código y explica los problemas que ves"*
3. Luego: *"Refactoriza aplicando SOLID, clean code, y patrones apropiados. Explica cada cambio"*
4. Pide: *"Genera tests para el código refactorizado"*
5. Compara antes y después

### Criterios de completitud

- [ ] Copilot identificó los problemas del código original
- [ ] Refactor aplicó principios SOLID
- [ ] Tests cubren el código refactorizado
- [ ] Documentaste el proceso de refactor como un "recipe"

---

## Self-review

- ¿Estructuras tus prompts con rol, contexto, tarea y restricciones?
- ¿Das ejemplos cuando necesitas un formato específico?
- ¿Pides explicaciones antes de aceptar código?

→ Si respondiste "sí" a todo, avanza al **Nivel 3**.