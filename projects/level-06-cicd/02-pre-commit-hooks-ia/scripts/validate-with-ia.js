#!/usr/bin/env node

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { analyzeWithAI } from '../src/services/aiService.js'
import { AI_API_KEY } from '../src/config/env.js'

// ── Patrones regex como fallback cuando no hay API key ──────────────────────

const CRITICAL_PATTERNS = [
  {
    pattern: /\beval\s*\(/i,
    message: 'Se encontró uso de eval, lo que puede ejecutar código arbitrario',
    category: 'seguridad',
    severity: 'critical'
  },
  {
    pattern: /\bFunction\s*\(/i,
    message: 'Se encontró uso de Function, lo que puede introducir ejecución dinámica peligrosa',
    category: 'seguridad',
    severity: 'critical'
  },
  {
    pattern: /innerHTML|dangerouslySetInnerHTML/i,
    message: 'Se encontró manipulación directa del DOM, lo que puede provocar XSS',
    category: 'seguridad',
    severity: 'critical'
  },
  {
    pattern: /password\s*=\s*['"][^'"]+['"]/i,
    message: 'Se encontró un password hardcodeado',
    category: 'seguridad',
    severity: 'critical'
  },
  {
    pattern: /SELECT\s+.*FROM|INSERT\s+INTO|DELETE\s+FROM/i,
    message: 'Se detectó posible concatenación de consultas SQL',
    category: 'seguridad',
    severity: 'critical'
  }
]

const WARNING_PATTERNS = [
  {
    pattern: /\bvar\b/i,
    message: 'Se encontró uso de var; conviene usar const o let',
    category: 'convenciones',
    severity: 'warning'
  },
  {
    pattern: /console\.log\(/i,
    message: 'Se encontró console.log; considera quitarlo antes de entregar',
    category: 'bugs',
    severity: 'warning'
  },
  {
    pattern: /==\s*null|!=\s*null/i,
    message: 'Se encontró comparación con null usando == o !=; conviene usar === o !==',
    category: 'bugs',
    severity: 'warning'
  },
  {
    pattern: /TODO|FIXME/i,
    message: 'Se encontró un marcador TODO o FIXME que debería revisarse',
    category: 'convenciones',
    severity: 'warning'
  }
]

// ── Funciones helper ────────────────────────────────────────────────────────

/**
 * Lee el contenido de un archivo y devuelve su texto.
 *
 * @param {string} filePath Ruta del archivo a leer.
 * @returns {Promise<string>} Contenido del archivo en texto plano.
 * @throws {Error} Si el archivo no existe o no se puede leer.
 *
 * @example
 * const content = await readFileContent('./src/app.js')
 * console.log(content) // 'import express from "express"...'
 */
export async function readFileContent(filePath) {
  try {
    return await readFile(filePath, 'utf8')
  } catch (error) {
    throw new Error(`No se pudo leer ${filePath}: ${error.message}`)
  }
}

/**
 * Encuentra el número de línea asociado a una posición en el texto.
 *
 * Recorre las líneas acumulando su longitud hasta encontrar la línea
 * que contiene el índice dado.
 *
 * @param {string[]} lines Líneas del contenido.
 * @param {number} index Posición del texto (0-based).
 * @returns {number} Número de línea (1-based).
 *
 * @example
 * const lines = ['const x = 1', 'const y = 2']
 * findLineNumber(lines, 15) // => 2
 */
export function findLineNumber(lines, index) {
  let consumed = 0

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i]
    consumed += line.length + 1

    if (consumed > index) {
      return i + 1
    }
  }

  return lines.length
}

/**
 * Analiza el contenido de un archivo usando patrones regex (fallback).
 *
 * Se usa cuando no hay `AI_API_KEY` configurada o cuando la IA no encuentra
 * problemas. Aplica patrones predefinidos para detectar eval, passwords
 * hardcodeados, uso de var, console.log, TODOs, etc.
 *
 * @param {string} filePath Ruta del archivo (solo informativo, no se usa en el análisis).
 * @param {string} content Contenido del archivo a analizar.
 * @returns {Array<{severity: string, category: string, message: string, line: number}>} Lista de problemas encontrados.
 *
 * @example
 * const issues = analyzeWithRegex('app.js', 'var x = 1; console.log(x)')
 * // => [
 * //   { severity: 'warning', category: 'convenciones', message: 'Se encontró uso de var...', line: 1 },
 * //   { severity: 'warning', category: 'bugs', message: 'Se encontró console.log...', line: 1 }
 * // ]
 */
export function analyzeWithRegex(filePath, content) {
  const issues = []
  const lines = content.split(/\r?\n/)

  for (const rule of [...CRITICAL_PATTERNS, ...WARNING_PATTERNS]) {
    const matcher = rule.pattern.global
      ? rule.pattern
      : new RegExp(rule.pattern.source, `${rule.pattern.flags}g`)

    for (const match of content.matchAll(matcher)) {
      const line = findLineNumber(lines, match.index ?? 0)
      issues.push({
        severity: rule.severity,
        category: rule.category,
        message: rule.message,
        line
      })
    }
  }

  return issues
}

/**
 * Analiza el contenido de un archivo. Usa IA si hay API key configurada,
 * o patrones regex como fallback.
 *
 * Estrategia:
 * 1. Si `AI_API_KEY` está configurada → llama a `analyzeWithAI()`
 * 2. Si la IA encuentra problemas → los retorna directamente
 * 3. Si la IA no encuentra nada o no hay API key → usa `analyzeWithRegex()`
 *
 * @param {string} filePath Ruta del archivo a analizar.
 * @param {string} content Contenido del archivo.
 * @returns {Promise<Array<{severity: string, category: string, message: string, line: number}>>} Lista de problemas detectados.
 *
 * @example
 * // Con AI_API_KEY configurada, usa la IA
 * const issues = await analyzeFileContent('src/app.js', 'eval("xss")')
 *
 * @example
 * // Sin AI_API_KEY, usa regex como fallback
 * const issues = await analyzeFileContent('src/app.js', 'var x = 1')
 */
export async function analyzeFileContent(filePath, content) {
  if (AI_API_KEY) {
    const aiIssues = await analyzeWithAI(filePath, content)
    if (aiIssues.length > 0) {
      return aiIssues
    }
  }

  return analyzeWithRegex(filePath, content)
}

/**
 * Ejecuta la validación para una lista de archivos.
 *
 * Lee cada archivo, lo analiza con IA o regex, y determina si el commit
 * debe bloquearse (algún issue con severity === 'critical').
 *
 * @param {string[]} files Lista de rutas de archivos a validar.
 * @returns {Promise<{blocked: boolean, findings: Array<{filePath: string, issues: Array}>}>} Resultado de la validación.
 *
 * @example
 * const { blocked, findings } = await validateFiles(['src/app.js', 'src/utils.js'])
 * if (blocked) {
 *   console.error('Commit bloqueado por problemas críticos')
 * }
 */
export async function validateFiles(files) {
  const findings = []

  for (const file of files) {
    const content = await readFileContent(file)
    const issues = await analyzeFileContent(file, content)
    findings.push({ filePath: file, issues })
  }

  const blocked = findings.some(({ issues }) =>
    issues.some((issue) => issue.severity === 'critical')
  )

  return { blocked, findings }
}

/**
 * Punto de entrada del script.
 *
 * Recibe rutas de archivos como argumentos, los valida y muestra un reporte
 * en consola. Retorna 0 si el commit puede continuar, 1 si debe bloquearse.
 *
 * @param {string[]} argv Argumentos de la línea de comandos (rutas de archivos).
 * @returns {Promise<number>} Código de salida: 0 = ok, 1 = bloqueado.
 *
 * @example
 * // Uso desde terminal
 * // node scripts/validate-with-ia.js src/app.js src/utils.js
 *
 * @example
 * // Uso programático
 * import { main } from './scripts/validate-with-ia.js'
 * const exitCode = await main(['src/app.js'])
 * process.exit(exitCode)
 */
export async function main(argv = process.argv.slice(2)) {
  const files = argv.filter(Boolean).map((file) => path.resolve(file))

  if (files.length === 0) {
    console.log('ℹ️  No se recibieron archivos para validar')
    return 0
  }

  try {
    const engine = AI_API_KEY ? '🤖 IA (API)' : '🔎 Patrones regex (fallback)'
    console.log(`🔍 Validación con ${engine} para ${files.length} archivo(s)`)

    const { blocked, findings } = await validateFiles(files)

    const criticalIssues = findings.flatMap(({ filePath, issues }) =>
      issues
        .filter((issue) => issue.severity === 'critical')
        .map((issue) => ({ filePath, ...issue }))
    )

    const warningIssues = findings.flatMap(({ filePath, issues }) =>
      issues
        .filter((issue) => issue.severity === 'warning')
        .map((issue) => ({ filePath, ...issue }))
    )

    if (criticalIssues.length > 0) {
      console.log(`\n❌ Problemas críticos encontrados (${criticalIssues.length})`)
      criticalIssues.forEach((issue) => {
        console.log(`- ${issue.filePath}:${issue.line} [${issue.category}] ${issue.message}`)
      })
    }

    if (warningIssues.length > 0) {
      console.log(`\n⚠️  Advertencias (${warningIssues.length})`)
      warningIssues.forEach((issue) => {
        console.log(`- ${issue.filePath}:${issue.line} [${issue.category}] ${issue.message}`)
      })
    }

    if (criticalIssues.length === 0 && warningIssues.length === 0) {
      console.log('\n✅ No se encontraron problemas en los archivos analizados')
    }

    if (blocked) {
      console.error('\n🚫 El commit ha sido bloqueado por problemas críticos')
      return 1
    }

    console.log('\n✅ La validación completó, el commit puede continuar')
    return 0
  } catch (error) {
    console.error(`❌ Error durante la validación: ${error.message}`)
    return 1
  }
}

const isMainModule =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)

if (isMainModule) {
  main().then((code) => {
    process.exitCode = code
  })
}
