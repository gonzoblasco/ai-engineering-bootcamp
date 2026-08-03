# Proyecto 5.1 — Audit checklist + script

> **Nivel:** 5 — Auditoría de código IA 🟠
> **Dificultad:** Intermedio-Avanzado
> **Instrucciones:** [`TASK.md`](./TASK.md) · **Docs del nivel:** [level-05-auditoria.md](../../../docs/level-05-auditoria.md)

## 📌 Estado

✅ **Completado**

## 📝 Descripción

Kit de auditoría de código IA compuesto por tres checklists de revisión y un script Node.js que escanea archivos fuente en busca de patrones de riesgo comunes. El script usa expresiones regulares para detectar problemas de seguridad, performance y calidad, y genera reportes legibles en consola o JSON.

## 🛠️ Stack

- **Runtime:** Node.js 18+ (ESM)
- **Lenguaje:** JavaScript puro
- **Dependencias:** Ninguna (solo módulos nativos de Node.js)

## 🚀 Cómo ejecutarlo

No requiere instalación de dependencias. Desde la raíz del proyecto:

```bash
# Auditar un directorio (salida en consola)
node src/audit.js /ruta/al/proyecto/src

# Auditar y guardar reporte JSON
node src/audit.js /ruta/al/proyecto/src --format=json --output=report.json

# Ver ayuda
node src/audit.js --help
```

### Scripts de npm

```bash
npm run audit -- /ruta/al/proyecto/src
npm run audit:json -- /ruta/al/proyecto/src --output=report.json
```

## ✨ Features

- [x] 3 checklists de auditoría documentados:
  - [`docs/checklists/ai-code-audit-checklist.md`](./docs/checklists/ai-code-audit-checklist.md)
  - [`docs/checklists/security-checklist.md`](./docs/checklists/security-checklist.md)
  - [`docs/checklists/performance-checklist.md`](./docs/checklists/performance-checklist.md)
- [x] Script CLI `src/audit.js` que analiza archivos y directorios.
- [x] Detectores regex-based organizados por categoría:
  - Seguridad: `eval`, `innerHTML`, secrets hardcodeados, SQL concatenation, defaults inseguros.
  - Performance: `console.log`, llamadas síncronas a `fs`, body parser sin límite.
  - Calidad: uso de `var`, `catch` vacío, spread/direct `req.body`, `err.message` expuesto.
- [x] Reporte en consola con tabla, severidad y recomendaciones.
- [x] Reporte en JSON con metadatos, resumen e issues detallados.
- [x] Ejecución de prueba sobre código real del Nivel 3.

## 📂 Estructura

```
.
├── README.md
├── TASK.md
├── package.json
├── src/
│   ├── audit.js                 # Punto de entrada CLI
│   ├── config.js                # Configuración del scanner
│   ├── detectors/
│   │   ├── index.js             # Registro de detectores
│   │   ├── security.js          # Detectores de seguridad
│   │   ├── performance.js       # Detectores de performance
│   │   └── quality.js           # Detectores de calidad
│   ├── engine/
│   │   └── auditEngine.js       # Motor de análisis por línea
│   ├── scanners/
│   │   └── fileScanner.js       # Recorrido de archivos
│   └── reporters/
│       ├── consoleReporter.js   # Salida en consola
│       └── jsonReporter.js      # Salida JSON
├── docs/
│   └── checklists/
│       ├── ai-code-audit-checklist.md
│       ├── security-checklist.md
│       └── performance-checklist.md
└── examples/
    └── audit-report.json        # Reporte de ejemplo (02-crud-template)
```

## 📊 Ejemplo de salida

```bash
node src/audit.js /Users/gonzoblasco/Projects/pr_vscode_niveles/projects/level-03-workflows/02-crud-template/src
```

```text
🔍 Reporte de auditoría de código

Total de hallazgos: 8
  Alta: 0
  Media: 7
  Baja: 1

📁 app.js
   🟢 L8 [Performance] express.json() configurado sin límite de tamaño
      → Añadir { limit: "10kb" } u otro límite acorde al endpoint

📁 controllers/productController.js
   🟡 L19 [Calidad] req.body se pasa directamente como data al ORM
      → Construir el objeto de datos desde campos validados, no desde req.body directamente
   🟡 L63 [Calidad] req.body se pasa directamente como data al ORM
      → Construir el objeto de datos desde campos validados, no desde req.body directamente

📁 controllers/userController.js
   🟡 L64 [Calidad] Spread de req.body hacia datos de modelo
      → Seleccionar campos explícitos validados en lugar de propagar todo req.body

📁 middleware/errorHandler.js
   🟡 L31 [Calidad] Mensaje de error interno expuesto al cliente
      → Devolver un mensaje genérico al cliente y loggear el error completo en servidor
   🟡 L42 [Calidad] Mensaje de error interno expuesto al cliente
      → Devolver un mensaje genérico al cliente y loggear el error completo en servidor
   🟡 L48 [Performance] Uso de console.log detectado
      → Usar un logger estructurado y asíncrono; evitar console.log en producción

📁 server.js
   🟡 L5 [Performance] Uso de console.log detectado
      → Usar un logger estructurado y asíncrono; evitar console.log en producción

📊 Resumen por categoría
   Performance: 3
   Calidad: 5
```

## ✅ Criterios de completitud

- [x] 3 checklists creados y documentados
- [x] Script de validación funcional
- [x] Script genera reporte legible
- [x] Probado sobre código del Nivel 3

## 🧪 Pruebas realizadas

Se ejecutó el script sobre los dos proyectos del Nivel 3:

| Proyecto | Hallazgos | Severidad más alta |
|---|---|---|
| [`01-sistema-auth-jwt`](../../../projects/level-03-workflows/01-sistema-auth-jwt) | 4 | Media |
| [`02-crud-template`](../../../projects/level-03-workflows/02-crud-template) | 8 | Media |

El reporte detallado del segundo proyecto se guarda en [`examples/audit-report.json`](./examples/audit-report.json).

## ⚠️ Limitaciones

- El análisis se basa en expresiones regulares, por lo que puede producir falsos positivos o negativos.
- No realiza análisis de AST ni ejecuta el código.
- No audita dependencias de terceros (`npm audit`).
- Está pensado como primera pasada automatizada antes de una revisión manual o con IA.