# Level 5 — AI Code Audit 🔴

> **Goal:** Learn to audit AI-generated code systematically. Detect security issues, logic errors, and convention violations that AI commonly introduces.
>
> **Difficulty:** Intermediate | **Projects:** 2 | **Estimated time:** 3-4 hours

## Skills you'll gain

- [ ] Audit AI-generated code for security issues
- [ ] Detect multi-tenancy data leaks
- [ ] Verify auth guards on all endpoints
- [ ] Check for hardcoded secrets
- [ ] Validate input sanitization

---

## Project 1: Security audit tool

**Description:** Create a Node.js CLI tool that audits code for common AI-generated security issues.

### Steps

1. Ask Copilot: *"Create a security audit CLI tool that scans JavaScript/TypeScript files for: hardcoded secrets, missing auth guards, SQL injection risks, and console.log statements."*
2. Add multi-tenancy check: *"Add a check for Supabase queries without tenant filters — detect .from().select('*') patterns without .eq('company_id', ...)."*
3. Add reporting: *"Generate a markdown report with findings grouped by severity (CRITICAL, WARNING, INFO)."*
4. Add blocking: *"CRITICAL findings should exit with code 1 (blocking)."*

### Completion criteria

- [ ] Tool scans files for all 4 patterns
- [ ] Multi-tenancy check works
- [ ] Report is generated
- [ ] CRITICAL findings block the process

---

## Project 2: Audit an AI-generated app

**Description:** Take an intentionally vulnerable AI-generated app and audit it.

### Steps

1. Open `projects/level-05-auditoria/` — there's an Express app with intentional vulnerabilities
2. Run your audit tool on it
3. Manually verify each finding
4. Fix the vulnerabilities using Copilot
5. Re-run the audit to confirm fixes

### Completion criteria

- [ ] Audit tool found at least 3 real issues
- [ ] You manually verified each finding
- [ ] All vulnerabilities are fixed
- [ ] Re-audit passes with zero CRITICAL findings

---

## Self-review

Before advancing to Level 6, answer:

- Can you identify common security issues in AI-generated code?
- Do you know what multi-tenancy data leaks look like?
- Can you verify that auth guards are present on all endpoints?

→ If you answered "yes" to all, advance to **Level 6**.
