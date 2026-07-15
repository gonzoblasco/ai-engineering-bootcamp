# Level 2 — Prompts That Work 🟡

> **Goal:** Master prompt engineering for code generation. Learn to write prompts that produce correct, maintainable code on the first try.
>
> **Difficulty:** Beginner | **Projects:** 2 | **Estimated time:** 2-3 hours

## Skills you'll gain

- [ ] Write specific, contextual prompts
- [ ] Use system prompts and constraints
- [ ] Chain prompts for complex tasks
- [ ] Iterate with targeted corrections
- [ ] Use `@workspace` and `#file` effectively

---

## Project 1: REST API — Todo list

**Description:** Build a complete REST API for a todo list using Express.js, with Copilot generating most of the code.

### Steps

1. Initialize the project: `npm init -y` and install `express`
2. In Copilot Chat, ask: *"Create a REST API for a todo list with Express.js. Include CRUD endpoints, in-memory storage, and proper error handling."*
3. Review the generated code — ask for explanations of patterns you don't understand
4. Add validation: *"Add input validation for the todo creation endpoint. Title is required, max 200 chars."*
5. Add tests: *"Create integration tests with Supertest for all endpoints."*

### Completion criteria

- [ ] All CRUD endpoints work (GET, POST, PUT, DELETE)
- [ ] Input validation is implemented
- [ ] Tests pass
- [ ] You asked for at least 2 code explanations

---

## Project 2: Refactor legacy code

**Description:** Take a poorly written codebase and refactor it using Copilot.

### Steps

1. Open `projects/level-02-prompts/02-refactor-legacy/` — there's a messy Express app
2. Ask Copilot: *"Analyze this code and identify the main issues: code duplication, error handling, and naming."*
3. Refactor step by step, asking Copilot for each improvement
4. Ask: *"Extract the validation logic into a middleware."*
5. Ask: *"Add centralized error handling."*

### Completion criteria

- [ ] You identified at least 3 code issues before refactoring
- [ ] Validation is extracted to middleware
- [ ] Error handling is centralized
- [ ] The refactored code is cleaner (ask Copilot to compare)

---

## Self-review

Before advancing to Level 3, answer:

- Can you write a prompt that produces working code on the first try?
- Do you know how to use `@workspace` to give Copilot full project context?
- Can you chain prompts to build complex features incrementally?

→ If you answered "yes" to all, advance to **Level 3**.
