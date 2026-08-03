#!/usr/bin/env node
/**
 * test-gate.js — Prove the CI gate (Project 3)
 *
 * Runs the analyze-pr gate against two fixtures and verifies:
 *   - bad.diff  -> --gate MUST exit non-zero (blocks the merge)
 *   - good.diff -> --gate MUST exit zero (lets the merge through)
 *
 * If either case violates its expectation, this script fails. This is the
 * test that proves your pipeline is a real gate, not a painted door.
 *
 * Run: node scripts/test-gate.js
 * Exit 0 = both cases behave as expected. Non-zero = the gate is broken.
 */
const { execFileSync } = require('child_process');
const path = require('path');

const script = path.join(__dirname, 'analyze-pr.js');
const badDiff = path.join(__dirname, '..', 'fixtures', 'bad.diff');
const goodDiff = path.join(__dirname, '..', 'fixtures', 'good.diff');

const failures = [];
const checks = [];

function run(diff, expectBlock) {
  const label = expectBlock ? 'MUST block (exit != 0)' : 'MUST pass (exit == 0)';
  const name = path.basename(diff);
  checks.push(`${name} ${label}`);

  let exitCode = 0;
  let output = '';
  try {
    output = execFileSync('node', [script, '--diff', diff, '--gate'], {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (err) {
    exitCode = err.status === undefined ? 1 : err.status;
    output = err.stdout ? String(err.stdout) : '';
  }

  const blocked = exitCode !== 0;
  let parsed = null;
  try {
    parsed = JSON.parse(output.split('\n').filter((l) => l.trim().startsWith('{')).join('\n'));
  } catch {
    parsed = null;
  }

  const reason = parsed && parsed.gate ? parsed.gate.reasons.join('; ') : '(no gate info)';

  if (expectBlock && !blocked) {
    failures.push(`${name}: expected the gate to BLOCK (exit != 0) but it passed. The gate is not blocking bad code.`);
  } else if (!expectBlock && blocked) {
    failures.push(`${name}: expected the gate to PASS (exit == 0) but it blocked: ${reason}. The gate is rejecting good code.`);
  }

  console.log(`${blocked ? '⛔ blocked' : '✅ passed'}  ${name}  ${label}`);
  if (parsed && parsed.findings) {
    console.log(`     findings: ${parsed.findings.length} (high: ${parsed.findings.filter((f) => f.severity === 'high').length})`);
  }
}

console.log('\n🔒 Prove the CI gate\n');
run(badDiff, true);
run(goodDiff, false);

console.log(`\n${checks.length} gate checks, ${checks.length - failures.length} passed, ${failures.length} failed.\n`);

if (failures.length > 0) {
  console.error('❌ The gate is not trustworthy:');
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}

console.log('✅ The gate blocks bad code and lets good code through. You can trust it.');
