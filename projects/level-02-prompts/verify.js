#!/usr/bin/env node
/**
 * verify.js — Level 2 auto-check
 *
 * Same template as Level 1: confirms EFFORT (files + evidence), not quality.
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

console.log('\n🔍 Level 2 verification\n');

// --- Project 1: tasks API ---
check('tasks-api/index.js exists', exists('tasks-api/index.js'), 'create tasks-api/index.js');
check('tasks-api has routes', exists('tasks-api/routes/tasks.js'), 'add tasks-api/routes/tasks.js');
const routes = readIf('tasks-api/routes/tasks.js');
const indexJs = readIf('tasks-api/index.js');
const service = readIf('tasks-api/services/tasksService.js');
check('has CRUD routes', /get|post|put|delete/i.test(routes), 'implement CRUD endpoints');
check('has validation', /title|400|required/i.test(routes), 'add input validation');
check('has pagination', /page|limit|slice/i.test(routes), 'add pagination to list endpoint');

// --- Tests (Project 1 step 5 / Project 4) ---
const testFiles = fs
  .readdirSync(root)
  .filter((d) => {
    try {
      return fs.statSync(path.join(root, d)).isDirectory();
    } catch {
      return false;
    }
  })
  .flatMap((d) => {
    try {
      return fs.readdirSync(path.join(root, d));
    } catch {
      return [];
    }
  })
  .filter((f) => /\.test\.|\.spec\./.test(f));
check('has at least one test file', testFiles.length > 0, 'add a *.test.js or *.spec.js file');
const anyTest = testFiles.map((f) => readIf(f)).join(' ');
check('tests cover an endpoint', /supertest|request\(|fetch\(|app/i.test(anyTest), 'write at least one endpoint test');

// --- Project 3: prompt A/B showdown (evidence) ---
const notes3 = readIf('project-3-ab-notes.md');
check('project-3-ab-notes.md exists', !!notes3, 'write project-3-ab-notes.md');
if (notes3) {
  check('notes compare prompt A vs B', /prompt\s*A|vague|prompt\s*B|structured/i.test(notes3), 'document vague (A) vs structured (B)');
  check('notes list concrete differences', /status|404|204|validate|style|assume/i.test(notes3), 'write the concrete differences you observed');
}

// --- Project 4: break it on purpose (stretch — not blocking) ---
const notes4 = readIf('project-4-bughunt-notes.md');
if (!notes4) {
  console.log('⚠️  Project 4 (bug-hunt) notes not found — stretch goal, not blocking.');
} else {
  check('project-4-bughunt-notes.md exists', true);
  check('bug-hunt notes have a hypothesis', /hypothes|expected|suspected/i.test(notes4), 'write your hypothesis before running');
}

// --- Summary ---
console.log(`\n${checks.length} checks run, ${checks.length - failures.length} passed, ${failures.length} failed.\n`);
if (failures.length) {
  console.log('❌ Missing:');
  failures.forEach((f) => console.log(`  - ${f}`));
  console.log('\nFix these, then re-run: node verify.js');
  process.exit(1);
}
console.log('✅ All core checks pass. Quality is up to you — see the self-review in docs/level-02-prompts.md.\n');
