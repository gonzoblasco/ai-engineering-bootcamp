import fs from 'node:fs'
import path from 'node:path'

import { CONFIG } from '../config.js'

/**
 * Escribe el reporte de auditoría como JSON en disco.
 *
 * Si `outputPath` es relativo, se resuelve desde `CONFIG.projectRoot`.
 * Crea los directorios intermedios si no existen.
 *
 * @param {{ issues: import('../engine/auditEngine.js').AuditIssue[], summary: import('../engine/auditEngine.js').AuditSummary }} report - Reporte generado por `runAudit`
 * @param {string} outputPath - Ruta absoluta o relativa del archivo JSON de salida
 * @returns {void}
 *
 * @example
 * const report = runAudit(files, basePath);
 * writeJsonReport(report, 'report.json');
 */
export function writeJsonReport(report, outputPath) {
  const output = {
    generatedAt: new Date().toISOString(),
    tool: 'ai-code-audit',
    version: '1.0.0',
    summary: report.summary,
    issues: report.issues
  }

  const targetPath = path.isAbsolute(outputPath)
    ? outputPath
    : path.join(CONFIG.projectRoot, outputPath)

  fs.mkdirSync(path.dirname(targetPath), { recursive: true })
  fs.writeFileSync(targetPath, JSON.stringify(output, null, 2), 'utf8')
}
