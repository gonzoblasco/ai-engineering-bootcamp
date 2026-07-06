# Proyecto 1.1 — Landing page personal

> **Nivel:** 1 — Hola Mundo con IA 🟢
> **Dificultad:** Principiante
> **Instrucciones:** [`TASK.md`](./TASK.md) · **Docs del nivel:** [level-01-hola-mundo.md](../../../docs/level-01-hola-mundo.md)

## 📌 Estado

✅ **Completado**

## 📝 Descripción

Landing page del roadmap "AI-Driven Engineering Specialist" — 10 niveles gamificados para dominar el desarrollo asistido por IA con VS Code + GitHub Copilot. Incluye hero, sección about, grid de niveles con cards interactivas, formulario de contacto y footer.

## 🛠️ Stack

- **HTML5** semántico (`<header>`, `<nav>`, `<section>`, `<footer>`)
- **CSS3** con custom properties (dark theme estilo GitHub), `clamp()` para tipografía fluida, `IntersectionObserver` para animaciones
- **JavaScript vanilla** (IIFE, sin frameworks ni dependencias)
- Sin build tools — se abre directamente en el navegador

## 🚀 Cómo ejecutarlo

No requiere instalación ni build. Abre el archivo directamente:

```bash
open index.html
# o sirve con un servidor estático
npx serve .
```

## ✨ Features

- 🎨 Dark theme con paleta de CSS variables (cyan/purple/blue accents)
- 📱 Responsive con menú hamburguesa en móvil
- ✨ Animaciones: reveal on scroll, contadores animados, navbar con scroll
- 🧭 Navegación suave con scroll-behavior y scroll-padding
- 📝 Formulario de contacto con validación custom
- 🎮 Cards de niveles con badges de dificultad (🟢🟡🟠🔴👑)

## 📂 Estructura

```
01-landing-page/
├── index.html      # Estructura semántica + secciones
├── styles.css       # Dark theme, responsive, animaciones
├── script.js        # Navbar, reveal, contadores, formulario
└── TASK.md          # Instrucciones del ejercicio
```

## ✅ Criterios de completitud

- [x] Landing page con secciones (hero, about, roadmap, contact)
- [x] Responsive y visualmente atractiva
- [x] Desarrollada con prompts a Copilot Chat
- [x] Refinaste el diseño con al menos 2 prompts de corrección