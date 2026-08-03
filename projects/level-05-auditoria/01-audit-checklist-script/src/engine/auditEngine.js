import fs from 'node:fs'
import path from 'node:path'

import { getDetectors } from '../detectors/index.js'

/**
 * @typedef {Object} AuditIssue
 * @property {string} file - Ruta relativa del archivo con el hallazgo
 * @property {number} line - Número de línea (1-based)
 * @property {string} category - Categoría del detector (Seguridad, Performance, Calidad)
 * @property {'high'|'medium'|'low'} severity - Severidad del hallazgo
 * @property {string} detectorId - Identificador del detector
 * @property {string} message - Descripción corta del problema
 * @property {string} recommendation - Acción recomendada para corregirlo
 */

/**
 * @typedef {Object} AuditSummary
 * @property {number} total - Total de hallazgos
 * @property {{ high: number, medium: number, low: number }} bySeverity - Hallazgos agrupados por severidad
 * @property {Record<string, number>} byCategory - Hallazgos agrupados por categoría
 */

/**
 * Ejecuta todos los detectores sobre una lista de archivos.
 *
 * Lee cada archivo línea por línea y aplica todos los detectores registrados.
 * Los hallazgos se devuelven con ruta relativa respecto a `basePath`.
 *
 * @param {string[]} filePaths - Lista de rutas absolutas de archivos a auditar
 * @param {string} basePath - Ruta base para calcular rutas relativas en el reporte
 * @returns {{ issues: AuditIssue[], summary: AuditSummary }} Issues detectados y resumen
 *
 * @example
 * const files = scanFiles('/app/src');
 * const report = runAudit(files, '/app/src');
 * console.log(report.summary.total);
 */
export function runAudit(filePaths, basePath) {
  const detectors = getDetectors()
  const issues = []

  for (const filePath of filePaths) {
    const relativePath = path.relative(basePath, filePath)
    const content = fs.readFileSync(filePath, 'utf8')
    const lines = content.split(/\r?\n/)

    lines.forEach((line, index) => {
      const lineNumber = index + 1
      for (const detector of detectors) {
        if (detector.regex.test(line)) {
          issues.push({
            file: relativePath,
            line: lineNumber,
            category: detector.category,
            severity: detector.severity,
            detectorId: detector.id,
            message: detector.message,
            recommendation: detector.recommendation
          })
        }
      }
    })
  }

  return {
    issues,
    summary: buildSummary(issues)
  }
}

/**
 * Genera un resumen estadístico de los hallazgos.
 *
 * @param {AuditIssue[]} issues - Lista de issues detectados
 * @returns {AuditSummary} Resumen con totales por severidad y categoría
 */
function buildSummary(issues) {
  const total = issues.length
  const bySeverity = { high: 0, medium: 0, low: 0 }
  const byCategory = {}

  for (const issue of issues) {
    bySeverity[issue.severity] = (bySeverity[issue.severity] ?? 0) + 1
    byCategory[issue.category] = (byCategory[issue.category] ?? 0) + 1
  }

  return { total, bySeverity, byCategory }
}
