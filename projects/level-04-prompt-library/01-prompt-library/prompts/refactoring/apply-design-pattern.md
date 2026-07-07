# Apply design pattern

## Cuándo usarlo
Cuando tienes código que se beneficiaría de un patrón de diseño conocido (Strategy, Factory, Observer, Repository, etc.) para mejorar mantenibilidad y extensibilidad.

## Prompt
```
Refactoriza el siguiente código aplicando el patrón {{DESIGN_PATTERN}}.

Código a refactorizar:
```
{{ORIGINAL_CODE}}
```

Requisitos:
- Aplica el patrón {{DESIGN_PATTERN}} de forma idiomática en {{LANGUAGE}}
- Explica por qué este patrón es adecuado para este caso
- El refactor debe mantener el mismo comportamiento externo
- Si el patrón introduce nuevas interfaces o clases, documéntalas
- Incluye un ejemplo de cómo extender el código con el nuevo patrón (ej: añadir una nueva estrategia)

Contexto del proyecto:
{{PROJECT_CONTEXT}}
```

## Ejemplo de uso
**Input:**
- `{{DESIGN_PATTERN}}` = Strategy
- `{{ORIGINAL_CODE}}` = función `calculateShipping` con un switch de 6 casos (standard, express, overnight, pickup, international, free) que calcula el costo de envío según el método
- `{{LANGUAGE}}` = TypeScript
- `{{PROJECT_CONTEXT}}` = E-commerce API, Node.js + TypeScript

**Output esperado:**
- `src/shipping/ShippingStrategy.ts` — interfaz con método `calculate(order: Order): number`
- `src/shipping/StandardShipping.ts`, `ExpressShipping.ts`, etc. — una clase por estrategia
- `src/shipping/ShippingCalculator.ts` — contexto que recibe una estrategia y delega el cálculo
- `src/shipping/ShippingStrategyFactory.ts` — factory que devuelve la estrategia según el método
- El switch de 6 casos desaparece, reemplazado por `factory.getStrategy(method).calculate(order)`
- Ejemplo de extensión: añadir `SameDayShipping` solo requiere crear la clase y registrarla en la factory

## Notas
- No todo necesita un patrón de diseño — si el código es simple y no va a cambiar, un switch puede ser suficiente
- Los patrones añaden indirección y abstracción — asegúrate de que el beneficio justifique la complejidad
- Patrones comunes en Node.js/Express: Repository (acceso a datos), Middleware (pipeline), Observer (eventos), Strategy (algoritmos intercambiables)
- Si el patrón requiere muchas clases nuevas, considera si el lenguaje soporta alternativas más ligeras (ej: funciones en lugar de clases Strategy en JS/TS)
