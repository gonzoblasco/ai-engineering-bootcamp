import { severityLabel } from '../config.js'

/**
 * Imprime el reporte de auditoría en consola de forma legible.
 *
 * Muestra totales por severidad, agrupa los hallazgos por archivo e incluye
 * una recomendación para cada issue detectado.
 *
 * @param {{ issues: import('../engine/auditEngine.js').AuditIssue[], summary: import('../engine/auditEngine.js').AuditSummary }} report - Reporte generado por `runAudit`
 * @returns {void}
 *
 * @example
 * const report = runAudit(files, basePath);
 * printConsoleReport(report);
 */
export function printConsoleReport(report) {
  const { issues, summary } = report

  console.log('\n🔍 Reporte de auditoría de código\n')
  console.log(`Total de hallazgos: ${summary.total}`)
  console.log(`  ${severityLabel('high')}: ${summary.bySeverity.high}`)
  console.log(`  ${severityLabel('medium')}: ${summary.bySeverity.medium}`)
  console.log(`  ${severityLabel('low')}: ${summary.bySeverity.low}`)
  console.log('')

  if (issues.length === 0) {
    console.log('✅ No se detectaron patrones de riesgo.')
    return
  }

  const grouped = groupByFile(issues)

  for (const [file, fileIssues] of Object.entries(grouped)) {
    console.log(`📁 ${file}`)
    for (const issue of fileIssues) {
      const badge = severityBadge(issue.severity)
      console.log(`   ${badge} L${issue.line} [${issue.category}] ${issue.message}`)
      console.log(`      → ${issue.recommendation}`)
    }
    console.log('')
  }

  console.log('\n📊 Resumen por categoría')
  for (const [category, count] of Object.entries(summary.byCategory)) {
    console.log(`   ${category}: ${count}`)
  }
}

/**
 * Agrupa los issues por archivo.
 *
 * @param {import('../engine/auditEngine.js').AuditIssue[]} issues - Lista de hallazgos
 * @returns {Record<string, import('../engine/auditEngine.js').AuditIssue[]>} Issues indexados por ruta de archivo
 */
function groupByFile(issues) {
  return issues.reduce((acc, issue) => {
    if (!acc[issue.file]) {
      acc[issue.file] = []
    }
    acc[issue.file].push(issue)
    return acc
  }, {})
}

/**
 * Retorna un badge visual según la severidad.
 *
 * @param {'high'|'medium'|'low'} severity - Severidad del hallazgo
 * @returns {string} Emoji representativo de la severidad
 */
function severityBadge(severity) {
  const labels = {
    high: '🔴',
    medium: '🟡',
    low: '🟢'
  }
  return labels[severity] ?? '⚪'
}
