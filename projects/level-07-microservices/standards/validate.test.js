#!/usr/bin/env node
/**
 * standards/validate.test.js — Prove the standards (Project 3)
 *
 * Run: node --test standards/validate.test.js
 *
 * Verifies that the standards validator actually detects violations:
 *   1. The GOOD system (the real N7/N8 codebase) passes with a high score
 *   2. A BROKEN fixture (deliberately violating standards) fails with a low score
 *   3. Each planted violation type (services, health-check, style, security, docs)
 *      is detected by the validator
 *
 * If a planted violation is NOT detected, your standards gate has a hole — the
 * standard is theory, not a gate.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('path');

const { validate, loadStandards } = require('./validate.js');

const goodRoot = path.join(__dirname, '..'); // el sistema real N7/N8
const brokenRoot = path.join(__dirname, 'fixtures', 'broken');

function checkStatus(result, name) {
  const c = result.checks.find((c) => c.name === name);
  return c ? c.status : null;
}

test('good system passes with high score', () => {
  const standards = loadStandards(goodRoot);
  const result = validate(goodRoot, standards);
  assert.ok(result.score >= 80, `el sistema bueno debería tener score >= 80, obtuvo ${result.score}`);
  assert.equal(checkStatus(result, 'services'), 'pass');
  assert.equal(checkStatus(result, 'docs'), 'pass');
});

test('broken fixture fails with low score', () => {
  const standards = loadStandards(brokenRoot);
  const result = validate(brokenRoot, standards);
  assert.ok(result.score < 60, `el fixture roto debería tener score < 60, obtuvo ${result.score}`);
  assert.ok(result.violations.length > 0, 'el fixture roto debería reportar violaciones');
});

test('broken fixture violates services (missing notifications-service)', () => {
  const standards = loadStandards(brokenRoot);
  const result = validate(brokenRoot, standards);
  assert.equal(checkStatus(result, 'services'), 'fail', 'services debería fallar por un servicio requerido ausente');
});

test('broken fixture violates health-check (no /health endpoint)', () => {
  const standards = loadStandards(brokenRoot);
  const result = validate(brokenRoot, standards);
  assert.equal(checkStatus(result, 'health-check'), 'fail', 'health-check debería fallar');
});

test('broken fixture violates style (long lines)', () => {
  const standards = loadStandards(brokenRoot);
  const result = validate(brokenRoot, standards);
  const styleVios = result.violations.filter((v) => v.standard === 'style');
  assert.ok(styleVios.length > 0, 'debería haber violaciones de style (líneas largas)');
});

test('broken fixture violates security (hardcoded secret)', () => {
  const standards = loadStandards(brokenRoot);
  const result = validate(brokenRoot, standards);
  const secVios = result.violations.filter((v) => v.standard === 'security');
  assert.ok(secVios.length > 0, 'debería haber violaciones de security (secret hardcodeado)');
});

test('broken fixture violates docs (missing README)', () => {
  const standards = loadStandards(brokenRoot);
  const result = validate(brokenRoot, standards);
  assert.equal(checkStatus(result, 'docs'), 'fail', 'docs debería fallar por READMEs faltantes');
});
