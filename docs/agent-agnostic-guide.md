# Using This Bootcamp with Any AI Agent

This bootcamp is designed for VS Code + GitHub Copilot, but the methodology is **agent-agnostic**. Every level's concepts transfer to any AI coding agent.

## Core principle

The bootcamp teaches **workflow and methodology**, not tool-specific features. Prompts, gates, audits, and CI/CD patterns work the same regardless of which agent you use.

## Agent-agnostic prompts

Throughout the bootcamp, you'll see prompts like:

```
"Create a REST API for a todo list with Express.js..."
```

These work with **any** AI agent. The key is **how** you structure the prompt, not which tool sends it.

## Adapting to your agent

### If you use Claude Code

| Bootcamp concept | Claude Code equivalent |
|---|---|
| Copilot Chat | `claude` command in terminal |
| Inline suggestions | Claude Code inline completions |
| `@workspace` | Claude reads project context automatically |
| Agent mode | Claude Code multi-step tasks |
| `.github/copilot-instructions.md` | `CLAUDE.md` in project root |

### If you use Codex

| Bootcamp concept | Codex equivalent |
|---|---|
| Copilot Chat | Codex chat panel |
| Inline suggestions | Codex autocomplete |
| `@workspace` | `@codebase` in Codex |
| Agent mode | Codex agent mode |
| `.github/copilot-instructions.md` | `.github/codex-instructions.md` or `AGENTS.md` |

### If you use OpenClaw

| Bootcamp concept | OpenClaw equivalent |
|---|---|
| Copilot Chat | Webchat / direct conversation |
| Inline suggestions | Agent generates full code blocks |
| `@workspace` | Workspace files loaded as context |
| Agent mode | Sub-agents via `sessions_spawn` |
| `.github/copilot-instructions.md` | `AGENTS.md` + `SOUL.md` in workspace |

### If you use Cursor

| Bootcamp concept | Cursor equivalent |
|---|---|
| Copilot Chat | Cursor Chat |
| Inline suggestions | Cursor Tab |
| `@workspace` | `@codebase` |
| Agent mode | Cursor Agent |
| `.github/copilot-instructions.md` | `.cursorrules` |

## Key shortcuts (VS Code)

These are the VS Code defaults used in the bootcamp. If you use a different editor, find the equivalent shortcuts.

| Action | Shortcut (macOS) |
|--------|-----------------|
| Open AI Chat | `Cmd+Shift+I` |
| Accept suggestion | `Tab` |
| Dismiss suggestion | `Esc` |
| Trigger suggestion | `Alt+\` |
| Edit selection with AI | `Cmd+I` |
| Reference a file | `#file` in chat |
| Reference workspace | `@workspace` in chat |

## The methodology is what matters

The bootcamp's value is in its **progressive structure**:

1. **Levels 1-2:** Learn to communicate with AI (prompts, context, iteration)
2. **Levels 3-4:** Design workflows and build reusable templates
3. **Levels 5-6:** Audit AI output and automate in CI/CD
4. **Levels 7-8:** Scale to microservices and production
5. **Levels 9-10:** Multiply your impact and build complete systems

These skills transfer to **any** AI coding agent. The tool is just the interface.
