# Level 10 — Full System 🔴

> **Goal:** Build a complete, production-ready system from scratch using everything you've learned. This is the final boss.
>
> **Difficulty:** Expert | **Projects:** 2 | **Estimated time:** 6-8 hours

## Skills you'll gain

- [ ] Architect a complete system with AI
- [ ] Implement all layers: frontend, API, database, deployment
- [ ] Apply all 5 Gates methodology
- [ ] Run full security audit
- [ ] Deploy to production

---

## Project 1: Full-stack application

**Description:** Build a complete full-stack application from scratch using AI for every layer.

### Requirements

Build a **team task manager** with:

- **Frontend:** React with component library (shadcn/ui or similar)
- **API:** Express.js or Next.js API routes
- **Database:** PostgreSQL with Prisma ORM
- **Auth:** JWT-based authentication
- **Features:** Create projects, assign tasks, track status, add comments
- **Deployment:** Docker + AWS ECS or Vercel + Supabase

### Process

1. **Architecture phase:** Ask Copilot to design the system architecture. Review and refine.
2. **Database phase:** Ask Copilot to create the Prisma schema. Review for multi-tenancy.
3. **API phase:** Build the API layer with auth, validation, and error handling.
4. **Frontend phase:** Build the React frontend with all states (loading, empty, error).
5. **Integration phase:** Connect frontend to API, test end-to-end.
6. **Security audit:** Run the security audit tool from Level 5.
7. **Deployment:** Deploy to production.

### Completion criteria

- [ ] All features work end-to-end
- [ ] Auth works (register, login, protected routes)
- [ ] Multi-tenancy is implemented (users only see their projects)
- [ ] Security audit passes with zero CRITICAL findings
- [ ] App is deployed and accessible

---

## Project 2: System retrospective

**Description:** Document everything you learned building the full-stack application.

### Steps

1. Ask Copilot: *"Create a retrospective document covering: what went well, what was challenging, what you'd do differently."*
2. Add metrics: *"Include metrics: total prompts used, time saved vs manual coding, bugs introduced by AI vs caught in review."*
3. Add patterns: *"Document the prompt patterns that worked best for each layer (frontend, API, database, deployment)."*
4. Add recommendations: *"Add recommendations for other developers attempting a similar project."*

### Completion criteria

- [ ] Retrospective covers all sections
- [ ] Metrics are meaningful
- [ ] Patterns are documented
- [ ] Recommendations are actionable

---

## 🏆 Congratulations!

You've completed the AI Engineering Bootcamp. You now have:

- A structured methodology for AI-assisted development
- A library of reusable prompt templates
- Automated CI/CD with AI review
- Security audit skills
- The ability to mentor others

**Next steps:**
- Share your retrospective with the community
- Contribute to the bootcamp (open a PR with improvements)
- Apply the methodology to your real projects
- Mentor another developer through the bootcamp

---

## Self-review (final)

- Can you architect and build a complete system with AI assistance?
- Can you audit AI-generated code for security issues?
- Can you mentor other developers in AI-assisted development?
- Do you have a repeatable methodology that works across projects?

→ If you answered "yes" to all, **you're ready for production.**
