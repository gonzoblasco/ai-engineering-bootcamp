# Level 2 — Prompts That Work 🟡

> **Goal:** Master prompt engineering for code generation. Learn to write prompts that produce correct, maintainable code on the first try — and understand *why* prompt structure moves the outcome.
>
> **Difficulty:** Beginner | **Projects:** 4 (2 core + 2 new) | **Estimated time:** 3-4 hours

## Skills you'll gain

- [ ] Write specific, contextual prompts
- [ ] Use system prompts and constraints
- [ ] Chain prompts for complex tasks
- [ ] Iterate with targeted corrections
- [ ] Use `@workspace` and `#file` effectively
- [ ] Measure the real cost of a vague prompt (A/B)
- [ ] Prove the code works with tests, not vibes

---

## Project 1 — REST API: Todo list 🟢 core

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

## Project 2 — Refactor legacy code 🟢 core

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

## Project 3 — Prompt A/B showdown 🟡 core (new)

**Description:** Build the *same* endpoint twice — once with a vague prompt, once with a structured prompt — and measure the real difference. This is where "prompts that work" stops being a slogan and becomes something you can *see*.

The point is the **delta**, not the code. You're training your eye to recognize the price of ambiguity in a real API.

### Steps

1. **Prompt A — vague.** Ask: *"make a delete endpoint for tasks."* Run it. Note what it assumes: auth? validation? status codes? error messages? Does it even match the existing code style?
2. **Prompt B — structured.** Ask: *"Add a DELETE /tasks/:id endpoint to the existing Express app. It should: return 404 if the task doesn't exist, return 204 on success, match the existing validation style, and not break other endpoints. Use the same patterns as routes/tasks.js."* Run it. Note the difference.
3. For each version, write 3-4 sentences answering:
   - What did the AI assume or invent on its own?
   - Did the code match the existing style, or introduce a different one?
   - Would you ship version A? Version B? Why?
4. Optional: run both against your test suite and count failures.

### Completion criteria

- [ ] You built the same endpoint with a vague and a structured prompt
- [ ] You wrote down the concrete differences (status codes, validation, style)
- [ ] You can name at least 2 things the vague prompt got wrong or assumed
- [ ] You can articulate *why* the structured prompt produced better integration

> 💡 **The takeaway:** in a greenfield project, a vague prompt might work. In an existing codebase, context is everything — the AI can't match patterns it was never shown. Structured prompts that reference the existing code are how you get code that *fits*, not just code that *works*.

---

## Project 4 — Break it on purpose 🟠 stretch (new)

**Description:** Ask the AI to generate code with a subtle bug, then prove the bug exists with a test, then fix it. This extends Level 1's "don't trust, verify" from *syntax* to *logic* — and teaches you to use tests as the referee between you and the AI.

### Steps

1. Ask Copilot: *"Write a function that filters a list of tasks and returns only completed ones, but include one subtle bug in the logic. Don't tell me where it is."*
2. **Before you run anything**, write your hypothesis: where is the bug, and how would you prove it?
3. Write a test that targets the suspected bug. Run it. Did it fail? If not, your hypothesis was wrong — write another test.
4. Once the test proves the bug, ask Copilot to fix it. **Re-run the test.** Green?
5. Write one paragraph: what did the test catch that reading alone missed?

### Completion criteria

- [ ] You wrote a hypothesis *before* running anything
- [ ] You wrote a failing test that proved the bug
- [ ] You verified the fix by re-running the test (green), not by trusting the AI
- [ ] You can explain why tests are the source of truth, not the AI's word

> 💡 **The takeaway:** the AI will confidently ship bugs. Your test suite is the only referee that can't be argued with. The skill here isn't writing the test — it's *deciding what to test* based on your suspicion, then letting the test settle it.

---

## Self-review

Before advancing to Level 3, answer:

- Can you write a prompt that produces working code on the first try?
- Do you know how to use `@workspace` to give Copilot full project context?
- Can you chain prompts to build complex features incrementally?
- Can you measure the cost of a vague prompt on a real codebase?
- Do you use tests to verify AI output instead of trusting it?

→ If you answered "yes" to all, advance to **Level 3**.

---

## Verifying your work (auto-check)

Run the checklist to confirm you actually did the exercises:

```bash
cd projects/level-02-prompts
node verify.js
```

`verify.js` checks for: the tasks API, tests, the A/B showdown notes (Project 3), and your bug-hunt write-up (Project 4). It confirms *effort*, not *quality* — quality is judged against the self-review above.

> Same template as Level 1. Confirms effort + rubric guides judgment.
