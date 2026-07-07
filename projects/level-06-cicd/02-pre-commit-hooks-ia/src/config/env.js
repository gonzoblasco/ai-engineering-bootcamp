/**
 * Configuración de variables de entorno para el proyecto.
 * Carga dotenv y expone las variables necesarias.
 */

import dotenv from 'dotenv'

dotenv.config()

/**
 * API key para el servicio de IA (OpenAI-compatible).
 * Si no se configura, el validador usará patrones regex como fallback.
 * @type {string|undefined}
 */
export const AI_API_KEY = process.env.AI_API_KEY

/**
 * URL del endpoint de IA (OpenAI-compatible).
 * @type {string}
 */
export const AI_API_URL =
  process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions'

/**
 * Modelo de IA a utilizar.
 * @type {string}
 */
export const AI_MODEL = process.env.AI_MODEL || 'gpt-4o-mini'

/**
 * Temperatura para las respuestas de la IA (0 = determinista).
 * @type {number}
 */
export const AI_TEMPERATURE = parseFloat(process.env.AI_TEMPERATURE || '0')

/**
 * Timeout en milisegundos para las llamadas a la API de IA.
 * @type {number}
 */
export const AI_TIMEOUT_MS = parseInt(process.env.AI_TIMEOUT_MS || '30000', 10)
