#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const secretsDetector = require('./detectors/secrets');
const injectionDetector = require('./detectors/injection');
const dependenciesDetector = require('./detectors/dependencies');
const aiAnalyzer = require('./ai-analyzer');

// --- Argumentos ---
const args = process.argv.slice(2);
const pathIndex = args.indexOf('--path');
const outputIndex = args.indexOf('--output');
const useAI = args.includes('--ai');

const projectRoot = pathIndex !== -1 && args[pathIndex + 1]
  ? path.resolve(args[pathIndex + 1])
  : process.cwd();

const outputPath = outputIndex !== -1 && args[outputIndex + 1]
  ? path.resolve(args[outputIndex + 1])
  : path.join(projectRoot, 'security-audit.md');

if (!fs.existsSync(projectRoot)) {
  console.error(`Error: ruta no encontrada: ${projectRoot}`);
  process.exit(1);
}

console.log(`🔍 Escaneando: ${projectRoot}`);
console.log('');

// --- Ejecutar detectores ---
console.log('  Detectando secrets hardcodeados...');
const secrets = secretsDetector.scan(projectRoot);
console.log(`    → ${secrets.length} hallazgo(s)`);

console.log('  Detectando SQL injection y XSS...');
const injections = injectionDetector.scan(projectRoot);
console.log(`    → ${injections.length} hallazgo(s)`);

console.log('  Detectando dependencias vulnerables...');
const dependencies = dependenciesDetector.scan(projectRoot);
console.log(`    → ${dependencies.length} hallazgo(s)`);

// --- Análisis con IA ---
let analysis = null;
if (useAI) {
  console.log('  Analizando con IA (simulado)...');
  analysis = aiAnalyzer.analyze({ secrets, injections, dependencies }, projectRoot);
  console.log(`    → Puntaje: ${analysis.score}/10`);
  console.log(`    → Falsos positivos detectados: ${analysis.summary.falsePositives}`);
}

// --- Generar reporte ---
const allFindings = analysis ? analysis.findings : [
  ...secrets.map((s) => ({ ...s, severity: 'high', isFalsePositive: false, remediation: 'Revisar manualmente' })),
  ...injections.map((i) => ({ ...i, severity: i.risk, isFalsePositive: false, remediation: 'Revisar manualmente' })),
  ...dependencies.map((d) => ({ ...d, severity: d.severity, isFalsePositive: false, remediation: `Actualizar a ${d.fixedIn}` })),
];

const realFindings = allFindings.filter((f) => !f.isFalsePositive);
const fpFindings = allFindings.filter((f) => f.isFalsePositive);

const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
const sortedFindings = [...realFindings].sort((a, b) => (severityOrder[a.severity] || 99) - (severityOrder[b.severity] || 99));

const criticalCount = realFindings.filter((f) => f.severity === 'critical').length;
const highCount = realFindings.filter((f) => f.severity === 'high').length;
const mediumCount = realFindings.filter((f) => f.severity === 'medium').length;
const lowCount = realFindings.filter((f) => f.severity === 'low').length;

const severityIcon = (s) => ({ critical: '🔴', high: '🟠', medium: '🟡', low: '🟢' }[s] || '⚪');

let report = `# Security Audit Report

## Resumen Ejecutivo

${analysis ? `**Puntaje general:** ${analysis.score}/10` : '**Puntaje general:** — (ejecutar con --ai para análisis completo)'}

| Métrica | Valor |
|---------|-------|
| Total hallazgos | ${allFindings.length} |
| Falsos positivos | ${fpFindings.length} |
| Críticos | ${criticalCount} |
| Altos | ${highCount} |
| Medios | ${mediumCount} |
| Bajos | ${lowCount} |

## Hallazgos por Categoría

### Secrets Hardcodeados (${secrets.length})
${secrets.length === 0 ? '- Ninguno detectado.' : ''}
${secrets.map((s) => {
  const fp = allFindings.find((f) => f.file === s.file && f.line === s.line && f.type === s.type);
  const tag = fp?.isFalsePositive ? ' [FP]' : '';
  return `- ${severityIcon(fp?.severity || 'high')} \`${path.relative(projectRoot, s.file)}\`:${s.line} — **${s.type}** — \`${s.secret}\`${tag}`;
}).join('\n')}

### SQL Injection y XSS (${injections.length})
${injections.length === 0 ? '- Ninguno detectado.' : ''}
${injections.map((s) => {
  const fp = allFindings.find((f) => f.file === s.file && f.line === s.line && f.type === s.type);
  const tag = fp?.isFalsePositive ? ' [FP]' : '';
  return `- ${severityIcon(fp?.severity || s.risk)} \`${path.relative(projectRoot, s.file)}\`:${s.line} — **${s.type}** — \`${s.snippet}\`${tag}`;
}).join('\n')}

### Dependencias Vulnerables (${dependencies.length})
${dependencies.length === 0 ? '- Ninguna detectada.' : ''}
${dependencies.map((d) => {
  const fp = allFindings.find((f) => f.package === d.package);
  const tag = fp?.isFalsePositive ? ' [FP]' : '';
  return `- ${severityIcon(d.severity)} **${d.package}** ${d.installed} → ${d.cve} (${d.description})${tag}`;
}).join('\n')}

${analysis ? `## Análisis Detallado

| # | Archivo | Línea | Tipo | Severidad | Descripción | Remedio |
|---|---------|-------|------|-----------|-------------|---------|
${sortedFindings.map((f, i) => {
  const file = f.file ? path.relative(projectRoot, f.file) : f.package || '—';
  const line = f.line || '—';
  const type = f.type || 'dependency';
  const desc = f.description || f.secret || f.snippet || f.cve || '—';
  const remedy = f.remediation || 'Revisar manualmente';
  return `| ${i + 1} | ${file} | ${line} | ${type} | ${severityIcon(f.severity)} ${f.severity} | ${desc} | ${remedy} |`;
}).join('\n')}

## Falsos Positivos Detectados

${fpFindings.length === 0 ? 'No se detectaron falsos positivos.' : fpFindings.map((f) => {
  const file = f.file ? path.relative(projectRoot, f.file) : '—';
  return `- \`${file}\`:${f.line} — ${f.falsePositiveReason}`;
}).join('\n')}

## Recomendaciones Priorizadas

${sortedFindings.filter((f) => f.severity === 'critical' || f.severity === 'high').length === 0 ? 'No hay recomendaciones críticas o altas.' : sortedFindings
  .filter((f) => f.severity === 'critical' || f.severity === 'high')
  .map((f, i) => {
    const file = f.file ? path.relative(projectRoot, f.file) : f.package || '—';
    return `${i + 1}. **${f.severity.toUpperCase()}** — ${file}:${f.line || '—'} — ${f.remediation}`;
  }).join('\n')}
` : ''}

---

*Reporte generado el ${new Date().toISOString().split('T')[0]} por security-audit*
`;

fs.writeFileSync(outputPath, report, 'utf-8');
console.log(`\n✅ Reporte generado: ${outputPath}`);
