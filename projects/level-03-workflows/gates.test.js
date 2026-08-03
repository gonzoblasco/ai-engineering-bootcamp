// Gate tests (Level 3, Project 3 — "Prove the gate").
// Each gate must have a BLOCKING case (condition fails → ok=false)
// and a PASSING case (condition passes → ok=true).
// Run: node --test gates.test.js

const test = require('node:test');
const assert = require('node:assert');
const { preflight, runTests, build, runWorkflow } = require('./workflow/gates');

// --- preflight gate ---
test('preflight: BLOCKS when not on main', () => {
  const r = preflight({ branch: 'feature/x', uncommitted: false });
  assert.strictEqual(r.ok, false);
  assert.match(r.detail, /main/);
});

test('preflight: BLOCKS when there are uncommitted changes', () => {
  const r = preflight({ branch: 'main', uncommitted: true });
  assert.strictEqual(r.ok, false);
  assert.match(r.detail, /uncommitted/);
});

test('preflight: ALLOWS on clean main', () => {
  const r = preflight({ branch: 'main', uncommitted: false });
  assert.strictEqual(r.ok, true);
});

test('preflight: ALLOWS in dry-run regardless', () => {
  const r = preflight({ dryRun: true, branch: 'wip', uncommitted: true });
  assert.strictEqual(r.ok, true);
});

// --- runTests gate ---
test('runTests: BLOCKS when tests fail', () => {
  const r = runTests({ testsPass: false });
  assert.strictEqual(r.ok, false);
});

test('runTests: ALLOWS when tests pass', () => {
  const r = runTests({ testsPass: true });
  assert.strictEqual(r.ok, true);
});

// --- build gate ---
test('build: BLOCKS when build fails', () => {
  const r = build({ buildPass: false });
  assert.strictEqual(r.ok, false);
});

test('build: ALLOWS when build passes', () => {
  const r = build({ buildPass: true });
  assert.strictEqual(r.ok, true);
});

// --- runWorkflow orchestration ---
test('runWorkflow: happy path passes all gates', () => {
  const r = runWorkflow({ branch: 'main', uncommitted: false, testsPass: true, buildPass: true });
  assert.strictEqual(r.ok, true);
});

test('runWorkflow: stops at the FIRST blocking gate', () => {
  const r = runWorkflow({ branch: 'feature/x', uncommitted: false, testsPass: true, buildPass: true });
  assert.strictEqual(r.ok, false);
  assert.strictEqual(r.blockedBy, 'preflight');
});

test('runWorkflow: build gate blocks even if tests pass', () => {
  const r = runWorkflow({ branch: 'main', uncommitted: false, testsPass: true, buildPass: false });
  assert.strictEqual(r.ok, false);
  assert.strictEqual(r.blockedBy, 'build');
});

test('runWorkflow: tests gate blocks before build is reached', () => {
  const r = runWorkflow({ branch: 'main', uncommitted: false, testsPass: false, buildPass: false });
  assert.strictEqual(r.ok, false);
  assert.strictEqual(r.blockedBy, 'runTests');
});
