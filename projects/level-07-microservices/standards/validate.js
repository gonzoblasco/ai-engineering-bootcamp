#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function loadStandards(projectRoot) {
  const path = require('path');
  const standardsPath = path.join(projectRoot, 'standards', 'standards.json');
  if (!fs.existsSync(standardsPath)) {
    throw new Error(`standards.json no encontrado en ${standardsPath}`);
  }
  return JSON.parse(fs.readFileSync(standardsPath, 'utf-8'));
}

// --- Detector de secrets (básico, reutilizado del N5) ---
const SECRET_PATTERNS = [
  /(?:password|passwd|pwd)\s*[:=]\s*["'][^"'\s]{4,}["']/gi,
  /(?:api[_-]?key|apikey|api_key|token|secret)\s*[:=]\s*["'][^"'\s]{8,}["']/gi,
  /["']eyJ[a-zA-Z0-9_-]+\./g,
];

function scanForSecrets(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  const findings = [];

  for (let i = 0; i < lines.length; i++) {
    for (const pattern of SECRET_PATTERNS) {
      pattern.lastIndex = 0;
      if (pattern.test(lines[i])) {
        findings.push({ line: i + 1, message: 'Posible secret hardcodeado' });
      }
    }
  }

  return findings;
}

// --- Validar servicios ---
function checkServices(projectRoot, standards) {
  const required = standards.services.required;
  const details = [];

  for (const svc of required) {
    const svcDir = path.join(projectRoot, svc);
    const hasIndex = fs.existsSync(path.join(svcDir, 'index.js'));
    details.push({
      service: svc,
      exists: hasIndex,
      status: hasIndex ? 'pass' : 'fail',
      message: hasIndex ? `✓ ${svc} existe` : `✗ Falta ${svc}`,
    });
  }

  const allExist = details.every((d) => d.exists);
  return { name: 'services', status: allExist ? 'pass' : 'fail', details };
}

// --- Validar health checks ---
function checkHealthChecks(projectRoot, standards) {
  const healthPath = standards.services.healthCheckPath;
  const httpServices = standards.services.required.filter((s) => s !== 'notifications-service');
  const details = [];

  for (const svc of httpServices) {
    const indexPath = path.join(projectRoot, svc, 'index.js');
    let hasHealth = false;
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf-8');
      hasHealth = content.includes(`'${healthPath}'`) || content.includes(`"${healthPath}"`);
    }
    details.push({
      service: svc,
      hasHealth,
      status: hasHealth ? 'pass' : 'fail',
      message: hasHealth ? `✓ ${svc} tiene ${healthPath}` : `✗ ${svc} no tiene ${healthPath}`,
    });
  }

  const allOk = details.every((d) => d.hasHealth);
  return { name: 'health-check', status: allOk ? 'pass' : 'fail', details };
}

// --- Validar estilo ---
function checkStyle(projectRoot, standards) {
  const maxLine = standards.style.maxLineLength;
  const maxFnLines = standards.style.maxFunctionLines;
  const violations = [];
  const svcDirs = standards.services.required.filter((s) => s !== 'notifications-service');

  for (const svc of svcDirs) {
    const indexPath = path.join(projectRoot, svc, 'index.js');
    if (!fs.existsSync(indexPath)) continue;
    const lines = fs.readFileSync(indexPath, 'utf-8').split('\n');

    for (let i = 0; i < lines.length; i++) {
      if (lines[i].length > maxLine) {
        violations.push({
          standard: 'style',
          file: `${svc}/index.js`,
          line: i + 1,
          message: `Línea de ${lines[i].length} caracteres (max ${maxLine})`,
        });
      }
    }

    // Función grande: buscar bloques function/const con más de maxFnLines
    const content = lines.join('\n');
    const fnRegex = /(?:function\s+\w+|const\s+\w+\s*=\s*(?:async\s*)?\([^)]*\)\s*=>)\s*{/g;
    let match;
    while ((match = fnRegex.exec(content)) !== null) {
      const startLine = content.substring(0, match.index).split('\n').length;
      let depth = 1;
      let pos = match.index + match[0].length;
      while (pos < content.length && depth > 0) {
        if (content[pos] === '{') depth++;
        if (content[pos] === '}') depth--;
        pos++;
      }
      const fnLines = content.substring(0, pos).split('\n').length - startLine + 1;
      if (fnLines > maxFnLines) {
        violations.push({
          standard: 'style',
          file: `${svc}/index.js`,
          line: startLine,
          message: `Función de ${fnLines} líneas (max ${maxFnLines})`,
        });
      }
    }
  }

  return {
    name: 'style',
    status: violations.length === 0 ? 'pass' : 'fail',
    details: violations.length === 0
      ? [{ status: 'pass', message: `✓ No hay violaciones de estilo` }]
      : violations.map((v) => ({ status: 'fail', message: `${v.file}:${v.line} — ${v.message}`, violation: v })),
    violations,
  };
}

