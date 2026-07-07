# Proyecto 6.1 — GitHub Actions workflow con IA

> **Nivel:** 6 — CI/CD con IA 🟠
> **Dificultad:** Avanzado
> **Instrucciones:** [`TASK.md`](./TASK.md) · **Docs del nivel:** [level-06-cicd.md](../../../docs/level-06-cicd.md)

## 📌 Estado

✅ **Completado**

## 📝 Descripción

Pipeline de CI/CD automatizado con GitHub Actions que integra inteligencia artificial para mejorar la calidad del código y el proceso de desarrollo. El pipeline incluye:

- Linting con ESLint y Prettier para mantener la consistencia del código
- Generación automática de tests faltantes utilizando IA
- Ejecución de tests para garantizar la estabilidad del código
- Revisión de código automatizada con IA para detectar problemas potenciales
- Reporte consolidado de resultados para seguimiento y análisis

## 🛠️ Stack

- **GitHub Actions** - Plataforma de CI/CD
- **ESLint** + **Prettier** - Linting y formateo de código
- **Jest** + **supertest** - Framework de testing
- **Node.js** + **Express.js** - API REST de ejemplo
- **GitHub Copilot** - Generación de tests y revisión de código con IA

## 🚀 Cómo ejecutarlo

```bash
# 1. Instala dependencias
npm install

# 2. (Opcional) Copia el .env de ejemplo
cp .env.example .env

# 3. Modo desarrollo (recarga automática con --watch)
npm run dev

# 4. Ejecutar tests
npm test

# 5. Ejecutar linting
npm run lint

# 6. Formatear código
npm run format
```

## ✨ Features

- [x] Pipeline de CI/CD con GitHub Actions
- [x] Job de linting con ESLint y Prettier
- [x] Generación automática de tests con IA
- [x] Ejecución de tests con Jest
- [x] Revisión de código automatizada con IA
- [x] Reporte consolidado de resultados
- [x] API REST de To-Do list como proyecto de ejemplo

## 📂 Estructura

```
01-github-actions-ia/
├── .github/
│   └── workflows/
│       └── ai-pipeline.yml
├── .eslintrc.js
├── .prettierrc
├── package.json
├── README.md
├── TASK.md
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── utils/
├── tests/
├── scripts/
│   ├── generate-tests.js
│   ├── ai-code-review.js
│   └── generate-report.js
└── coverage/
```

## ✅ Criterios de completitud

- [x] Workflow funcional en GitHub Actions
- [x] Job de linting funciona
- [x] Job de test generation con IA
- [x] Job de code review con IA
- [x] Reporte consolidado