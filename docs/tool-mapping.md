# Tool Mapping: Cursor → VS Code + Copilot

The AI-driven development methodology is transferable. Here are the equivalents.

## Equivalence table

| Cursor | VS Code + Copilot | Notes |
|--------|-------------------|-------|
| Cursor Chat | **Copilot Chat** | Contextual chat with the codebase |
| Cursor Tab (autocomplete) | **Copilot inline suggestions** | Autocomplete with Tab |
| Composer (multi-file edit) | **Copilot Edit / Agent mode** | Multi-file editing |
| `.cursorrules` | **`.github/copilot-instructions.md`** | Project rules for the AI |
| Cursor Agents | **VS Code Agent mode + Skills** | Custom agents |
| `@codebase` | **`@workspace`** | Full project context |
| `@file` | **`#file`** | Reference a specific file |
| `@docs` | **`#docs`** | Reference documentation |
| `@web` | **`#web`** | Web search |
| MCP servers | **MCP servers** | Identical in both |
| Cursor Rules (global) | **`copilot-instructions.md`** (global in settings) | Global rules |

## Identical concepts

- Prompt engineering
- Context window management
- Chain-of-thought prompting
- Few-shot prompting
- AI code review
- MCP (Model Context Protocol)

## Key differences

1. **Cursor Composer** edits multiple files in one operation. In VS Code, use **Agent mode** or **Copilot Edit**.
2. **Cursor** has `.cursorrules` with specific syntax. VS Code uses `.github/copilot-instructions.md` with free-form Markdown.
3. **Cursor** integrates the model deeper into the editor. VS Code + Copilot is more modular but equally powerful with Agent mode.

## Important shortcuts in VS Code

| Action | Shortcut (macOS) |
|--------|-----------------|
| Open Copilot Chat | `Cmd+Shift+I` |
| Accept inline suggestion | `Tab` |
| Dismiss inline suggestion | `Esc` |
| Trigger inline suggestion | `Alt+\` |
| Copilot Edit | `Cmd+I` |
| Agent mode | From the chat panel |
| Reference a file | `#file` in chat |
| Reference workspace | `@workspace` in chat |
