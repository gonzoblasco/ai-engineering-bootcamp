import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Configuración global del scanner de auditoría.
 * Define extensiones auditables, directorios ignorados, etiquetas de severidad y la raíz del proyecto.
 */
export const CONFIG = {
  /** @type {string[]} Extensiones de archivo que serán analizadas */
  includeExtensions: ['.js', '.ts', '.mjs', '.cjs', '.html', '.prisma', '.sql'],

  /** @type {string[]} Directorios que se ignorarán durante el escaneo */
  ignoreDirs: ['node_modules', '.git', 'coverage', 'dist', 'build', '.next', 'tmp'],

  /** @type {Record<string, string>} Severidades admitidas con su etiqueta legible */
  severities: {
    high: 'Alta',
    medium: 'Media',
    low: 'Baja'
  },

  /** @type {string} Raíz del proyecto para resolver rutas de salida relativas */
  projectRoot: path.resolve(__dirname, '..')
}

/**
 * Convierte una severidad interna en etiqueta legible.
 *
 * @param {string} severity - Identificador de severidad (`high`, `medium`, `low`)
 * @returns {string} Etiqueta legible o el valor original si no está mapeado
 *
 * @example
 * severityLabel('high'); // 'Alta'
 */
export function severityLabel(severity) {
  return CONFIG.severities[severity] ?? severity
}
