const path = require('path');

function analyze(results, projectRoot) {
  const { secrets, injections, dependencies } = results;
  const allFindings = [...secrets, ...injections, ...dependencies];
  const enhanced = [];

  // Group by file for context analysis
  const byFile = {};
  for (const f of allFindings) {
    const filePath = f.file || projectRoot;
    if (!byFile[filePath]) byFile[filePath] = [];
    byFile[filePath].push(f);
  }

  for (const finding of allFindings) {
    let severity = finding.severity || finding.risk || 'medium';
    let isFalsePositive = false;
    let falsePositiveReason = '';

    // --- False positive detection ---

    // Secrets in test files
    if (finding.type === 'password' || finding.type === 'api-key') {
      const filePath = finding.file || '';
      if (/__tests__|\.test\.|\.spec\.|\.test\.|test-|fixtures?|mock/i.test(filePath)) {
        isFalsePositive = true;
        falsePositiveReason = 'Archivo de test — probablemente un valor de prueba';
      }
    }

    // SQL injection in files that don't import DB libraries
    if (finding.type === 'sql-injection') {
      const filePath = finding.file || '';
      let fileContent = '';
      try {
        const fs = require('fs');
        fileContent = fs.readFileSync(filePath, 'utf-8');
      } catch {}
      const hasDbImport = /require\s*\(\s*['"](?:sqlite|mysql|pg|knex|prisma|sequelize|typeorm|mongo|mongoose)/i.test(fileContent);
      if (!hasDbImport) {
        isFalsePositive = true;
        falsePositiveReason = 'El archivo no importa librerías de base de datos';
      }
    }

    // XSS in non-UI files
    if (finding.type === 'xss') {
      const filePath = finding.file || '';
      const isUIFile = /\.(jsx|tsx|vue)$/.test(filePath) || /react|vue|angular|svelte/i.test(filePath);
      if (!isUIFile) {
        isFalsePositive = true;
        falsePositiveReason = 'El archivo no parece ser un componente de UI';
      }
    }

    // --- Severity escalation ---
    // If same file has multiple findings of same type, escalate
    const filePath = finding.file || projectRoot;
    const sameFileFindings = byFile[filePath] || [];
    const sameTypeCount = sameFileFindings.filter((f) => f.type === finding.type).length;
    if (sameTypeCount >= 3 && severity !== 'high') {
      severity = severity === 'medium' ? 'high' : 'critical';
    }

    // --- Remediation ---
    const remediation = getRemediation(finding);

    enhanced.push({
      ...finding,
      severity,
      isFalsePositive,
      falsePositiveReason,
      remediation,
    });
  }

  // --- Score ---
  const realFindings = enhanced.filter((f) => !f.isFalsePositive);
  const criticalCount = realFindings.filter((f) => f.severity === 'critical').length;
  const highCount = realFindings.filter((f) => f.severity === 'high').length;
  const mediumCount = realFindings.filter((f) => f.severity === 'medium').length;
  const lowCount = realFindings.filter((f) => f.severity === 'low').length;

  const score = Math.max(1, Math.min(10,
    Math.round(10 - (criticalCount * 3 + highCount * 1.5 + mediumCount * 0.5 + lowCount * 0.2))
  ));

  return {
    score,
    summary: {
      total: allFindings.length,
      falsePositives: allFindings.length - realFindings.length,
      critical: criticalCount,
      high: highCount,
      medium: mediumCount,
      low: lowCount,
    },
    findings: enhanced,
  };
}

function getRemediation(finding) {
  const remediations = {
    'password': 'Reemplazar por variable de entorno. Usar dotenv o secrets manager.',
    'api-key': 'Mover a .env y usar process.env. Rotar la clave actual.',
    'jwt-token': 'Nunca hardcodear tokens JWT. Usar variables de entorno o un servicio de secrets.',
    'private-key': '¡URGENTE! Rotar la clave inmediatamente. Usar un HSM o secrets manager.',
    'url-credentials': 'Usar autenticación por token o headers en vez de URL. Nunca exponer credenciales en URLs.',
    'sql-injection': 'Usar parameterized queries o prepared statements. Nunca concatenar strings en SQL.',
    'xss': 'Usar textContent en vez de innerHTML. Si necesitás HTML, sanitizarlo con DOMPurify.',
  };

  return remediations[finding.type] || 'Revisar manualmente y aplicar mejores prácticas de seguridad.';
}

module.exports = { analyze };