// --- Validar seguridad ---
function checkSecurity(projectRoot, standards) {
  const violations = [];
  const svcDirs = standards.services.required;

  for (const svc of svcDirs) {
    const indexPath = path.join(projectRoot, svc, 'index.js');
    if (!fs.existsSync(indexPath)) continue;
    const secrets = scanForSecrets(indexPath);
    for (const s of secrets) {
      violations.push({
        standard: 'security',
        file: `${svc}/index.js`,
        line: s.line,
        message: s.message,
      });
    }
  }

  return {
    name: 'security',
    status: violations.length === 0 ? 'pass' : 'fail',
    details: violations.length === 0
      ? [{ status: 'pass', message: '✓ No se detectaron secrets' }]
      : violations.map((v) => ({ status: 'fail', message: `${v.file}:${v.line} — ${v.message}`, violation: v })),
    violations,
  };
}

// --- Validar docs ---
function checkDocs(projectRoot, standards) {
  const details = [];

  for (const svc of standards.services.required) {
    const hasReadme = fs.existsSync(path.join(projectRoot, svc, 'README.md'));
    details.push({
      service: svc,
      hasReadme,
      status: hasReadme ? 'pass' : 'fail',
      message: hasReadme ? `✓ ${svc}/README.md existe` : `✗ Falta ${svc}/README.md`,
    });
  }

  const allOk = details.every((d) => d.hasReadme);
  return { name: 'docs', status: allOk ? 'pass' : 'fail', details };
}

// --- Validación principal ---
function validate(projectRoot, standards) {
  const checks = [
    checkServices(projectRoot, standards),
    checkHealthChecks(projectRoot, standards),
    checkStyle(projectRoot, standards),
    checkSecurity(projectRoot, standards),
    checkDocs(projectRoot, standards),
  ];

  const allViolations = checks.flatMap((c) => c.violations || []);

  // Score: cada check pesa igual, cada violación resta
  const passCount = checks.filter((c) => c.status === 'pass').length;
  const totalChecks = checks.length;
  const baseScore = (passCount / totalChecks) * 100;
  const penalty = Math.min(30, allViolations.length * 3);
  const score = Math.max(0, Math.round(baseScore - penalty));

  return {
    score,
    checks,
    violations: allViolations,
  };
}

// --- CLI entry ---
if (require.main === module) {
  const projectRoot = process.cwd();
  try {
    const standards = loadStandards(projectRoot);
    const result = validate(projectRoot, standards);

    console.log('=== Validación de Estándares ===\n');
    for (const check of result.checks) {
      const icon = check.status === 'pass' ? '✅' : check.status === 'warn' ? '⚠️' : '❌';
      console.log(`${icon} ${check.name} (${check.status.toUpperCase()})`);
      for (const d of check.details) {
        console.log(`   ${d.message}`);
      }
      console.log();
    }

    console.log(`Score: ${result.score}/100`);
    if (result.violations.length > 0) {
      console.log(`\nViolaciones (${result.violations.length}):`);
      for (const v of result.violations) {
        console.log(`  - [${v.standard}] ${v.file}:${v.line} — ${v.message}`);
      }
    } else {
      console.log('\nNo hay violaciones. 🎉');
    }
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

module.exports = { validate, loadStandards };
