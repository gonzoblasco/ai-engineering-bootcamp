# Level 3 — Structured Workflows 🟠

> **Goal:** Design and implement structured AI workflows. Move from one-off prompts to repeatable, auditable processes.
>
> **Difficulty:** Intermediate | **Projects:** 2 | **Estimated time:** 3-4 hours

## Skills you'll gain

- [ ] Design AI workflows with gates and checkpoints
- [ ] Use Agent mode for multi-step tasks
- [ ] Create reusable prompt templates
- [ ] Implement Pre-Flight checks before coding
- [ ] Use the 5 Gates methodology

---

## Project 1: Workflow automation script

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

## Project 2: AI code review system

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

## Self-review

Before advancing to Level 4, answer:

- Can you design a workflow with gates and checkpoints?
- Do you understand when to use Agent mode vs individual prompts?
- Can you create reusable prompt templates?

→ If you answered "yes" to all, advance to **Level 4**.
