# E2E test template

## Cuándo usarlo
Cuando necesitas generar tests end-to-end que simulen un usuario real interactuando con la aplicación completa (frontend + backend).

## Prompt
```
Genera tests E2E para el flujo {{FLOW_NAME}}.

Requisitos:
- Framework: {{E2E_FRAMEWORK}} (Playwright / Cypress)
- Flujo a testear: {{FLOW_STEPS}}
- URL base: {{BASE_URL}}
- Usuario de prueba: {{TEST_USER}}
- Assertions por paso: {{ASSERTIONS}}
- Manejo de esperas: {{WAIT_STRATEGY}}

Contexto del proyecto:
{{PROJECT_CONTEXT}}
```

## Ejemplo de uso
**Input:**
- `{{FLOW_NAME}}` = registro y login de usuario
- `{{E2E_FRAMEWORK}}` = Playwright
- `{{FLOW_STEPS}}` = 1. Visitar /register, 2. Llenar formulario, 3. Submit, 4. Verificar redirect a /login, 5. Llenar credenciales, 6. Submit, 7. Verificar redirect a /dashboard
- `{{BASE_URL}}` = http://localhost:3000
- `{{TEST_USER}}` = email: test@example.com, password: Test1234!
- `{{ASSERTIONS}}` = registro: ver mensaje de éxito, redirect a /login; login: ver dashboard, ver nombre de usuario en navbar
- `{{WAIT_STRATEGY}}` = esperar por selectores visibles (waitForSelector), no usar timeouts fijos
- `{{PROJECT_CONTEXT}}` = Next.js 14 + API REST, tests en e2e/

**Output esperado:**
- `e2e/auth.spec.ts` — test('user can register and login')
- Usa `page.goto('/register')`, `page.fill('[data-testid="name-input"]', ...)`, `page.click('[data-testid="submit-button"]')`
- `expect(page).toHaveURL('/login')` tras registro exitoso
- `expect(page.locator('[data-testid="user-greeting"]')).toContainText('test@example.com')` en dashboard
- Configuración en `playwright.config.ts` con baseURL y proyectos (chromium, firefox, webkit)

## Notas
- Usa `data-testid` en lugar de clases CSS o IDs para selectores — son estables y no dependen de estilos
- Los tests E2E son los más lentos y frágiles — prioriza pocos tests que cubran los flujos críticos
- Para entornos con auth, crea un helper `loginAs(page, user)` reutilizable
- En CI, ejecuta los E2E contra un entorno de staging, no producción
- Playwright tiene `trace viewer` para debuggear tests fallidos — actívalo en CI con `trace: 'on-first-retry'`
