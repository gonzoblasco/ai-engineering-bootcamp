# Level 4 — Prompt Library 🟠

> **Goal:** Build and maintain a personal library of reusable prompts. Create templates for common tasks — and understand what separates a *good* template from one that merely *looks* like one.
>
> **Difficulty:** Intermediate | **Projects:** 5 (3 core + 2 new) | **Estimated time:** 4-5 hours

## Skills you'll gain

- [ ] Design reusable prompt templates
- [ ] Create prompts with variables and placeholders
- [ ] Build a prompt library structure
- [ ] Version control your prompts
- [ ] Share prompts with your team
- [ ] Audit a template's quality against a rubric
- [ ] Manage template change (versioning)

---

## Project 1 — Prompt template system 🟢 core

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

## Project 2 — Code review prompt 🟢 core

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

## Project 3 — Refactoring prompt 🟢 core

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

## Project 4 — Template quality audit 🟡 core (new)

**Description:** A template is a contract, not a file. This project teaches you to evaluate whether a template in your library is actually *good* — or just plausible. You audit two of your templates against a rubric and decide whether they earn their place.

The point is the **judgment**, not the template. Anyone can write a template that reads well; the skill is spotting the one that will silently produce bad output.

### Steps

1. Pick **two** templates from your library (e.g., your code review and refactoring prompts).
2. Run each through this rubric, scoring 0-2 per axis:
   - **Specificity** — does it constrain the output, or is it vague enough to be useless? (0 = hand-wavy, 2 = crisp requirements)
   - **Stability** — does it reference things that change (a specific line, a file that won't exist) or stable concepts? (0 = fragile, 2 = robust)
   - **Testability** — could you tell, from the output, whether the template *worked*? (0 = no, 2 = clearly)
   - **Reusability** — are the variables right? Too few (rigid) or too many (noise)? (0 = bad split, 2 = just right)
3. **Run the template for real** against actual code. Score based on what it *produced*, not what it promised.
4. For each template, write one sentence: keep it as-is, or fix what and why?

### Completion criteria

- [ ] You scored both templates on all 4 axes
- [ ] You ran them for real and scored the *actual output*
- [ ] You found at least one gap between how the template *reads* and how it *performs*
- [ ] You decided keep vs fix for each, with a reason

> 💡 **The takeaway:** a template that reads well but performs poorly is worse than no template — it gives you false confidence. The audit closes the gap between "this looks professional" and "this produces good work."

---

## Project 5 — Template versioning 🟠 stretch (new)

**Description:** Templates change, and every change is a contract break for the renders that depend on them. This project simulates that reality and teaches you to manage it deliberately instead of by accident.

### Steps

1. **Freeze a baseline.** Render one of your templates and save the output as `v1`.
2. **Change the template.** Ask Copilot to add a new required variable to it (or change an existing constraint).
3. **Try to re-render** using the same variables as before. What happens? Does it fail, or silently change output?
4. **Document the change.** Write a one-line changelog entry: what changed, who/what consumes it, what they must do.
5. Reflect: if a teammate used the old version, would they notice the break? How would you tell them?

### Completion criteria

- [ ] You rendered a baseline (v1) and saved it
- [ ] You changed the template and observed the impact on old renders
- [ ] You wrote a changelog entry for the change
- [ ] You can explain how a template change propagates to its consumers

> 💡 **The takeaway:** a shared template is an API. Changing it without telling consumers is a silent breaking change. The discipline of versioning — baseline, changelog, notice — is what makes a library trustworthy to share.

---

## Self-review

Before advancing to Level 5, answer:

- Can you design a reusable prompt template?
- Do you have at least 4 templates in your library?
- Can you share a template with a teammate?
- Can you tell a good template from a plausible one?
- Can you manage a template change without silently breaking consumers?

→ If you answered "yes" to all, advance to **Level 5**.

---

## Verifying your work (auto-check)

Run the checklist to confirm you actually did the exercises:

```bash
cd projects/level-04-prompt-library
node verify.js
```

`verify.js` checks for: the prompt library with templates, your quality audit (Project 4), and versioning evidence (Project 5). It confirms *effort*, not *quality* — quality is judged against the self-review above.

> Same template as Levels 1-3. Confirms effort + rubric guides judgment.
