# Mapeo de herramientas: Cursor → VS Code + Copilot

La metodología de AI-driven development es transferible. Estas son las equivalencias:

## Tabla de equivalencias

| Cursor | VS Code + Copilot | Notas |
|--------|-------------------|-------|
| Cursor Chat | **Copilot Chat** | Chat contextual con el codebase |
| Cursor Tab (autocomplete) | **Copilot inline suggestions** | Autocompletado con Tab |
| Composer (multi-file edit) | **Copilot Edit / Agent mode** | Edición multi-archivo |
| `.cursorrules` | **`.github/copilot-instructions.md`** | Reglas del proyecto para la IA |
| Cursor Agents | **VS Code Agent mode + Skills** | Agentes personalizados |
| `@codebase` | **`@workspace`** | Contexto de todo el proyecto |
| `@file` | **`#file`** | Referencia a un archivo específico |
| `@docs` | **`#docs`** | Referencia a documentación |
| `@web` | **`#web`** | Búsqueda web |
| MCP servers | **MCP servers** | Idéntico en ambos |
| Cursor Rules (global) | **`copilot-instructions.md`** (global en settings) | Reglas globales |

## Conceptos que son idénticos

- Prompt engineering
- Context window management
- Chain-of-thought prompting
- Few-shot prompting
- AI code review
- MCP (Model Context Protocol)

## Diferencias clave a tener en cuenta

1. **Cursor Composer** edita múltiples archivos en una sola operación. En VS Code, usa **Agent mode** o **Copilot Edit** para lograr lo mismo.
2. **Cursor** tiene `.cursorrules` con sintaxis específica. VS Code usa `.github/copilot-instructions.md` con formato libre Markdown.
3. **Cursor** integra el modelo más profundamente en el editor. VS Code + Copilot es más modular pero igual de potente con Agent mode.

## Atajos importantes en VS Code

| Acción | Atajo (macOS) |
|--------|---------------|
| Abrir Copilot Chat | `Cmd+Shift+I` |
| Inline suggestion accept | `Tab` |
| Inline suggestion dismiss | `Esc` |
| Trigger inline suggestion | `Alt+\` |
| Copilot Edit | `Cmd+I` |
| Agent mode | Desde el panel de chat |
| Referenciar archivo | `#file` en el chat |
| Referenciar workspace | `@workspace` en el chat |