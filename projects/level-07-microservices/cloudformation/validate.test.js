#!/usr/bin/env node
/**
 * validate.test.js — Prove the validator (Project 3)
 *
 * Run: node --test cloudformation/validate.test.js
 *
 * Verifies that the CloudFormation validator detects broken templates and
 * reports the RIGHT defect for each fixture:
 *   - critical defects -> must BLOCK (exit != 0)
 *   - high defects     -> must be REPORTED (found in output) even though
 *                         the validator warns instead of hard-failing
 *   - good template    -> must pass (exit 0, no findings)
 *
 * If a broken fixture's defect is NOT reported, your IaC gate has a hole —
 * and you just found it before production did.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const { execFileSync } = require('child_process');
const path = require('path');

const validateJs = path.join(__dirname, 'validate.js');

// Runs validate.js against a template and returns { exitCode, output }.
function runValidator(templatePath) {
  let exitCode = 0;
  let output = '';
  try {
    output = execFileSync('node', [validateJs, '--template', templatePath], {
      encoding: 'utf-8',
      stdio: ['ignore', 'pipe', 'pipe'],
    });
  } catch (err) {
    exitCode = err.status === undefined ? 1 : err.status;
    output = err.stdout ? String(err.stdout) : '';
  }
  return { exitCode, output };
}

function fixture(name) {
  return path.join(__dirname, 'fixtures', name);
}

// Critical defects must both be reported AND block the deploy (exit != 0).
const blockingCases = [
  { fixture: 'port-mismatch.yml', defect: 'port-mismatch', desc: 'users task en puerto 3002 en vez de 3001' },
  { fixture: 'missing-listener.yml', defect: 'missing-listener', desc: 'ALB sin Listener' },
];

for (const c of blockingCases) {
  test(`${c.fixture} must BLOCK (exit != 0) and report '${c.defect}'`, () => {
    const { exitCode, output } = runValidator(fixture(c.fixture));
    assert.notEqual(exitCode, 0, `esperaba exit != 0 para ${c.fixture}, obtuve ${exitCode}`);
    assert.ok(output.includes(c.defect), `esperaba hallazgo '${c.defect}' en el output de ${c.fixture}`);
  });
}

// High defects must be REPORTED, even though the validator warns (exit 0).
const reportedCases = [
  { fixture: 'missing-health-check.yml', defect: 'missing-health-check', desc: 'target groups sin HealthCheckPath' },
  { fixture: 'exposed-port.yml', defect: 'exposed-port', desc: 'security group expuesto a 0.0.0.0/0' },
];

for (const c of reportedCases) {
  test(`${c.fixture} must report '${c.defect}' (${c.desc})`, () => {
    const { output } = runValidator(fixture(c.fixture));
    assert.ok(output.includes(c.defect), `esperaba hallazgo '${c.defect}' en el output de ${c.fixture}`);
  });
}

test('good template must PASS validation with no findings', () => {
  const good = path.join(__dirname, 'template.yml');
  const { exitCode, output } = runValidator(good);
  assert.equal(exitCode, 0, `el template bueno debería validar (exit 0), obtuve ${exitCode}`);
  assert.ok(!/missing|mismatch|exposed|sin Listener/i.test(output), 'el template bueno no debería reportar defectos');
});
