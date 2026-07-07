# Extract function

## Cuándo usarlo
Cuando tienes una función larga o un bloque de código que hace demasiadas cosas y necesitas extraerlo en funciones más pequeñas y reutilizables.

## Prompt
```
Refactoriza el siguiente código extrayendo funciones más pequeñas y con responsabilidad única.

Código a refactorizar:
```
{{ORIGINAL_CODE}}
```

Requisitos:
- Identifica bloques lógicos que puedan ser funciones independientes
- Cada función extraída debe tener un nombre descriptivo que indique QUÉ hace, no CÓMO
- Las funciones extraídas deben ser puras cuando sea posible (mismos inputs → mismos outputs, sin side effects)
- Mantén el mismo comportamiento externo — el refactor no debe cambiar la funcionalidad
- Lenguaje: {{LANGUAGE}}
- Nombres de funciones en {{NAMING_CONVENTION}} (camelCase / snake_case)

Contexto del proyecto:
{{PROJECT_CONTEXT}}
```

## Ejemplo de uso
**Input:**
- `{{ORIGINAL_CODE}}` = función `processOrder` de 80 líneas que valida stock, calcula total con descuentos e impuestos, actualiza inventario, crea registro de envío y envía email de confirmación
- `{{LANGUAGE}}` = TypeScript
- `{{NAMING_CONVENTION}}` = camelCase
- `{{PROJECT_CONTEXT}}` = E-commerce API, Node.js + TypeScript

**Output esperado:**
- `validateStock(order)` — verifica disponibilidad, lanza error si no hay stock
- `calculateOrderTotal(items, discountCode)` — aplica descuentos e impuestos, retorna total
- `updateInventory(items)` — descuenta stock de cada producto
- `createShipment(order)` — crea registro de envío
- `sendConfirmationEmail(order, total)` — envía email
- `processOrder` queda como función orquestadora de ~10 líneas que llama a las anteriores en secuencia
- Cada función extraída tiene su propio test unitario

## Notas
- Regla general: si necesitas un comentario para explicar qué hace un bloque de código, ese bloque debería ser una función
- Funciones de más de 20-30 líneas suelen ser candidatas a extracción
- No extraigas por extraer — si un bloque de 3 líneas es claro y no se reutiliza, déjalo inline
- Después de extraer, verifica que los nombres de las funciones cuenten una historia al leerse en orden
