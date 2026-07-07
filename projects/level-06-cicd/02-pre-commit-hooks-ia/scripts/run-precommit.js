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
 * @param {string} command Comando a ejecutar.
 * @param {string[]} [args=[]] Argumentos del comando.
 * @param {string} [cwd=projectRoot] Directorio de trabajo.
 * @param {'inherit' | 'pipe'} [stdio='pipe'] Modo de salida del proceso.
 * @returns {Promise<{stdout: string, stderr: string, exitCode: number}>} Resultado del comando.
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
 * @param {string} [cwd=projectRoot] Directorio del proyecto.
 * @returns {Promise<string[]>} Archivos staged.
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
 * @param {string} [cwd=projectRoot] Directorio del proyecto.
 * @returns {Promise<void>} Promesa que resuelve cuando finaliza la ejecución.
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
 * @param {string[]} files Archivos a validar.
 * @param {string} [cwd=projectRoot] Directorio del proyecto.
 * @returns {Promise<void>} Promesa que resuelve cuando finaliza la validación.
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
 * @returns {Promise<void>} Promesa que resuelve cuando finaliza el flujo.
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