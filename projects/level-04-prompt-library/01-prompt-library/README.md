# Proyecto 4.1 — Prompt library (repo Git)

> **Nivel:** 4 — Plantillas y automatización 🟡
> **Dificultad:** Intermedio
> **Instrucciones:** [`TASK.md`](./TASK.md) · **Docs del nivel:** [level-04-prompt-library.md](../../../docs/level-04-prompt-library.md)

## 📌 Estado

✅ **Completado**

## 📝 Descripción

Colección organizada de 16 prompts categorizados y reutilizables para GitHub Copilot. Cada prompt sigue un formato estandarizado con placeholders `{{UPPER_SNAKE_CASE}}`, escenario de uso, ejemplo concreto y notas. Cubre las 5 categorías principales del desarrollo full-stack: backend, frontend, testing, refactoring y security.

## 🛠️ Stack

- **Formato:** Markdown
- **Placeholders:** `{{UPPER_SNAKE_CASE}}`
- **Control de versiones:** Git

## 🚀 Cómo usarlo

1. Navega a [`prompts/`](./prompts/) y elige una categoría
2. Abre el prompt que necesites
3. Copia el bloque de "Prompt"
4. Reemplaza los placeholders con tus valores
5. Pega en Copilot Chat

No requiere instalación ni dependencias — son archivos Markdown.

## ✨ Features

- [x] 16 prompts en 5 categorías
- [x] Formato estandarizado (escenario, prompt, ejemplo, notas)
- [x] Placeholders reutilizables `{{LIKE_THIS}}`
- [x] Cada prompt incluye ejemplo de uso con input y output esperado
- [x] README índice con tabla navegable por categoría
- [x] Notas con consideraciones, limitaciones y prerrequisitos

## 📂 Estructura

```
prompts/
├── README.md                          # Índice navegable
├── backend/
│   ├── create-api-endpoint.md         # Endpoint REST completo
│   ├── create-middleware.md           # Middleware Express
│   ├── database-schema-design.md      # Schema Prisma
│   └── error-handling-pattern.md      # Manejo de errores centralizado
├── frontend/
│   ├── create-react-component.md      # Componente React + TypeScript
│   ├── responsive-layout.md           # Layout responsive
│   └── form-validation.md            # Formulario con validación
├── testing/
│   ├── unit-test-template.md          # Tests unitarios
│   ├── integration-test-template.md   # Tests de integración
│   └── e2e-test-template.md           # Tests end-to-end
├── refactoring/
│   ├── extract-function.md            # Extraer funciones
│   ├── apply-design-pattern.md        # Aplicar patrón de diseño
│   └── simplify-logic.md             # Simplificar lógica
└── security/
    ├── security-audit.md              # Auditoría de seguridad
    ├── input-validation-review.md     # Validación de inputs
    └── dependency-check.md            # Auditoría de dependencias
```

## ✅ Criterios de completitud

- [x] Al menos 15 prompts categorizados (16 implementados)
- [x] Formato estandarizado
- [x] Cada prompt tiene ejemplo de uso
- [x] README con índice