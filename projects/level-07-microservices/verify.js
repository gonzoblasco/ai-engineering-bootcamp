#!/usr/bin/env node
/**
 * verify.js — Level 10 auto-check (final boss)
 *
 * Same template as Levels 1-9: confirms EFFORT (files + evidence), not quality.
 * Quality is judged by the learner against the rubric in docs/level-10-full-system.md.
 *
 * This level extends the N7 system (ADR-001). The verify focuses on the N10
 * additions: auth-service, gateway, the orchestrator, CI/CD, and the end-to-end
 * proof that the WHOLE system works.
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

console.log('\n🔍 Level 10 verification — the final boss\n');

// --- Project 1: the complete system (core) ---
const auth = readIf('auth-service/index.js');
check('auth-service exists', !!auth, 'add the auth service');
check('auth has register', /auth\/register/.test(auth), 'implement POST /auth/register');
check('auth has login', /auth\/login/.test(auth), 'implement POST /auth/login');
check('auth validates input', /obligatorio|inválido/.test(auth), 'validate inputs and return 4xx on bad data');
check('auth has /health', /health/.test(auth), 'expose /health on auth');

const users = readIf('users-service/index.js');
check('users-service exists', !!users, 'users service present (from N7)');
const orders = readIf('orders-service/index.js');
check('orders-service exists', !!orders, 'orders service present (from N7)');
const notif = readIf('notifications-service/index.js');
check('notifications-service exists', !!notif, 'notifications service present (from N7)');

const gw = readIf('gateway/index.js');
check('gateway exists', !!gw, 'add the API gateway');
check('gateway routes /auth', /\/auth/.test(gw), 'route /auth to the auth service');
check('gateway routes /users', /\/users/.test(gw), 'route /users to users service');
check('gateway routes /orders', /\/orders/.test(gw), 'route /orders to orders service');
check('gateway has aggregated /health', /\/health/.test(gw), 'expose aggregated /health across services');

const orchestrator = readIf('index.js');
check('orchestrator exists', !!orchestrator, 'create the orchestrator (index.js)');
check('orchestrator starts all services', /authService\.start\(\)/.test(orchestrator) && /gateway\.start\(\)/.test(orchestrator), 'start every service with one command');

// --- Project 2: CI/CD (core) ---
const workflow = readIf('.github/workflows/quality.yml');
check('.github/workflows/quality.yml exists', !!workflow, 'create the CI workflow');
check('workflow validates standards', /standards\/validate/.test(workflow), 'run the standards validator in CI');
check('workflow blocks below score threshold', /score < 80|exit 1/.test(workflow), 'fail the build when the score is too low');
check('workflow comments the score on PRs', /issues\.(list|create|update)Comment|github-script/.test(workflow), 'post the score back to the PR');

// --- Project 3: Prove the full system (core, the heart) ---
check('system.test.js exists', exists('system.test.js'), 'create the end-to-end system test');

let e2eOk = false;
try {
  execFileSync('node', ['--test', '--test-force-exit', path.join(root, 'system.test.js')], {
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  e2eOk = true;
} catch {
  e2eOk = false;
}
check('full system e2e test passes', e2eOk, 'run node --test system.test.js — the whole system must work end-to-end');

// --- Project 4: System retrospective (stretch) ---
const retro = readIf('project-10-retrospective.md');
if (!retro) {
  console.log('⚠️  Project 4 (retrospective) notes not found — stretch goal, not blocking.\n');
}

console.log(checks.length + ' checks run, ' + (checks.length - failures.length) + ' passed, ' + failures.length + ' failed.\n');

if (failures.length > 0) {
  console.log('❌ Missing:');
  for (const f of failures) console.log(`  - ${f}`);
  console.log('\nFix these, then re-run: node verify.js');
  process.exit(1);
}

console.log('✅ All core checks pass. Quality is up to you — see the self-review in docs/level-10-full-system.md.');
