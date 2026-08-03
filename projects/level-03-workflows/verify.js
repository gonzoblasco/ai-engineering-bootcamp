#!/usr/bin/env node
/**
 * verify.js — Level 3 auto-check
 *
 * Same template as Levels 1-2: confirms EFFORT (files + evidence), not quality.
 * Quality is judged by the learner against the rubric in the level doc.
 *
 * Run: node verify.js
 * Exit 0 = all core checks pass. Non-zero = something is missing.
 */
const fs = require('fs');
const path = require('path');

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
function findFiles(dir, pred) {
  const out = [];
  const walk = (d) => {
    if (!fs.existsSync(d)) return;
    for (const e of fs.readdirSync(d)) {
      const p = path.join(d, e);
      if (fs.statSync(p).isDirectory()) walk(p);
      else if (pred(p)) out.push(p);
    }
  };
  walk(dir);
  return out;
}

console.log('\n🔍 Level 3 verification\n');

// --- Project 2: review CLI (existing solved project) ---
check('review-cli/index.js exists', exists('review-cli/index.js'), 'create review-cli/index.js');
const cli = readIf('review-cli/index.js');
check('review CLI has --file arg', /--file/.test(cli), 'support --file argument');
check('review CLI generates report', /markdown|report|\.md|review\.md/.test(cli), 'generate a markdown report');
check('review CLI has an AI mode', /--ai|ai/i.test(cli), 'add an --ai mode');

// --- Project 1: workflow automation script ---
// Flexible location: workflow/ or automator/ or a script with preflight/gate keywords.
const autoScript = findFiles(root, (p) => /\.(js|mjs|ts)$/.test(p) && /workflow|auto|pipeline|gate|preflight/i.test(p));
check('workflow automation script exists', autoScript.length > 0, 'create a workflow automation script (CLI)');
const autoCode = autoScript.map((p) => readIf(p)).join(' ');
if (autoScript.length) {
  check('has pre-flight check', /preflight|pre-flight|pre.?flight|main|uncommitted/i.test(autoCode), 'add a pre-flight check');
  check('has a gate', /gate|if.*fail|process\.exit|throw/i.test(autoCode), 'add a gate that stops on failure');
  check('generates a report', /report|\.md|markdown/i.test(autoCode), 'generate a workflow execution report');
}

// --- Project 3: prove the gate (evidence) ---
const testFiles = findFiles(root, (p) => /\.(test|spec)\.(js|mjs|ts)$/.test(p) || /test|spec/.test(path.basename(p)));
check('gate test file exists', testFiles.length > 0, 'write a test file that exercises your gates');
const gateTests = testFiles.map((p) => readIf(p)).join(' ');
if (testFiles.length) {
  check('tests have a blocking case', /fail|block|stop|reject|throw|expect.*(fail|throw)/i.test(gateTests), 'write a blocking test case (gate must stop)');
  check('tests have a passing case', /pass|allow|proceed|resolve|ok/i.test(gateTests), 'write a passing test case (gate must allow)');
}

// --- Project 4: audit your own workflow (stretch — not blocking) ---
const notes4 = readIf('project-4-audit-notes.md');
if (!notes4) {
  console.log('⚠️  Project 4 (workflow audit) notes not found — stretch goal, not blocking.');
} else {
  check('project-4-audit-notes.md exists', true);
  check('audit notes use the rubric', /order|block|decorat|missing|gate/i.test(notes4), 'apply the gate rubric');
  check('audit notes record a disagreement', /disagree|ai|co?pilot|differ/i.test(notes4), 'record a disagreement with the AI review');
}

// --- Summary ---
console.log(`\n${checks.length} checks run, ${checks.length - failures.length} passed, ${failures.length} failed.\n`);
if (failures.length) {
  console.log('❌ Missing:');
  failures.forEach((f) => console.log(`  - ${f}`));
  console.log('\nFix these, then re-run: node verify.js');
  process.exit(1);
}
console.log('✅ All core checks pass. Quality is up to you — see the self-review in docs/level-03-workflows.md.\n');
