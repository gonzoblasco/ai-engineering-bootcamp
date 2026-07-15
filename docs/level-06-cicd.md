# Level 6 — CI/CD with AI 🔵

> **Goal:** Integrate AI into your CI/CD pipeline. Automate code review, security audit, and PR management with AI agents.
>
> **Difficulty:** Intermediate | **Projects:** 2 | **Estimated time:** 3-4 hours

## Skills you'll gain

- [ ] Set up AI-powered CI/CD pipelines
- [ ] Automate code review in GitHub Actions
- [ ] Automate security audit in CI
- [ ] Create PR templates with AI checks
- [ ] Use AI for release notes generation

---

## Project 1: AI-powered GitHub Action

**Description:** Create a GitHub Action that runs an AI code review on every PR.

### Steps

1. Ask Copilot: *"Create a GitHub Action workflow that runs on pull requests. It should: check out code, install dependencies, run lint, run tests, and post a comment with the results."*
2. Add AI review: *"Add a step that uses the code review prompt from Level 4 to analyze the PR diff and post the review as a PR comment."*
3. Add security audit: *"Add a security audit step using the tool from Level 5. If CRITICAL findings exist, fail the check."*
4. Add auto-labeling: *"Add auto-labeling based on the review: 'security:critical', 'needs-review', 'ready-to-merge'."*

### Completion criteria

- [ ] Workflow runs on every PR
- [ ] AI review is posted as a comment
- [ ] Security audit blocks on CRITICAL findings
- [ ] Auto-labeling works

---

## Project 2: Automated release notes

**Description:** Create a GitHub Action that generates release notes from commit history using AI.

### Steps

1. Ask Copilot: *"Create a GitHub Action that runs when a release is published. It should: fetch commits since the last tag, group them by type (feat, fix, chore), and generate release notes."*
2. Add AI summarization: *"Add a step that uses AI to summarize each group of commits into a concise bullet point."*
3. Add version bump: *"Automatically determine the version bump (major, minor, patch) based on commit types."*
4. Post to release: *"Post the generated release notes to the GitHub Release page."*

### Completion criteria

- [ ] Action runs on release publish
- [ ] Commits are grouped by type
- [ ] AI summaries are generated
- [ ] Version bump is correct

---

## Self-review

Before advancing to Level 7, answer:

- Can you create a GitHub Action that runs AI review on PRs?
- Can you automate security audit in CI?
- Can you generate release notes from commit history?

→ If you answered "yes" to all, advance to **Level 7**.
