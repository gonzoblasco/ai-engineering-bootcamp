#!/usr/bin/env node
/**
 * verify.js — Level 7 auto-check
 *
 * Same template as Levels 1-6: confirms EFFORT (files + evidence), not quality.
 * Quality is judged by the learner against the rubric in the level doc.
 *
 * This is the physical core level for N7-N10 (ADR-001), so this verify focuses
 * on the N7 projects (services + event bus + contract + flow test). The N8-N10
 * additions (docker, cloud, standards, gateway) are covered by their own docs.
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

console.log('\n🔍 Level 7 verification\n');

// --- Project 1: two-service system (core) ---
const bus = readIf('event-bus/index.js');
const usersSvc = readIf('users-service/index.js');
const notifSvc = readIf('notifications-service/index.js');
check('event-bus/index.js exists', !!bus, 'create the event bus');
check('event bus isolates failures (_safeCall)', /_safeCall|try|catch/i.test(bus), 'wrap handlers so a failure does not break the bus');
check('users-service/index.js exists', !!usersSvc, 'create the users service');
check('users service publishes user.created', /publish\('user\.created'|publish\(\"user\.created\"/i.test(usersSvc), 'publish user.created when a user is created');
check('notifications-service/index.js exists', !!notifSvc, 'create the notifications service');
check('notifications subscribes to user.created', /subscribe\('user\.created'|subscribe\(\"user\.created\"/i.test(notifSvc), 'subscribe to user.created to send the welcome email');

// --- Project 2: event-driven architecture (core) ---
const ordersSvc = readIf('orders-service/index.js');
check('orders-service/index.js exists', !!ordersSvc, 'create the orders service');
check('orders service publishes order.created', /publish\('order\.created'|publish\(\"order\.created\"/i.test(ordersSvc), 'publish order.created when an order is created');
check('orders reacts to user.deleted', /subscribe\('user\.deleted'|subscribe\(\"user\.deleted\"/i.test(ordersSvc), 'cancel orders when a user is deleted (event-driven)');

// --- Project 3: Prove the event flow (core) ---
const contract = readIf('event-contract.js');
const flowTest = readIf('event-flow.test.js');
check('event-contract.js exists', !!contract, 'declare the event contract as code');
check('contract lists required fields', /required|CONTRACT/i.test(contract), 'declare required payload fields per event');
check('event-flow.test.js exists', !!flowTest, 'create event-flow.test.js');
check('flow test checks delivery', /subscriber|received|deliver/i.test(flowTest), 'test that every subscriber receives the event');
check('flow test checks failure isolation', /throw|doesNotThrow|fail/i.test(flowTest), 'test that a throwing handler does not break the bus');

// Actually run the flow test (the proof, not just the files)
let flowOk = false;
try {
  execFileSync('node', ['--test', path.join(root, 'event-flow.test.js')], {
    encoding: 'utf-8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  flowOk = true;
} catch {
  flowOk = false;
}
check('event flow tests pass', flowOk, 'run node --test event-flow.test.js; delivery, isolation and contract must pass');

// --- Project 4: Audit the boundaries (stretch) ---
const audit = readIf('project-7-boundary-audit.md');
if (!audit) {
  console.log('⚠️  Project 4 (boundary audit) notes not found — stretch goal, not blocking.');
}

console.log(checks.length + ' checks run, ' + (checks.length - failures.length) + ' passed, ' + failures.length + ' failed.\n');

if (failures.length > 0) {
  console.log('❌ Missing:');
  for (const f of failures) console.log(`  - ${f}`);
  console.log('\nFix these, then re-run: node verify.js');
  process.exit(1);
}

console.log('✅ All core checks pass. Quality is up to you — see the self-review in docs/level-07-microservices.md.');
