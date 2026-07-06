# Nivel 4 — Plantillas y automatización 🟡

> **Objetivo:** Construir una prompt library reutilizable. Otro requisito directo del puesto.
>
> **Dificultad:** Intermedio | **Proyectos:** 3 | **Tiempo estimado:** 4-6 horas

## Skills que ganarás

- [ ] Crear `.github/copilot-instructions.md` (equivalente a `.cursorrules`)
- [ ] Diseñar prompt templates categorizados
- [ ] Definir custom instructions a nivel proyecto
- [ ] Crear custom Skills/Agents en VS Code

---

## Proyecto 1: Prompt library (repo Git)

**Descripción:** Colección organizada de prompts categorizados y reutilizables.

### Estructura

```
prompts/
├── backend/
│   ├── create-api-endpoint.md
│   ├── create-middleware.md
│   ├── database-schema-design.md
│   └── error-handling-pattern.md
├── frontend/
│   ├── create-react-component.md
│   ├── responsive-layout.md
│   └── form-validation.md
├── testing/
│   ├── unit-test-template.md
│   ├── integration-test-template.md
│   └── e2e-test-template.md
├── refactoring/
│   ├── extract-function.md
│   ├── apply-design-pattern.md
│   └── simplify-logic.md
├── security/
│   ├── security-audit.md
│   ├── input-validation-review.md
│   └── dependency-check.md
└── README.md
```

### Formato de cada prompt

```markdown
# [Nombre del prompt]

## Categoría
[backend/frontend/testing/refactoring/security]

## Cuándo usarlo
[Descripción del escenario]

## Prompt
\```
[El prompt con placeholders {{LIKE_THIS}}]
\```

## Ejemplo de uso
[Input de ejemplo → Output esperado]

## Notas
[Consideraciones, limitaciones]
```

### Criterios de completitud

- [ ] Al menos 15 prompts categorizados
- [ ] Formato estandarizado
- [ ] Cada prompt tiene ejemplo de uso
- [ ] README con índice

---

## Proyecto 2: `.github/copilot-instructions.md`

**Descripción:** Crea reglas de proyecto que hagan que Copilot genere código con tus convenciones.

### Contenido a incluir

- Stack tecnológico (Node.js, Express, TypeScript, Jest, etc.)
- Convenciones de naming (camelCase, PascalCase)
- Estructura de carpetas obligatoria
- Patrones a seguir (Repository pattern, Dependency Injection)
- Patrones a evitar
- Reglas de seguridad (no `eval`, no `innerHTML`, sanitizar inputs)
- Reglas de testing (cobertura mínima, qué testear)
- Formato de commits

### Criterios de completitud

- [ ] Archivo `.github/copilot-instructions.md` creado
- [ ] Copilot genera código siguiendo las convenciones
- [ ] Probaste que las reglas funcionan con 3 prompts diferentes

---

## Proyecto 3: Custom Skills/Agents

**Descripción:** Define agentes personalizados en VS Code para tareas repetitivas.

### Agentes a crear

1. **Code Reviewer** — Revisa código buscando bugs, security issues, y mejoras
2. **Test Generator** — Genera tests a partir de un archivo de código
3. **Doc Writer** — Genera JSDoc/README a partir del código

### Pasos

1. Crea archivos `.instructions.md` o usa el skill system de VS Code
2. Define el rol, instrucciones, y restricciones de cada agente
3. Prueba cada agente con código real
4. Documenta cómo invocarlos

### Criterios de completitud

- [ ] 3 agentes personalizados definidos
- [ ] Cada agente funciona como se espera
- [ ] Documentación de uso creada

---

## Self-review

- ¿Tu prompt library cubre los escenarios más comunes?
- ¿Las custom instructions cambian el comportamiento de Copilot de forma notoria?
- ¿Los agentes personalizados ahorran tiempo real?

→ Si respondiste "sí" a todo, avanza al **Nivel 5**.