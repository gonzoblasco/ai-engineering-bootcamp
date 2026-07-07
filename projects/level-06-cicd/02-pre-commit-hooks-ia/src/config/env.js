/**
 * Configuración de variables de entorno para el proyecto.
 * Carga dotenv y expone las variables necesarias para el servicio de IA.
 */

import dotenv from 'dotenv'

dotenv.config()

/**
 * API key para el servicio de IA (OpenAI-compatible).
 *
 * Si no se configura, el validador usará patrones regex como fallback.
 * Soporta cualquier proveedor compatible con la API de OpenAI
 * (OpenAI, Anthropic, Groq, Azure OpenAI, etc.).
 *
 * @type {string|undefined}
 *
 * @example
 * // En .env
 * AI_API_KEY=sk-abc123...
 */
export const AI_API_KEY = process.env.AI_API_KEY

/**
 * URL del endpoint de IA (OpenAI-compatible).
 *
 * Por defecto apunta a la API de OpenAI. Se puede cambiar para usar
 * otros proveedores (Anthropic, Groq, Azure, etc.).
 *
 * @type {string}
 *
 * @example
 * // En .env
 * AI_API_URL=https://api.anthropic.com/v1/messages
 */
export const AI_API_URL =
  process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions'

/**
 * Modelo de IA a utilizar.
 *
 * Por defecto gpt-4o-mini (buena relacion calidad/precio/velocidad).
 * Se puede cambiar a gpt-4o, claude-3-haiku, llama-3-70b, etc.
 *
 * @type {string}
 *
 * @example
 * // En .env
 * AI_MODEL=gpt-4o
 */
export const AI_MODEL = process.env.AI_MODEL || 'gpt-4o-mini'

/**
 * Temperatura para las respuestas de la IA.
 *
 * 0 = determinista (recomendado para revision de codigo).
 * Valores mas altos introducen variabilidad en las respuestas.
 *
 * @type {number}
 *
 * @example
 * // En .env
 * AI_TEMPERATURE=0.2
 */
export const AI_TEMPERATURE = parseFloat(process.env.AI_TEMPERATURE || '0')

/**
 * Timeout en milisegundos para las llamadas a la API de IA.
 *
 * Si la API no responde en este tiempo, se cancela la llamada
 * y se usa el fallback regex. Por defecto 30 segundos.
 *
 * @type {number}
 *
 * @example
 * // En .env
 * AI_TIMEOUT_MS=15000
 */
export const AI_TIMEOUT_MS = parseInt(process.env.AI_TIMEOUT_MS || '30000', 10)
