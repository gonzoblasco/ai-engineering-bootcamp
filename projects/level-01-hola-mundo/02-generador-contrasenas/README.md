# Proyecto 1.2 — Generador de contraseñas

> **Nivel:** 1 — Hola Mundo con IA 🟢
> **Dificultad:** Principiante
> **Instrucciones:** [`TASK.md`](./TASK.md) · **Docs del nivel:** [level-01-hola-mundo.md](../../../docs/level-01-hola-mundo.md)

## 📌 Estado

✅ **Completado**

## 📝 Descripción

Mini-app web vanilla JS que genera contraseñas seguras con opciones configurables de longitud, mayúsculas, números y símbolos. Incluye medidor de fortaleza visual y copia al clipboard con feedback toast.

## 🛠️ Stack

- **HTML5** semántico (`<main>`, `<section>`, `<form>`) con `lang="es"`
- **CSS3** con custom properties (dark theme consistente con el proyecto 1.1), slider y toggles custom, transiciones de color en el medidor de fortaleza
- **JavaScript vanilla** (IIFE, sin frameworks ni dependencias)
- **Web Crypto API** (`crypto.getRandomValues`) para aleatoriedad criptográficamente segura
- Sin build tools — se abre directamente en el navegador

## 🚀 Cómo ejecutarlo

No requiere instalación ni build. Abre el archivo directamente:

```bash
open index.html
# o sirve con un servidor estático
npx serve .
```

## ✨ Features

- 🔐 Generación segura con `crypto.getRandomValues` (no `Math.random`)
- 🎚️ Slider de longitud (8–32 caracteres) con label en vivo
- 🔀 Toggles para mayúsculas (A-Z), números (0-9) y símbolos (!@#$…)
- 💪 Medidor de fortaleza con 5 niveles (Muy débil → Muy fuerte) y barra de color
- 📋 Copia al clipboard con `navigator.clipboard` + fallback a `execCommand`
- 🔔 Toast de confirmación auto-oculto (2s)
- ⚠️ Validación: advierte si no hay opciones extra activadas
- 🔄 Live preview: slider y toggles regeneran al instante
- 📱 Responsive (card centrada, max-width 480px)

## 📂 Estructura

```
02-generador-contrasenas/
├── index.html      # Estructura: display, opciones, medidor, toast
├── styles.css       # Dark theme, slider/toggle custom, strength bar
├── script.js        # Generación, fortaleza, clipboard, eventos
└── TASK.md          # Instrucciones del ejercicio
```

## ✅ Criterios de completitud

- [x] Genera contraseñas con opciones configurables
- [x] Copia al clipboard
- [x] Muestra indicador de fortaleza
- [x] Refinaste el código con al menos 2 prompts de corrección