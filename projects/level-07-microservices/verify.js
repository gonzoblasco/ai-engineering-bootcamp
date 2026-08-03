#!/usr/bin/env node
/**
 * verify.js — Level 8 auto-check
 *
 * Same template as Levels 1-7: confirms EFFORT (files + evidence), not quality.
 * Quality is judged by the learner against the rubric in docs/level-08-cloud.md.
 *
 * This level extends the N7 system (ADR-001). The verify focuses on the N8
 * additions: Dockerfiles, CloudFormation template, validator, and the proof that
 * the validator catches broken templates.
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

console.log('\n🔍 Level 8 verification\n');

// --- Project 1: Dockerize the system (core) ---
check('users-service/Dockerfile exists', exists('users-service/Dockerfile'), 'create a Dockerfile for users-service');
check('orders-service/Dockerfile exists', exists('orders-service/Dockerfile'), 'create a Dockerfile for orders-service');
check('notifications-service/Dockerfile exists', exists('notifications-service/Dockerfile'), 'create a Dockerfile for notifications-service');
check('docker-compose.yml exists', exists('docker-compose.yml'), 'create a docker-compose.yml for local development');
check('docker-compose defines services', /services:/i.test(readIf('docker-compose.yml')), 'declare services in docker-compose.yml');

// --- Project 2: CloudFormation template + validator (core) ---
check('cloudformation/template.yml exists', exists('cloudformation/template.yml'), 'create a CloudFormation template');
check('cloudformation/validate.js exists', exists('cloudformation/validate.js'), 'create a CloudFormation validator');
const validator = readIf('cloudformation/validate.js');
check('validator detects port-mismatch', /port-mismatch/.test(validator), 'add a port-mismatch finding to the validator');
check('validator detects missing-health-check', /missing-health-check/.test(validator), 'add a missing-health-check finding');
check('validator detects exposed-port', /exposed-port/.test(validator), 'add an exposed-port finding');
check('validator detects missing-listener', /missing-listener/.test(validator), 'add a missing-listener finding');

// Run the validator against the good template
let goodTemplateOk = false;
try {
  execFileSync('node', [path.join(root, 'cloudformation/validate.js'), '--template', path.join(root, 'cloudformation/template.yml')], {
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  goodTemplateOk = true;
} catch {
  goodTemplateOk = false;
}
check('good template passes validation', goodTemplateOk, 'fix cloudformation/template.yml until validate.js exits 0');

// --- Project 3: Prove the validator (core) ---
check('cloudformation/validate.test.js exists', exists('cloudformation/validate.test.js'), 'create validate.test.js to prove the validator');
const fixtureDir = path.join(root, 'cloudformation/fixtures');
const fixtures = fs.existsSync(fixtureDir) ? fs.readdirSync(fixtureDir).filter((f) => f.endsWith('.yml')) : [];
check('broken fixtures exist', fixtures.length >= 4, `create at least 4 broken templates in cloudformation/fixtures/ (found ${fixtures.length})`);

let proveOk = false;
try {
  execFileSync('node', ['--test', path.join(root, 'cloudformation/validate.test.js')], {
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  proveOk = true;
} catch {
  proveOk = false;
}
check('validator proof tests pass', proveOk, 'run node --test cloudformation/validate.test.js');

// --- Project 4: Audit the IaC decisions (stretch) ---
const audit = readIf('project-8-infra-audit.md');
if (!audit) {
  console.log('⚠️  Project 4 (IaC decisions audit) notes not found — stretch goal, not blocking.\n');
}

console.log(checks.length + ' checks run, ' + (checks.length - failures.length) + ' passed, ' + failures.length + ' failed.\n');

if (failures.length > 0) {
  console.log('❌ Missing:');
  for (const f of failures) console.log(`  - ${f}`);
  console.log('\nFix these, then re-run: node verify.js');
  process.exit(1);
}

console.log('✅ All core checks pass. Quality is up to you — see the self-review in docs/level-08-cloud.md.');
