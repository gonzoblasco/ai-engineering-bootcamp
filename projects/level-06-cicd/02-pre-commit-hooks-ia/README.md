# Proyecto 6.2 — Pre-commit hooks con IA

> **Nivel:** 6 — CI/CD con IA 🟠
> **Dificultad:** Avanzado
> **Instrucciones:** [`TASK.md`](./TASK.md) · **Docs del nivel:** [level-06-cicd.md](../../../docs/level-06-cicd.md)

## 📌 Estado

✅ **Implementado**

## 📝 Descripción

Este proyecto implementa un sistema de pre-commit hooks que utiliza inteligencia artificial para validar el código antes de cada commit. El sistema revisa aspectos de seguridad, bugs obvios y convenciones de código, bloqueando commits que contengan problemas críticos.

El hook se ejecuta automáticamente antes de cada commit y realiza las siguientes validaciones:
1. Formateo de código con Prettier
2. Linting con ESLint
3. Validación con IA para detectar problemas de seguridad, bugs y convenciones

## 🛠️ Stack

- Node.js (ESM)
- Husky para hooks de Git
- lint-staged para ejecutar comandos en archivos staged
- Prettier para formateo de código
- API de IA (OpenAI-compatible) para análisis de código
- dotenv para configuración de entorno

## 🚀 Cómo ejecutarlo

### Prerrequisitos
- Node.js >= 16
- npm >= 7

### Instalación
```bash
npm install
```

### Configurar IA (opcional)

Copia el archivo de ejemplo y configura tu API key:
```bash
cp .env.example .env
# Edita .env y añade tu AI_API_KEY
```

Si no configuras una API key, el validador usará patrones regex como fallback.

### Comandos disponibles
```bash
# Ejecutar el proyecto en modo desarrollo
npm run dev

# Validar archivos específicos con la IA
npm run validate <ruta-al-archivo>

# Ejecutar linting
npm run lint

# Ejecutar linting y corregir problemas automáticamente
npm run lint:fix

# Formatear código con Prettier
npm run format
```

## ✨ Features

- [x] Hook de pre-commit que se ejecuta automáticamente antes de cada commit
- [x] Validación de código con IA para detectar problemas de seguridad
- [x] Validación de código con IA para detectar bugs obvios
- [x] Validación de código con IA para verificar convenciones
- [x] Bloqueo de commits con problemas críticos
- [x] Integración con ESLint y Prettier
- [x] Documentación completa

## 📂 Estructura

```text
pre-commit-hooks-ia/
  .husky/              # Hooks de Git
  scripts/             # Scripts de validación
  src/
    config/            # Configuración (env.js)
    services/          # Servicio de IA (aiService.js)
  tests/               # Pruebas (estructura base)
  docs/                # Documentación
  .env.example         # Template de variables de entorno
  package.json         # Configuración del proyecto
  README.md            # Documentación del proyecto
```

## ✅ Criterios de completitud

- [x] Pre-commit hook instalado y funcionando
- [x] Valida código con IA antes de commit
- [x] Bloquea commits con problemas críticos
- [x] Documentación de cómo funciona