#!/usr/bin/env node
/**
 * verify.js — Level 9 auto-check
 *
 * Same template as Levels 1-8: confirms EFFORT (files + evidence), not quality.
 * Quality is judged by the learner against the rubric in docs/level-09-team-standards.md.
 *
 * This level extends the N7 system (ADR-001). The verify focuses on the N9
 * additions: standards.json, the standards validator, the dashboard, and the
 * proof that the validator catches violations.
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

console.log('\n🔍 Level 9 verification\n');

// --- Project 1: standards as code (core) ---
const standards = readIf('standards/standards.json');
check('standards/standards.json exists', !!standards, 'define team standards as code');
let standardsObj = null;
try {
  standardsObj = JSON.parse(standards);
} catch {
  /* invalid JSON */
}
check('standards.json is valid JSON', !!standardsObj, 'standards.json must parse as JSON');
check('standards define required services', !!standardsObj && Array.isArray(standardsObj.services?.required), 'declare required services');
check('standards define style rules', !!standardsObj && standardsObj.style?.maxLineLength > 0, 'declare style rules (maxLineLength)');

// --- Project 2: validator + dashboard (core) ---
const validator = readIf('standards/validate.js');
check('standards/validate.js exists', !!validator, 'create the standards validator');
check('validator checks services', /checkServices|services/.test(validator), 'validate required services exist');
check('validator checks health-check', /checkHealthChecks|health/.test(validator), 'validate /health endpoints');
check('validator checks style', /checkStyle|maxLineLength/.test(validator), 'validate style rules');
check('validator checks security', /checkSecurity|SECRET_PATTERNS|secrets/i.test(validator), 'detect hardcoded secrets');
check('validator checks docs', /checkDocs|README/.test(validator), 'validate docs/READMEs');
check('validator exports validate()', /module\.exports[\s\S]*validate/.test(validator), 'export validate(projectRoot, standards)');
check('dashboard/index.html exists', exists('dashboard/index.html'), 'create the quality dashboard');
check('generate-dashboard-data.js exists', exists('generate-dashboard-data.js'), 'create the script that feeds the dashboard');

// --- Project 3: Prove the standards (core) ---
check('standards/validate.test.js exists', exists('standards/validate.test.js'), 'create standards/validate.test.js');
check('broken fixture exists', exists('standards/fixtures/broken/standards/standards.json'), 'create a broken system fixture that violates standards');

let proveOk = false;
try {
  execFileSync('node', ['--test', path.join(root, 'standards/validate.test.js')], {
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  proveOk = true;
} catch {
  proveOk = false;
}
check('standards proof tests pass', proveOk, 'run node --test standards/validate.test.js');

// --- Project 4: Audit the standards (stretch) ---
const audit = readIf('project-9-standards-audit.md');
if (!audit) {
  console.log('⚠️  Project 4 (standards audit) notes not found — stretch goal, not blocking.\n');
}

console.log(checks.length + ' checks run, ' + (checks.length - failures.length) + ' passed, ' + failures.length + ' failed.\n');

if (failures.length > 0) {
  console.log('❌ Missing:');
  for (const f of failures) console.log(`  - ${f}`);
  console.log('\nFix these, then re-run: node verify.js');
  process.exit(1);
}

console.log('✅ All core checks pass. Quality is up to you — see the self-review in docs/level-09-team-standards.md.');
