# Simplify logic

## Cuándo usarlo
Cuando tienes código con lógica compleja, condiciones anidadas, booleanos confusos o expresiones difíciles de leer. El objetivo es hacer el código más legible sin cambiar su comportamiento.

## Prompt
```
Simplifica la lógica del siguiente código haciéndolo más legible y mantenible.

Código a simplificar:
```
{{ORIGINAL_CODE}}
```

Requisitos:
- Elimina condiciones anidadas usando early returns
- Reemplaza booleanos complejos por variables con nombres descriptivos
- Usa guard clauses para validaciones al inicio
- Simplifica expresiones booleanas (leyes de De Morgan, elimina dobles negaciones)
- Reemplaza if/else encadenados por switch, objeto de lookup o polimorfismo según corresponda
- Lenguaje: {{LANGUAGE}}

Contexto del proyecto:
{{PROJECT_CONTEXT}}
```

## Ejemplo de uso
**Input:**
- `{{ORIGINAL_CODE}}` = función `getUserDiscount` con 5 niveles de if/else anidados que determina el descuento según tipo de usuario, antigüedad, total de compras, si tiene cupón y si es temporada de rebajas
- `{{LANGUAGE}}` = TypeScript
- `{{PROJECT_CONTEXT}}` = E-commerce API

**Output esperado:**
- Early returns para casos base: si no hay usuario → 0%, si es admin → 100%
- Variables descriptivas: `isPremiumUser`, `isLongTermCustomer`, `hasValidCoupon`, `isSaleSeason`
- Lógica plana (sin anidamiento) combinando condiciones con `&&` y `||`
- Si la lógica sigue siendo compleja, extraer a función `calculateLoyaltyDiscount` y `calculateSeasonalDiscount`
- Resultado: función de ~15 líneas vs las ~50 originales, legible de un vistazo

## Notas
- Early return es la técnica más efectiva para eliminar anidamiento: `if (!valid) return` al inicio
- Nombra las condiciones intermedias: `const isEligible = user.age >= 18 && user.verified` en lugar de usar la expresión inline
- Si un if/else tiene más de 3 ramas, considera un objeto de lookup: `const discounts = { premium: 0.2, gold: 0.15, silver: 0.1 }`
- No sacrifiques claridad por brevedad — a veces un if/else explícito es más claro que un ternario anidado
