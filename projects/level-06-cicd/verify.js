#!/usr/bin/env node
/**
 * verify.js — Level 6 auto-check
 *
 * Same template as Levels 1-5: confirms EFFORT (files + evidence), not quality.
 * Quality is judged by the learner against the rubric in the level doc.
 *
 * Run: node verify.js
 * Exit 0 = all core checks pass. Non-zero = something is missing.
 */
const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = __dirname;
const checks = [];
const failures = [];

function check(name, ok, hint = '') {
  checks.push(name);
  if (!ok) failures.push(`${name}${hint ? ` — ${hint}` : ''}`);
}
function exists(rel) {
  return fs.existsSync(path.join(root, rel));
}
function readIf(rel) {
  try {
    return fs.readFileSync(path.join(root, rel), 'utf8');
  } catch {
    return '';
  }
}
function walk(dir, pred, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir)) {
    const p = path.join(dir, e);
    if (fs.statSync(p).isDirectory()) walk(p, pred, out);
    else if (pred(p)) out.push(p);
  }
  return out;
}

console.log('\n🔍 Level 6 verification\n');

// --- Project 1: AI-powered GitHub Action (core) ---
const prWorkflow = readIf('.github/workflows/pr-review.yml');
const prScript = readIf('scripts/analyze-pr.js');
check('pr-review.yml exists', !!prWorkflow, 'create .github/workflows/pr-review.yml');
check('analyze-pr.js exists', !!prScript, 'create scripts/analyze-pr.js');
check('analyze-pr detects findings', /finding|secret|severity|console/i.test(prScript), 'detect findings in the diff');
check('analyze-pr has a gate', /--gate|gate|blocked|process\.exit/i.test(prScript), 'add a --gate mode that fails on high severity');
check('workflow posts a comment', /createComment|github-script|issues\./i.test(prWorkflow), 'post the review as a PR comment');

// --- Project 2: Automated release notes (core) ---
const releaseWorkflow = readIf('.github/workflows/release-notes.yml');
const releaseScript = readIf('scripts/generate-release-notes.js');
check('release-notes.yml exists', !!releaseWorkflow, 'create .github/workflows/release-notes.yml');
check('generate-release-notes.js exists', !!releaseScript, 'create scripts/generate-release-notes.js');
check('release notes group by type', /feat|fix|chore|breaking|feature|category/i.test(releaseScript), 'group commits by type (feat/fix/chore/breaking)');

// --- Project 3: Prove the CI gate (core) ---
const badDiff = readIf('fixtures/bad.diff');
const goodDiff = readIf('fixtures/good.diff');
const testGate = readIf('scripts/test-gate.js');
check('fixtures/bad.diff exists', !!badDiff, 'write a bad diff that MUST be blocked');
check('fixtures/good.diff exists', !!goodDiff, 'write a good diff that MUST pass');
check('test-gate.js exists', !!testGate, 'create scripts/test-gate.js');
check('test-gate runs both fixtures', /bad\.diff|good\.diff/i.test(testGate), 'test-gate must check both the bad and good fixture');

// Actually run the gate test (the proof, not just the files)
let gateOk = false;
let gateOutput = '';
try {
  gateOutput = execFileSync('node', [path.join(root, 'scripts', 'test-gate.js')], {
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  gateOk = true;
} catch {
  gateOk = false;
}
check('gate test passes (bad blocks, good passes)', gateOk, 'run node scripts/test-gate.js; bad.diff must block and good.diff must pass');

// --- Project 4: Audit your pipeline (stretch) ---
// Stretch goal: warn but don't block.
const audit = readIf('project-6-pipeline-audit.md');
if (!audit) {
  console.log('⚠️  Project 4 (pipeline audit) notes not found — stretch goal, not blocking.');
}

console.log(checks.length + ' checks run, ' + (checks.length - failures.length) + ' passed, ' + failures.length + ' failed.\n');

if (failures.length > 0) {
  console.log('❌ Missing:');
  for (const f of failures) console.log(`  - ${f}`);
  console.log('\nFix these, then re-run: node verify.js');
  process.exit(1);
}

console.log('✅ All core checks pass. Quality is up to you — see the self-review in docs/level-06-cicd.md.');
