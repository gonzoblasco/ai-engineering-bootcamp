#!/usr/bin/env node
/**
 * verify.js — Level 1 auto-check
 *
 * This is the verification TEMPLATE for the bootcamp.
 * It confirms EFFORT (files exist, structure is right), not QUALITY.
 * Quality is judged by the learner against the rubric in the level doc.
 *
 * Run: node verify.js
 * Exit 0 = all checks pass. Non-zero = something is missing.
 *
 * Extend for future levels: add a section per project that checks
 * the concrete artifacts that project produces.
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

console.log('\n🔍 Level 1 verification\n');

// --- Project 1: landing page ---
check('landing/index.html exists', exists('landing-page/index.html'), 'create landing-page/index.html');
check('landing/styles.css exists', exists('landing-page/styles.css'), 'create landing-page/styles.css');
check('landing/script.js exists', exists('landing-page/script.js'), 'create landing-page/script.js');
const landing = readIf('landing-page/index.html');
check('landing page has a hero section', /hero/i.test(landing), 'add a hero section');
check('landing page has a contact form', /<form/i.test(landing), 'add a contact form');

// --- Project 2: password generator ---
// Location is flexible (password/, password-generator/, etc.). Look for any HTML with a generator.
const dirs = fs.readdirSync(root).filter((d) => {
  try {
    return fs.statSync(path.join(root, d)).isDirectory();
  } catch {
    return false;
  }
});
const genDir = dirs.find((d) => /pass|gen/i.test(d) && d !== 'landing-page');
check('password generator folder exists', !!genDir, 'create a password-generator folder');
if (genDir) {
  const genFiles = fs.readdirSync(path.join(root, genDir));
  check(
    'password generator has HTML + JS',
    genFiles.some((f) => f.endsWith('.html')) && genFiles.some((f) => f.endsWith('.js')),
    'add an .html and a .js file in ' + genDir
  );
  const genJs = dirs
    .filter((d) => d === genDir)
    .map((d) => fs.readdirSync(path.join(root, d)).find((f) => f.endsWith('.js')))
    .map((f) => readIf(path.join(genDir, f)))
    .join(' ');
  check('generator uses clipboard API', /clipboard|copy/i.test(genJs), 'add copy-to-clipboard');
  check('generator has strength logic', /strength|length|uppercase|symbols/i.test(genJs), 'add options/strength logic');
}

// --- Project 3: deliberate iteration (evidence of 3 prompt strategies) ---
const notes3 = readIf('project-3-notes.md');
check('project-3-notes.md exists', !!notes3, 'write project-3-notes.md');
if (notes3) {
  check('notes mention prompt A', /prompt\s*A|vague/i.test(notes3), 'document your vague prompt (A)');
  check('notes mention prompt B', /prompt\s*B|specific/i.test(notes3), 'document your specific prompt (B)');
  check('notes mention prompt C', /prompt\s*C|constrained/i.test(notes3), 'document your constrained prompt (C)');
  check('notes compare the 3', /compare|differ|improve/i.test(notes3), 'write what changed between A, B, C');
}

// --- Project 4: audit mode (stretch — not blocking) ---
const notes4 = readIf('project-4-notes.md');
if (!notes4) {
  console.log('⚠️  Project 4 (audit mode) notes not found — stretch goal, not blocking.');
} else {
  check('project-4-notes.md exists', true);
  check('audit notes explain the bug', /bug|id|explain/i.test(notes4), 'explain the root cause of the bug');
}

// --- Summary ---
console.log(`\n${checks.length} checks run, ${checks.length - failures.length} passed, ${failures.length} failed.\n`);
if (failures.length) {
  console.log('❌ Missing:');
  failures.forEach((f) => console.log(`  - ${f}`));
  console.log('\nFix these, then re-run: node verify.js');
  process.exit(1);
}
console.log('✅ All core checks pass. Quality is up to you — see the self-review in docs/level-01-hello-world.md.\n');
