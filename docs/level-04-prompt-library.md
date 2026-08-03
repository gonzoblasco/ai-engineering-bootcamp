# Level 4 — Prompt Library 🟠

> **Goal:** Build and maintain a personal library of reusable prompts. Create templates for common tasks: code review, refactoring, documentation, testing.
>
> **Difficulty:** Intermediate | **Projects:** 3 | **Estimated time:** 3-4 hours

## Skills you'll gain

- [ ] Design reusable prompt templates
- [ ] Create prompts with variables and placeholders
- [ ] Build a prompt library structure
- [ ] Version control your prompts
- [ ] Share prompts with your team

---

## Project 1: Prompt template system

**Description:** Create a system for storing, versioning, and using prompt templates.

### Steps

1. Ask Copilot: *"Design a prompt template system. Each template is a markdown file with YAML frontmatter (name, description, variables). Create a CLI to list and use templates."*
2. Create templates for: code review, refactoring, test generation, documentation
3. Add variable substitution: *"Templates should support {{variable}} placeholders that get replaced at runtime."*
4. Add a search command: *"Add a search command that finds templates by name or description."*

### Completion criteria

- [ ] Template system works
- [ ] At least 4 templates exist
- [ ] Variable substitution works
- [ ] Search works

---

## Project 2: Code review prompt

**Description:** Create a detailed code review prompt template.

### Steps

1. Ask Copilot: *"Create a code review prompt template that covers: correctness, security, conventions, performance, and test coverage."*
2. Add severity levels: *"Add BLOCKING, WARNING, and SUGGESTION severity levels."*
3. Add project-specific rules: *"Add a {{rules}} variable for project-specific conventions."*
4. Test it: *"Use the template to review a real PR diff."*

### Completion criteria

- [ ] Template covers all 5 dimensions
- [ ] Severity levels work
- [ ] Variable substitution works
- [ ] You tested it on a real diff

---

## Project 3: Refactoring prompt

**Description:** Create a refactoring prompt template.

### Steps

1. Ask Copilot: *"Create a refactoring prompt template that identifies: code duplication, long functions, unclear names, dead imports."*
2. Add constraints: *"The template should explicitly state: do NOT change behavior, do NOT add features."*
3. Add output format: *"The template should produce a list of specific changes with file paths."*
4. Test it: *"Use the template to refactor a messy file in this repo."*

### Completion criteria

- [ ] Template identifies all 4 patterns
- [ ] Behavior preservation is explicit
- [ ] Output is actionable
- [ ] You tested it on real code

---

## Self-review

Before advancing to Level 5, answer:

- Can you design a reusable prompt template?
- Do you have at least 4 templates in your library?
- Can you share a template with a teammate?

→ If you answered "yes" to all, advance to **Level 5**.
