#!/usr/bin/env node
/**
 * verify.js — Level 5 auto-check
 *
 * Same template as Levels 1-4: confirms EFFORT (files + evidence), not quality.
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

console.log('\n🔍 Level 5 verification\n');

// --- Security CLI (existing solved project) ---
const cliDir = 'security-cli';
check('security-cli/ exists', exists(cliDir), 'create a security-cli folder');
const detectors = walk(path.join(cliDir, 'detectors'), (p) => p.endsWith('.js'));
check('has at least 2 detectors', detectors.length >= 2, `found ${detectors.length}; create at least 2 detectors`);
const aiAnalyzer = readIf(path.join(cliDir, 'ai-analyzer.js'));
check('has ai-analyzer.js', !!aiAnalyzer, 'create ai-analyzer.js');
check('ai-analyzer assigns severity', /sever|score|risk/i.test(aiAnalyzer), 'assign consolidated severity');
check('ai-analyzer detects false positives', /false.?positive|test|fixtures|mock/i.test(aiAnalyzer), 'detect likely false positives');

// --- Exercise 6: exploit lab (core) ---
// Look for exploit evidence anywhere in the project folder.
const exploitFiles = walk(root, (p) => /exploit|payload/i.test(path.basename(p)));
const exploitNotes = readIf('project-6-exploit-notes.md');
check('exploit lab exists', exploitFiles.length > 0 || !!exploitNotes, 'write an exploit (exploit.js/curl) or project-6-exploit-notes.md');
// exploitFiles holds ABSOLUTE paths (from walk), so read them directly.
const exploitSrc =
  exploitFiles
    .map((p) => {
      try {
        return fs.readFileSync(p, 'utf8');
      } catch {
        return '';
      }
    })
    .join(' ') + ' ' + exploitNotes;
if (exploitFiles.length || exploitNotes) {
  check('exploit has a prediction', /predict|expected|expect|payload|hypothes/i.test(exploitSrc), 'document your prediction before running');
  check('exploit targets a real vuln', /injection|' OR '|xss|script|password|secret|token/i.test(exploitSrc), 'target SQLi/XSS/secrets');
  check('exploit notes cover remediation', /fix|remedi|patch|no longer|after/i.test(exploitSrc + ' ' + readIf('project-6-exploit-notes.md')), 'confirm the fix neutralized the exploit');
}

// --- Exercise 7: false positive hunt (stretch — not blocking) ---
const fpNotes = readIf('project-7-false-positives.md');
if (!fpNotes) {
  console.log('⚠️  Exercise 7 (false positive hunt) notes not found — stretch goal, not blocking.');
} else {
  check('project-7-false-positives.md exists', true);
  check('FP notes list causes', /false|why|reason|innocent|cause/i.test(fpNotes), 'record each false positive with its cause');
  check('FP notes show a fix', /adjust|fix|reduc|elimin|removed/i.test(fpNotes), 'show you reduced at least one false positive');
}

// --- Summary ---
console.log(`\n${checks.length} checks run, ${checks.length - failures.length} passed, ${failures.length} failed.\n`);
if (failures.length) {
  console.log('❌ Missing:');
  failures.forEach((f) => console.log(`  - ${f}`));
  console.log('\nFix these, then re-run: node verify.js');
  process.exit(1);
}
console.log('✅ All core checks pass. Quality is up to you — see the self-review in docs/level-05-security-audit.md.\n');
