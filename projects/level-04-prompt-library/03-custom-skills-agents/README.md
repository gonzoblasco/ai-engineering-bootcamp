# Proyecto 4.3 — Custom Skills/Agents

> **Nivel:** 4 — Plantillas y automatización 🟡
> **Dificultad:** Intermedio
> **Instrucciones:** [`TASK.md`](./TASK.md) · **Docs del nivel:** [level-04-prompt-library.md](../../../docs/level-04-prompt-library.md)

## 📌 Estado

✅ **Completado**

## 📝 Descripción

3 skills globales de VS Code que funcionan en cualquier workspace. Se invocan desde Copilot Chat con `/code-reviewer`, `/test-generator` y `/doc-writer`, o automáticamente cuando Copilot detecta el contexto adecuado.

## 🛠️ Stack

- VS Code Copilot Skills system
- Markdown + YAML frontmatter
- Compatible con Node.js / Express / Jest projects

## 🚀 Cómo usarlo

Los skills viven en `~/.agents/skills/` (user-level, globales). No requieren instalación — VS Code los detecta automáticamente.

### Invocación

| Skill | Slash command | Trigger automático |
|---|---|---|
| Code Reviewer | `/code-reviewer` | "review this code", "audit", "find bugs" |
| Test Generator | `/test-generator` | "generate tests", "write tests", "add coverage" |
| Doc Writer | `/doc-writer` | "document this", "add JSDoc", "generate README" |

### Ejemplo

```
# En Copilot Chat:
/code-reviewer src/middleware/auth.js
/test-generator src/models/taskModel.js
/doc-writer src/controllers/userController.js
```

## ✨ Features

- ✅ **Code Reviewer** — analiza bugs, seguridad, performance, arquitectura y testing gaps. Output en tabla markdown con severity.
- ✅ **Test Generator** — genera tests Jest + Supertest completos con happy path, edge cases y error cases. Respeta convenciones ESM.
- ✅ **Doc Writer** — genera JSDoc inline, secciones de README y tablas de endpoints API. Documentación en español.

## 📂 Estructura

```
~/.agents/skills/
├── code-reviewer/
│   └── SKILL.md
├── test-generator/
│   └── SKILL.md
└── doc-writer/
    └── SKILL.md
```

## ✅ Criterios de completitud

- [x] 3 agentes personalizados definidos
- [x] Cada agente funciona como se espera
- [x] Documentación de uso creada