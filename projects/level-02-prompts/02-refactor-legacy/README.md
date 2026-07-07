# Proyecto 2.2 — Refactor de código legacy

> **Nivel:** 2 — Prompts que funcionan 🟢
> **Dificultad:** Principiante-Intermedio
> **Instrucciones:** [`TASK.md`](./TASK.md) · **Docs del nivel:** [level-02-prompts.md](../../../docs/level-02-prompts.md)

## 📌 Estado

✅ **Completado**

## 📝 Descripción

Toma un archivo `legacy.js` con código intencionalmente mal escrito (anti-patrones, god function, magic numbers, sin tests) y lo refactoriza aplicando **SOLID**, **clean code** y **patrones de diseño** (Strategy, Registry, Dependency Injection), con cobertura de tests.

El código original se conserva en [`legacy.js`](./legacy.js) para comparar antes/después.

## 🛠️ Stack

- **Node.js** (CommonJS)
- **Jest** — testing
- Sin frameworks ni librerías externas: refactor puro de JavaScript

## 🚀 Cómo ejecutarlo

```bash
npm install
npm test              # ejecuta los 43 tests
npm run test:coverage # cobertura
```

## ✨ Features

- [x] Código legacy original preservado (`legacy.js`)
- [x] Refactor con principios SOLID aplicados
- [x] Patrones: Strategy (procesadores), Registry, Dependency Injection
- [x] I/O asíncrono (async/await) en vez de síncrono
- [x] Constantes extraídas (sin magic numbers)
- [x] Logger inyectable (sin `console.log` directo)
- [x] 43 tests pasando, 9 suites

## 📂 Estructura

```
legacy.js                  # código original (NO tocar)
src/
  config/
    constants.js           # constantes (antes magic numbers)
  models/
    user.js                # modelo + validaciones de usuario
    order.js               # modelo + cálculo de totales/descuentos/impuestos
    notification.js         # modelo de notificación
  services/
    logger.js              # abstracción de logging
    userRepository.js       # persistencia de usuarios (async)
    orderRepository.js     # persistencia de pedidos (async)
    emailService.js        # envío de emails
    notificationService.js # envío multi-canal
    dataProcessor.js       # orquestador (sustituye a processData)
  processors/
    userProcessor.js       # procesa items type="user"
    orderProcessor.js      # procesa items type="order"
    notificationProcessor.js # procesa items type="notification"
    registry.js            # registry de procesadores (Strategy)
  utils/
    calc.js                # refactor de calc() → calculateAdjustedScore()
  index.js                # composition root (DI)
tests/
  user.test.js
  order.test.js
  notification.test.js
  calc.test.js
  dataProcessor.test.js
  userProcessor.test.js
  orderProcessor.test.js
  notificationProcessor.test.js
  repositories.test.js
```

## ✅ Criterios de completitud

- [x] Copilot identificó los problemas del código original
- [x] Refactor aplicó principios SOLID
- [x] Tests cubren el código refactorizado
- [x] Documentaste el proceso de refactor como un "recipe"

---

## 📖 Recipe: Cómo refactorizar código legacy con Copilot

### Paso 1 — Analiza antes de tocar

**Prompt:**
> Analiza este código y explica los problemas que ves

No pidas código todavía. Pide **diagnóstico**. Copilot debe listar:
violaciones de SOLID, code smells, bugs potenciales, magic numbers, acoplamiento, falta de tests.

### Paso 2 — Refactor con explicaciones

**Prompt:**
> Refactoriza aplicando SOLID, clean code, y patrones apropiados. Explica cada cambio

Pide que **explique cada cambio** — así aprendes y verificas que no inventó nada.
Patrones esperados: Strategy (un procesador por tipo), Registry, DI, Repository.

### Paso 3 — Tests del refactor

**Prompt:**
> Genera tests para el código refactorizado

Un test por módulo. Mocks para I/O y servicios. Verifica que los tests pasan con `npm test`.

### Paso 4 — Compara antes/después

| Aspecto | Legacy | Refactor |
|---|---|---|
| Líneas por función | ~60 (`processData`) | <15 cada una |
| Responsabilidades | 1 función hace todo | 1 clase = 1 responsabilidad |
| I/O | síncrono (`writeFileSync`) | asíncrono (`async/await`) |
| Errores | sin try/catch | propagados y testeables |
| Tests | 0 | 43 |
| Magic numbers | 8+ | 0 (constantes) |
| Acoplamiento | `fs` hardcodeado | DI (inyectado) |
| Extensibilidad | añadir tipo = tocar god fn | registrar nuevo procesador |

### Lecciones clave

1. **Pide diagnóstico antes que código** — entiende el problema primero.
2. **Pide explicaciones de cada cambio** — no aceptes código sin entenderlo.
3. **Refactor incremental** — un módulo a la vez, tests después de cada paso.
4. **Inyecta dependencias** — I/O, logger, servicios. Así puedes testear sin disco.
5. **Extrae constantes** — ningún magic number sobrevive al refactor.