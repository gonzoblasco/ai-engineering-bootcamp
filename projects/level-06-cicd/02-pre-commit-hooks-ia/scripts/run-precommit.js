#!/usr/bin/env node

import { spawn } from 'node:child_process'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')

/**
 * Ejecuta un comando de forma controlada y devuelve su resultado.
 *
 * Envuelve `child_process.spawn` en una promesa, capturando stdout y stderr.
 * Si el proceso termina con exitCode !== 0, rechaza la promesa.
 *
 * @param {string} command Comando a ejecutar (ej: 'git', 'npx').
 * @param {string[]} [args=[]] Argumentos del comando.
 * @param {string} [cwd=projectRoot] Directorio de trabajo.
 * @param {'inherit' | 'pipe'} [stdio='pipe'] Modo de salida del proceso.
 *   - `'pipe'`: captura stdout/stderr y los devuelve en la promesa.
 *   - `'inherit'`: muestra la salida directamente en la terminal.
 * @returns {Promise<{stdout: string, stderr: string, exitCode: number}>} Resultado del comando.
 * @throws {Error} Si el proceso termina con exitCode !== 0 o si falla al iniciarse.
 *
 * @example
 * const { stdout } = await runProcess('git', ['diff', '--cached', '--name-only'])
 * const files = stdout.trim().split('\n')
 */
export async function runProcess(command, args = [], cwd = projectRoot, stdio = 'pipe') {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: stdio === 'inherit' ? 'inherit' : ['ignore', 'pipe', 'pipe'],
      env: process.env
    })

    let stdout = ''
    let stderr = ''

    if (child.stdout) {
      child.stdout.on('data', (chunk) => {
        stdout += chunk.toString()
      })
    }

    if (child.stderr) {
      child.stderr.on('data', (chunk) => {
        stderr += chunk.toString()
      })
    }

    child.on('error', (error) => {
      reject(error)
    })

    child.on('close', (exitCode) => {
      if (exitCode !== 0) {
        reject(new Error(stderr.trim() || `El comando falló con exitCode ${exitCode}`))
        return
      }

      resolve({ stdout, stderr, exitCode: exitCode ?? 0 })
    })
  })
}

/**
 * Obtiene la lista de archivos staged en Git.
 *
 * Ejecuta `git diff --cached --name-only --diff-filter=ACMR` para obtener
 * solo los archivos añadidos, copiados, modificados o renombrados.
 *
 * @param {string} [cwd=projectRoot] Directorio del proyecto.
 * @returns {Promise<string[]>} Lista de rutas relativas de archivos staged.
 * @throws {Error} Si el comando git falla.
 *
 * @example
 * const files = await getStagedFiles()
 * // => ['src/app.js', 'README.md']
 */
export async function getStagedFiles(cwd = projectRoot) {
  const { stdout, exitCode } = await runProcess(
    'git',
    ['diff', '--cached', '--name-only', '--diff-filter=ACMR'],
    cwd
  )

  if (exitCode !== 0) {
    throw new Error('No se pudo obtener la lista de archivos staged')
  }

  return stdout
    .split('\n')
    .map((file) => file.trim())
    .filter(Boolean)
}

/**
 * Ejecuta lint-staged sobre los archivos staged.
 *
 * Usa `npx lint-staged` con las opciones:
 * - `--no-install`: no instala dependencias faltantes
 * - `--concurrent false`: ejecuta las tareas secuencialmente
 * - `--allow-empty`: no falla si no hay archivos que procesar
 *
 * @param {string} [cwd=projectRoot] Directorio del proyecto.
 * @returns {Promise<void>} Promesa que resuelve cuando finaliza la ejecución.
 * @throws {Error} Si lint-staged falla por un motivo distinto a "not found".
 *
 * @example
 * await runLintStaged()
 * // 🧹 Ejecutando lint-staged sobre los archivos staged...
 */
export async function runLintStaged(cwd = projectRoot) {
  console.log('🧹 Ejecutando lint-staged sobre los archivos staged...')

  const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx'

  try {
    await runProcess(
      npxCommand,
      ['--no-install', 'lint-staged', '--concurrent', 'false', '--allow-empty'],
      cwd,
      'inherit'
    )
  } catch (error) {
    if (error instanceof Error && error.message.includes('not found')) {
      console.warn('⚠️ lint-staged no está disponible. Se omitirá esta etapa.')
      return
    }

    throw error
  }
}

/**
 * Coordina la ejecución del script de validación con IA para los archivos entregados.
 *
 * Busca el script en `AI_VALIDATION_SCRIPT` (variable de entorno) o en
 * `scripts/validate-with-ia.js` por defecto. Si el script no existe, omite
 * esta etapa sin error.
 *
 * @param {string[]} files Archivos a validar.
 * @param {string} [cwd=projectRoot] Directorio del proyecto.
 * @returns {Promise<void>} Promesa que resuelve cuando finaliza la validación.
 *
 * @example
 * await runValidationWithAi(['src/app.js', 'src/utils.js'])
 * // 🤖 Ejecutando validación con IA...
 */
export async function runValidationWithAi(files, cwd = projectRoot) {
  const aiScriptPath =
    process.env.AI_VALIDATION_SCRIPT ?? path.join(cwd, 'scripts/validate-with-ia.js')

  if (!existsSync(aiScriptPath)) {
    console.log('ℹ️ No hay un script de validación con IA configurado. Se omite esta etapa.')
    return
  }

  console.log('🤖 Ejecutando validación con IA...')
  await runProcess(process.execPath, [aiScriptPath, '--files', ...files], cwd, 'inherit')
}

/**
 * Punto de entrada del hook de pre-commit.
 *
 * Flujo completo:
 * 1. Obtiene los archivos staged con `git diff --cached`
 * 2. Si no hay archivos, termina sin error
 * 3. Ejecuta lint-staged (Prettier + validación IA)
 * 4. Ejecuta validación adicional con IA sobre todos los archivos staged
 *
 * @returns {Promise<void>} Promesa que resuelve cuando finaliza el flujo.
 *
 * @example
 * // Ejecutado automáticamente por .husky/pre-commit
 * // node scripts/run-precommit.js
 * await main()
 */
export async function main() {
  const stagedFiles = await getStagedFiles(projectRoot)

  if (stagedFiles.length === 0) {
    console.log('ℹ️ No hay archivos staged para validar. Se omite el hook de pre-commit.')
    return
  }

  console.log(`🔎 Se encontraron ${stagedFiles.length} archivo(s) staged para validar.`)
  await runLintStaged(projectRoot)
  await runValidationWithAi(stagedFiles, projectRoot)
  console.log('✅ Validación previa al commit completada.')
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error('❌ La validación previa al commit falló.')
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
}