# Level 1 — Hello World with AI 🟢

> **Goal:** First contact. Set up your environment and generate your first app with AI — and understand *why* the AI does what it does.
>
> **Difficulty:** Beginner | **Projects:** 3 (2 core + 1 stretch) | **Estimated time:** 2-3 hours

## Skills you'll gain

- [ ] Use Copilot Chat
- [ ] Accept inline suggestions (Tab)
- [ ] Use `@workspace` for context
- [ ] Iterate conversationally
- [ ] Ask for code explanations
- [ ] Compare prompts deliberately (what changes the output)
- [ ] Audit and correct AI-generated code

---

## Project 1 — Personal landing page 🟢 core

**Description:** Create a personal landing page (HTML/CSS/JS) from scratch using only Copilot Chat.

### Steps

1. Open Copilot Chat (`Cmd+Shift+I` or the chat icon)
2. Ask: *"Create a personal landing page with HTML, CSS, and vanilla JavaScript. Include hero section, about, projects, and contact form."*
3. Accept suggestions and create the files
4. Iterate: ask for design improvements, responsive layout, animations
5. Open the HTML in your browser and verify

### Completion criteria

- [ ] Landing page works in the browser
- [ ] It's responsive
- [ ] You used at least 3 different prompts to iterate
- [ ] You asked for an explanation of some code fragment

---

## Project 2 — Password generator 🟢 core

**Description:** Mini vanilla JS web app that generates secure passwords.

### Steps

1. Ask Copilot: *"Create a password generator in vanilla JavaScript with options for length, uppercase, numbers, and symbols."*
2. Implement the UI with HTML/CSS
3. Ask Copilot to add validation and visual feedback
4. Refine: ask to copy to clipboard, show password strength

### Completion criteria

- [ ] Generates passwords with configurable options
- [ ] Copies to clipboard
- [ ] Shows strength indicator
- [ ] You refined the code with at least 2 correction prompts

---

## Project 3 — Deliberate iteration 🟡 core

**Description:** Rebuild the password generator three times, each with a *different* prompt strategy, and observe how the output changes. This is the skill that separates "accepting autocomplete" from "directing the AI."

The point is **not** the code — it's training your eye to see how prompt choice shapes the result.

### Steps

1. **Prompt A — vague:** Ask *"make a password generator"* with no other detail. Run it. Note what's missing or assumed.
2. **Prompt B — specific:** Ask *"create a password generator in vanilla JS with length slider, checkboxes for uppercase/numbers/symbols, and a strength meter. Output a single HTML file."* Run it. Note what improved.
3. **Prompt C — constrained:** Ask for the same thing, but add *"no external dependencies, no frameworks, ~80 lines, readable comments."* Run it. Note what changed.
4. For each version, write 2-3 sentences answering:
   - What did the AI *assume* on its own?
   - What did a more specific prompt buy you?
   - Where did the AI's code go wrong or get weird?

### Completion criteria

- [ ] You built the generator 3 times with 3 different prompt strategies
- [ ] You wrote a short comparison (what changed between A, B, C)
- [ ] You can name at least 1 thing each prompt got wrong or assumed
- [ ] You can articulate *why* prompt B beat prompt A

> 💡 **The takeaway:** the model doesn't read your mind — it reads your words. Ambiguity in → ambiguity out. Specificity is a skill you're practicing here, not a gift.

---

## Project 4 — Audit mode 🟠 stretch

**Description:** The AI deliberately generates *broken* code. Your job is to find the bug, explain it, and fix it. This trains the most underrated skill in AI-assisted dev: **knowing when to distrust the output.**

### Steps

1. Paste this deliberately buggy snippet into your chat and ask Copilot to "review and improve" it:

```html
<!-- buggy.html — find the bugs -->
<!DOCTYPE html>
<html>
<head><title>Counter</title></head>
<body>
  <button id="btn">0</button>
  <script>
    let count = 0;
    const btn = document.getElementById('button'); // wrong id!
    btn.addEventListener('click', () => {
      count = count + 1;
      if (count === 10) {
        alert('You hit 10!');
        count = 0; // resets, fine
      }
      btn.textContent = count;
    });
  </script>
</body>
</html>
```

2. Before you accept the AI's suggestion, **predict** what's broken. Write down your prediction first.
3. Run the code. Confirm which bugs you found and which you missed.
4. Ask Copilot to explain *why* the bug exists and the fix. Compare its explanation to yours.

### Completion criteria

- [ ] You identified the bug *before* running the code (or honestly noted what you missed)
- [ ] You can explain the root cause, not just the fix
- [ ] You checked whether the AI's "fix" actually fixed it (don't trust, verify)
- [ ] You wrote one sentence on why "don't trust, verify" matters

> 💡 **The takeaway:** the AI is a brilliant but overconfident intern. The value you add is judgment — knowing when the answer smells wrong.

---

## Self-review

Before advancing to Level 2, answer:

- Do you understand the difference between inline suggestions and chat?
- Do you know how to reference a specific file in chat?
- Could you iterate on generated code without starting from scratch each time?
- Can you predict when the AI's output is likely wrong?
- Can you articulate why a more specific prompt produces better results?

→ If you answered "yes" to all, advance to **Level 2**.

---

## Verifying your work (auto-check)

Run the checklist to confirm you actually did the exercises (not just read them):

```bash
cd projects/level-01-hello-world
node verify.js        # checks files exist + basic structure
```

`verify.js` checks for: landing page files, password generator files, evidence of 3 prompt strategies (Project 3), and your written notes. It's intentionally simple — it confirms *effort*, not *quality*. The quality judgment is yours, guided by the self-review above.

> This is the verification template. Future levels will use the same pattern: a script that confirms effort + a rubric that guides judgment.
