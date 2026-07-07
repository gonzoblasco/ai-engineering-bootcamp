# Unit test template

## Cuándo usarlo
Cuando necesitas generar tests unitarios para una función, clase o módulo. Cubre casos felices, edge cases, errores y mocks.

## Prompt
```
Genera tests unitarios para {{TARGET_MODULE}}.

Requisitos:
- Framework: {{TEST_FRAMEWORK}} (Jest / Vitest / Mocha)
- Lenguaje: {{LANGUAGE}} (TypeScript / JavaScript)
- Cobertura mínima: {{MIN_COVERAGE}}%
- Casos a cubrir:
  - Happy path: {{HAPPY_PATH_CASES}}
  - Edge cases: {{EDGE_CASES}}
  - Error handling: {{ERROR_CASES}}
- Mocks necesarios: {{MOCKS_NEEDED}}
- Usa {{ASSERTION_STYLE}} (expect / assert / should)

Contexto del proyecto:
{{PROJECT_CONTEXT}}
```

## Ejemplo de uso
**Input:**
- `{{TARGET_MODULE}}` = src/services/userService.ts (función createUser)
- `{{TEST_FRAMEWORK}}` = Jest
- `{{LANGUAGE}}` = TypeScript
- `{{MIN_COVERAGE}}` = 80
- `{{HAPPY_PATH_CASES}}` = crear usuario con datos válidos, retorna User con id y timestamps
- `{{EDGE_CASES}}` = email duplicado, name vacío, email sin @, password muy corto
- `{{ERROR_CASES}}` = error de BD (simulado con mock), error de validación
- `{{MOCKS_NEEDED}}` = Prisma client (user.create, user.findUnique), bcrypt (hash)
- `{{ASSERTION_STYLE}}` = expect
- `{{PROJECT_CONTEXT}}` = Express + TypeScript + Prisma + Jest con ts-jest

**Output esperado:**
- `tests/services/userService.test.ts` — describe/createUser con 8-10 tests
- Mock de PrismaClient con `jest.mock('@prisma/client')`
- Tests: crea usuario correctamente, lanza error si email duplicado, lanza error si falta name, lanza ValidationError si email inválido, lanza error si falla BD
- `beforeEach` con `jest.clearAllMocks()`
- Usa `async/await` con `expect().rejects.toThrow()` para errores asíncronos

## Notas
- Sigue el patrón AAA: Arrange (preparar datos/mocks), Act (ejecutar), Assert (verificar)
- Para Prisma, mockea el cliente completo o usa `jest-mock-extended` para mocks tipados
- Si la función tiene muchas dependencias, considera si necesita refactor antes de testear
- No testees implementación interna — testea comportamiento (inputs → outputs)
