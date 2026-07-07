import fs from 'node:fs'
import path from 'node:path'

import { scanFiles } from './scanners/fileScanner.js'
import { runAudit } from './engine/auditEngine.js'
import { printConsoleReport } from './reporters/consoleReporter.js'
import { writeJsonReport } from './reporters/jsonReporter.js'

/**
 * Muestra la ayuda de uso del script en consola.
 *
 * @returns {void}
 */
function printHelp() {
  console.log(`
Uso: node src/audit.js <ruta> [opciones]

Opciones:
  --format=console|json   Formato del reporte (default: console)
  --output=<ruta>         Ruta del archivo JSON cuando format=json
  --help                  Muestra esta ayuda

Ejemplos:
  node src/audit.js ../level-03-workflows/01-sistema-auth-jwt/src
  node src/audit.js ../level-03-workflows/02-crud-template/src --format=json --output=report.json
`)
}

/**
 * Parsea los argumentos de la CLI.
 *
 * @returns {{ target: string, format: string, output?: string }} Configuración de ejecución
 */
function parseArgs() {
  const args = process.argv.slice(2)

  if (args.includes('--help') || args.length === 0) {
    printHelp()
    process.exit(args.includes('--help') ? 0 : 1)
  }

  const target = args.find(arg => !arg.startsWith('--'))
  if (!target) {
    console.error('❌ Debes indicar una ruta de archivo o directorio')
    printHelp()
    process.exit(1)
  }

  const formatArg = args.find(arg => arg.startsWith('--format='))
  const outputArg = args.find(arg => arg.startsWith('--output='))

  return {
    target,
    format: formatArg?.split('=')[1] || 'console',
    output: outputArg?.split('=')[1]
  }
}

/**
 * Punto de entrada del scanner de auditoría.
 *
 * Resuelve la ruta objetivo desde el directorio de trabajo actual, escanea los archivos,
 * ejecuta los detectores y escribe el reporte en el formato solicitado.
 *
 * @returns {void}
 */
function main() {
  const { target, format, output } = parseArgs()
  const resolvedTarget = path.resolve(process.cwd(), target)

  if (!fs.existsSync(resolvedTarget)) {
    console.error(`❌ La ruta no existe: ${resolvedTarget}`)
    process.exit(1)
  }

  const files = scanFiles(resolvedTarget)
  const report = runAudit(files, resolvedTarget)

  if (format === 'json') {
    const outputPath = output || 'audit-report.json'
    writeJsonReport(report, outputPath)
    console.log(`✅ Reporte JSON guardado en ${outputPath}`)
  } else {
    printConsoleReport(report)
  }
}

main()
