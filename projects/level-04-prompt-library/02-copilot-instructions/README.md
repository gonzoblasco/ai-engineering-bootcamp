# Proyecto 4.2 — `.github/copilot-instructions.md`

> **Nivel:** 4 — Plantillas y automatización 🟡
> **Dificultad:** Intermedio
> **Instrucciones:** [`TASK.md`](./TASK.md) · **Docs del nivel:** [level-04-prompt-library.md](../../../docs/level-04-prompt-library.md)

## 📌 Estado

✅ **Completado**

## 📝 Descripción

Archivo `.github/copilot-instructions.md` en la raíz del repo que define las convenciones de código que Copilot debe seguir al generar código para este workspace. Cubre stack, naming, estructura de carpetas, patrones, seguridad, testing y formato de commits.

## 🛠️ Stack

- Node.js (ESM)
- Express.js
- Jest + Supertest
- Prisma (cuando aplica)

## 🚀 Cómo usarlo

El archivo `.github/copilot-instructions.md` es detectado automáticamente por GitHub Copilot en VS Code. No requiere instalación ni comandos — Copilot lo lee al iniciar sesión en el workspace.

Para verificar que está activo, abrir el archivo en VS Code y confirmar que Copilot Chat lo reconoce como instrucciones de proyecto.

## ✨ Features

- ✅ Stack tecnológico definido (Node.js + Express + ESM)
- ✅ Convenciones de naming (camelCase, PascalCase, UPPER_SNAKE_CASE)
- ✅ Estructura de carpetas obligatoria (`src/{app.js, server.js, controllers/, ...}`)
- ✅ Patrones a seguir (separación por capas, error handling centralizado, health check)
- ✅ Patrones a evitar (no `require()`, no `app.listen()` en `app.js`, no `var`)
- ✅ Reglas de seguridad (no `eval`, no `innerHTML`, sanitizar inputs, bcrypt)
- ✅ Reglas de testing (Jest + Supertest, 80% cobertura, `*.test.js`)
- ✅ Formato de commits (Conventional Commits en español)

## 📂 Estructura

```
.github/
  copilot-instructions.md   # ← este archivo
```

## ✅ Criterios de completitud

- [x] Archivo `.github/copilot-instructions.md` creado
- [x] Copilot genera código siguiendo las convenciones
- [x] Probaste que las reglas funcionan con 3 prompts diferentes