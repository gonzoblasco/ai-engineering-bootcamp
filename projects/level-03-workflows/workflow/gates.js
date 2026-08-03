// Pure gate logic for the workflow CLI — extracted so it's testable
// (Level 3, Project 1 & 3). The CLI calls these; the tests exercise them.
//
// A gate is a function: (context) => { ok: boolean, detail?: string }
// It STOPS the workflow (ok=false) when a condition fails.

function preflight(ctx) {
  if (ctx.dryRun) return { ok: true, detail: 'dry-run' };
  if (ctx.branch !== 'main') {
    return { ok: false, detail: `must be on main (on ${ctx.branch})` };
  }
  if (ctx.uncommitted) {
    return { ok: false, detail: 'uncommitted changes present' };
  }
  return { ok: true, detail: 'clean main' };
}

function runTests(ctx) {
  return ctx.testsPass ? { ok: true, detail: 'tests green' } : { ok: false, detail: 'tests failed' };
}

function build(ctx) {
  return ctx.buildPass ? { ok: true, detail: 'build ok' } : { ok: false, detail: 'build failed' };
}

// Runs gates in order; returns the first blocking gate (or null if all pass).
function runWorkflow(ctx) {
  const gates = [preflight, runTests, build];
  for (const g of gates) {
    const r = g(ctx);
    if (!r.ok) return { blockedBy: g.name, ...r };
  }
  return { ok: true, detail: 'all gates passed' };
}

module.exports = { preflight, runTests, build, runWorkflow };
