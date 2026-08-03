# Level 3 — Structured Workflows 🟠

> **Goal:** Design and implement structured AI workflows. Move from one-off prompts to repeatable, auditable processes — and understand *why* a gate belongs in one place and not another.
>
> **Difficulty:** Intermediate | **Projects:** 4 (2 core + 2 new) | **Estimated time:** 4-5 hours

## Skills you'll gain

- [ ] Design AI workflows with gates and checkpoints
- [ ] Use Agent mode for multi-step tasks
- [ ] Create reusable prompt templates
- [ ] Implement Pre-Flight checks before coding
- [ ] Use the 5 Gates methodology
- [ ] Prove a gate actually blocks when it should (test it)
- [ ] Audit a workflow design for gate placement

---

## Project 1 — Workflow automation script 🟢 core

**Description:** Create a Node.js CLI tool that automates a development workflow (e.g., creating a new feature branch, running tests, building, and creating a PR).

### Steps

1. Ask Copilot: *"Create a Node.js CLI tool that automates the workflow: create branch → run tests → build → create PR. Use Commander.js for CLI args."*
2. Add a "Pre-Flight" check: *"Add a pre-flight check that verifies the user is on main, has no uncommitted changes, and has the latest pull."*
3. Add gates: *"Add a build gate — if the build fails, stop and report the error before creating the PR."*
4. Add a report: *"Generate a markdown report of the workflow execution."*

### Completion criteria

- [ ] CLI tool works end-to-end
- [ ] Pre-flight check runs before any action
- [ ] Build gate blocks PR creation on failure
- [ ] Report is generated

---

## Project 2 — AI code review system 🟢 core

**Description:** Build a system that uses Copilot to review code changes against project conventions.

### Steps

1. Ask Copilot: *"Create a Node.js script that reads a git diff, sends it to Copilot for review, and generates a structured report."*
2. Define review dimensions: *"Add review categories: correctness, security, conventions, performance."*
3. Add blocking rules: *"If the review finds hardcoded secrets or missing auth guards, mark as BLOCKING."*
4. Generate output: *"Format the review as a markdown report with ✅, 🔴, 🟡 sections."*

### Completion criteria

- [ ] Script reads git diff
- [ ] Review covers all 4 dimensions
- [ ] Blocking rules work
- [ ] Report is well-formatted markdown

---

## Project 3 — Prove the gate 🟡 core (new)

**Description:** A gate you can't test isn't a gate — it's a hope. In this project you design a workflow, then write tests that prove each gate *actually blocks* when it should and *allows* when it shouldn't.

The point is the **behavior under failure**, not the happy path. Any workflow works when everything succeeds; the design only matters when something breaks.

### Steps

1. **Pick a workflow** you care about (feature branch → test → build → PR, or review → approve → merge).
2. **Write down the gates** and where they sit, as a plain list:
   - `gate: preflight` → before anything runs
   - `gate: tests` → before build
   - `gate: build` → before PR
3. **For each gate, write a test case**:
   - *Blocking case:* the condition fails → gate must STOP (return non-zero, log error, don't proceed).
   - *Passing case:* the condition passes → gate must ALLOW (proceed).
4. **Prove it.** For the blocking case, deliberately break the input (uncommitted change, failing test, broken build) and confirm the gate stops. For the passing case, clean input and confirm it flows through.
5. Write one sentence per gate: what failure does this gate exist to catch?

### Completion criteria

- [ ] You wrote a gate list with positions (before/after which step)
- [ ] Each gate has a blocking test AND a passing test
- [ ] You deliberately broke the input and watched the gate stop
- [ ] You can name the failure each gate exists to catch

> 💡 **The takeaway:** gates are where your workflow's intelligence lives. The happy path is trivial — the design is tested by its failures. If a gate can't be triggered in a test, you don't actually have a gate, you have a comment.

---

## Project 4 — Audit your own workflow 🟠 stretch (new)

**Description:** Review the workflow you designed in Project 3 as if a stranger wrote it. Apply a rubric to catch gates that are misplaced, missing, or decorative.

This extends "don't trust, verify" from *code* to *process design* — the AI generates a plausible-looking workflow, and your judgment decides if it's actually sound.

### Steps

1. Ask Copilot to review your Project 3 workflow: *"Here is my workflow with these gates. Identify gates that are (a) in the wrong order, (b) missing, or (c) decorative (no real blocking power)."*
2. **Before accepting**, apply your own rubric to each gate:
   - Is it in the right position? (does it run before the step it protects?)
   - Can it actually block? (does failure stop the flow?)
   - Is it necessary, or does an earlier gate already cover it?
3. Compare Copilot's review to yours. Where do you disagree? Who's right?
4. Fix at least one gate based on the audit, and re-run your Project 3 tests.
5. Write one paragraph: what did the audit catch that your original design missed?

### Completion criteria

- [ ] You applied the rubric to every gate before reading Copilot's take
- [ ] You found at least one disagreement with the AI's review and resolved it
- [ ] You changed at least one gate and re-verified with tests
- [ ] You can explain why process design needs auditing too, not just code

> 💡 **The takeaway:** the AI designs plausible-sounding workflows, and so do you. Auditing is the discipline of asking "does this gate *actually* do work?" before you trust it. The test suite from Project 3 is what makes the audit honest.

---

## Self-review

Before advancing to Level 4, answer:

- Can you design a workflow with gates and checkpoints?
- Do you understand when to use Agent mode vs individual prompts?
- Can you create reusable prompt templates?
- Can you prove a gate actually blocks when it should?
- Can you audit a workflow design, not just trust it?

→ If you answered "yes" to all, advance to **Level 4**.

---

## Verifying your work (auto-check)

Run the checklist to confirm you actually did the exercises:

```bash
cd projects/level-03-workflows
node verify.js
```

`verify.js` checks for: the review CLI, workflow automation evidence, gate test file (Project 3), and your audit write-up (Project 4). It confirms *effort*, not *quality* — quality is judged against the self-review above.

> Same template as Levels 1-2. Confirms effort + rubric guides judgment.
