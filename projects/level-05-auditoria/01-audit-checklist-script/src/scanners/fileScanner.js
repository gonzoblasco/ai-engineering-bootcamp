import fs from 'node:fs'
import path from 'node:path'

import { CONFIG } from '../config.js'

/**
 * Indica si una ruta corresponde a un directorio que debe ignorarse.
 *
 * @param {string} dirPath - Ruta absoluta o relativa del directorio
 * @returns {boolean} `true` si el directorio está en la lista de ignorados
 */
function shouldIgnoreDirectory(dirPath) {
  const baseName = path.basename(dirPath)
  return CONFIG.ignoreDirs.includes(baseName)
}

/**
 * Indica si un archivo debe ser analizado según su extensión.
 *
 * @param {string} filePath - Ruta del archivo
 * @returns {boolean} `true` si la extensión está incluida en la configuración
 */
function shouldIncludeFile(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  return CONFIG.includeExtensions.includes(ext)
}

/**
 * Recorre recursivamente un directorio y retorna los archivos auditables.
 *
 * Si `targetPath` es un archivo, retorna una lista con ese archivo si es auditorable.
 * Ignora los directorios definidos en `CONFIG.ignoreDirs` y filtra por extensiones.
 *
 * @param {string} targetPath - Ruta del archivo o directorio a escanear
 * @returns {string[]} Lista de rutas absolutas de archivos auditables
 * @throws {Error} Si la ruta no existe
 *
 * @example
 * const files = scanFiles('/app/src');
 * // ['/app/src/app.js', '/app/src/routes/user.js', ...]
 */
export function scanFiles(targetPath) {
  if (!fs.existsSync(targetPath)) {
    throw new Error(`La ruta no existe: ${targetPath}`)
  }

  const stats = fs.statSync(targetPath)
  if (stats.isFile()) {
    return shouldIncludeFile(targetPath) ? [targetPath] : []
  }

  const result = []
  const entries = fs.readdirSync(targetPath, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(targetPath, entry.name)
    if (entry.isDirectory()) {
      if (!shouldIgnoreDirectory(fullPath)) {
        result.push(...scanFiles(fullPath))
      }
    } else if (entry.isFile() && shouldIncludeFile(fullPath)) {
      result.push(fullPath)
    }
  }

  return result
}
