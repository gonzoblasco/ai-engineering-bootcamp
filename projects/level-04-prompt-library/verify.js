#!/usr/bin/env node
/**
 * verify.js — Level 4 auto-check
 *
 * Same template as Levels 1-3: confirms EFFORT (files + evidence), not quality.
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
function walk(dir, pred, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir)) {
    const p = path.join(dir, e);
    if (fs.statSync(p).isDirectory()) walk(p, pred, out);
    else if (pred(p)) out.push(p);
  }
  return out;
}

console.log('\n🔍 Level 4 verification\n');

// --- Project 1: template system ---
const libDir = 'prompt-library';
check('prompt-library/ exists', exists(libDir), 'create a prompt-library folder');
const renderJs = readIf(path.join(libDir, 'render.js'));
check('has a render engine', !!renderJs, 'add a render.js engine');
check('render engine does variable substitution', /\{\{|\}\}|replace|variables/.test(renderJs), 'support {{variable}} substitution');

// --- Templates exist (Project 1 step 2 / Projects 2 & 3) ---
const templates = walk(path.join(libDir, 'prompts'), (p) => p.endsWith('.prompt.md'));
check('has at least 4 templates', templates.length >= 4, `found ${templates.length}; create at least 4 .prompt.md templates`);

// --- Project 2: code review prompt ---
// Find the code-review WORKFLOW template (not the role prompt).
const reviewTpl = templates.find((p) => /review-code/i.test(p) || /workflows.*review/i.test(p));
// templates holds ABSOLUTE/relative paths (from walk) — read them directly.
const reviewSrc = reviewTpl
  ? (() => {
      try {
        return fs.readFileSync(reviewTpl, 'utf8');
      } catch {
        return '';
      }
    })()
  : '';
check('has a code review template', !!reviewTpl, 'create a code review template');
if (reviewTpl) {
  check('review covers dimensions', /correct|secur|convention|perf|test/i.test(reviewSrc), 'cover correctness, security, conventions, performance, tests');
  check('review has severity levels', /blocking|warning|suggestion/i.test(reviewSrc), 'add BLOCKING/WARNING/SUGGESTION severity');
  check('review has a rules variable', /\{\{rules\}\}/.test(reviewSrc), 'add a {{rules}} variable');
}

// --- Project 3: refactoring prompt ---
const refacTpl = templates.find((p) => /refactor/i.test(p));
const refacSrc = refacTpl
  ? (() => {
      try {
        return fs.readFileSync(refacTpl, 'utf8');
      } catch {
        return '';
      }
    })()
  : '';
check('has a refactoring template', !!refacTpl, 'create a refactoring template');
if (refacTpl) {
  check('refactor identifies patterns', /duplicat|long function|name|dead import/i.test(refacSrc), 'identify duplication, long functions, names, dead imports');
  check('refactor preserves behavior', /do not change|do not add|preserve|behavior|no cambies|no agregues|no cambies el comportamiento|no agregues features/i.test(refacSrc), 'explicitly state behavior preservation');
}

// --- Project 4: template quality audit (evidence) ---
const notes4 = readIf('project-4-quality-audit.md');
check('project-4-quality-audit.md exists', !!notes4, 'write project-4-quality-audit.md');
if (notes4) {
  check('audit uses rubric axes', /specific|stabil|testab|reusab|0-2|score/i.test(notes4), 'score templates on the 4 rubric axes');
  check('audit records keep/fix decision', /keep|fix|decide|reason/i.test(notes4), 'record keep vs fix with a reason');
}

// --- Project 5: template versioning (stretch — not blocking) ---
const notes5 = readIf('project-5-versioning.md');
if (!notes5) {
  console.log('⚠️  Project 5 (template versioning) notes not found — stretch goal, not blocking.');
} else {
  check('project-5-versioning.md exists', true);
  check('versioning has a baseline', /v1|baseline|before|saved/i.test(notes5), 'render and save a baseline (v1)');
  check('versioning has a changelog', /changelog|changed|consumers|impact/i.test(notes5), 'write a changelog entry for the change');
}

// --- Summary ---
console.log(`\n${checks.length} checks run, ${checks.length - failures.length} passed, ${failures.length} failed.\n`);
if (failures.length) {
  console.log('❌ Missing:');
  failures.forEach((f) => console.log(`  - ${f}`));
  console.log('\nFix these, then re-run: node verify.js');
  process.exit(1);
}
console.log('✅ All core checks pass. Quality is up to you — see the self-review in docs/level-04-prompt-library.md.\n');
