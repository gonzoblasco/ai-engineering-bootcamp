# Prompt Library

Colección organizada de prompts categorizados y reutilizables para GitHub Copilot. Cada prompt sigue un formato estandarizado con placeholders `{{LIKE_THIS}}` y ejemplos de uso.

## Categorías

### 🔧 Backend (4 prompts)

| Prompt | Cuándo usarlo |
|---|---|
| [create-api-endpoint](./backend/create-api-endpoint.md) | Crear un endpoint REST completo (ruta, controller, validación, test) |
| [create-middleware](./backend/create-middleware.md) | Crear middleware de Express (auth, logging, rate limiting) |
| [database-schema-design](./backend/database-schema-design.md) | Diseñar o modificar un schema de Prisma |
| [error-handling-pattern](./backend/error-handling-pattern.md) | Implementar manejo de errores centralizado en Express |

### 🎨 Frontend (3 prompts)

| Prompt | Cuándo usarlo |
|---|---|
| [create-react-component](./frontend/create-react-component.md) | Crear componente React con TypeScript, props, hooks y test |
| [responsive-layout](./frontend/responsive-layout.md) | Crear layout responsive con CSS Grid o Flexbox |
| [form-validation](./frontend/form-validation.md) | Crear formulario con validación client-side y accesibilidad |

### 🧪 Testing (3 prompts)

| Prompt | Cuándo usarlo |
|---|---|
| [unit-test-template](./testing/unit-test-template.md) | Generar tests unitarios para funciones o módulos |
| [integration-test-template](./testing/integration-test-template.md) | Generar tests de integración con BD real |
| [e2e-test-template](./testing/e2e-test-template.md) | Generar tests end-to-end con Playwright o Cypress |

### ♻️ Refactoring (3 prompts)

| Prompt | Cuándo usarlo |
|---|---|
| [extract-function](./refactoring/extract-function.md) | Extraer funciones pequeñas de código largo o complejo |
| [apply-design-pattern](./refactoring/apply-design-pattern.md) | Aplicar patrón de diseño (Strategy, Factory, Observer) |
| [simplify-logic](./refactoring/simplify-logic.md) | Simplificar lógica compleja, condiciones anidadas, booleanos |

### 🔒 Security (3 prompts)

| Prompt | Cuándo usarlo |
|---|---|
| [security-audit](./security/security-audit.md) | Auditar proyecto en busca de vulnerabilidades OWASP |
| [input-validation-review](./security/input-validation-review.md) | Revisar y fortalecer validación de inputs |
| [dependency-check](./security/dependency-check.md) | Auditar dependencias (vulnerabilidades, licencias, mantenimiento) |

---

## Formato

Cada prompt sigue esta estructura:

```markdown
# [Nombre descriptivo]

## Cuándo usarlo
[Escenario concreto]

## Prompt
[Prompt con placeholders {{LIKE_THIS}}]

## Ejemplo de uso
[Input concreto → Output esperado]

## Notas
[Consideraciones y limitaciones]
```

## Cómo usar un prompt

1. Navega a la categoría que necesites
2. Lee "Cuándo usarlo" para confirmar que es el prompt correcto
3. Copia el bloque de "Prompt"
4. Reemplaza los placeholders `{{LIKE_THIS}}` con tus valores
5. Pega el prompt en Copilot Chat

## Stats

- **16 prompts** en 5 categorías
- **Formato:** Markdown con placeholders `{{UPPER_SNAKE_CASE}}`
- **Cada prompt incluye:** escenario, prompt template, ejemplo de uso, notas
