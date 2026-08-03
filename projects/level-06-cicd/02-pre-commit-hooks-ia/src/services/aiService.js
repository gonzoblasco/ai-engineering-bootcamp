/**
 * Servicio de IA para analizar código en busca de problemas de seguridad,
 * bugs y violaciones de convenciones.
 *
 * Usa una API compatible con OpenAI (OpenAI, Anthropic, Groq, etc.).
 * Si no hay API key configurada, devuelve un array vacío.
 */

import { AI_API_KEY, AI_API_URL, AI_MODEL, AI_TEMPERATURE, AI_TIMEOUT_MS } from '../config/env.js'

const SYSTEM_PROMPT = `Eres un revisor de código experto. Analiza el siguiente archivo de código y devuelve ÚNICAMENTE un array JSON con los problemas encontrados. Cada problema debe tener este formato exacto:
{
  "severity": "critical" | "warning",
  "category": "seguridad" | "bugs" | "convenciones",
  "message": "descripción clara del problema en español",
  "line": número de línea donde se encuentra el problema
}

Reglas de severidad:
- "critical": problemas que DEBEN corregirse antes del commit (eval, passwords hardcodeados, SQL injection, XSS, secretos expuestos, vulnerabilidades de seguridad graves)
- "warning": problemas que DEBERÍAN corregirse pero no bloquean el commit (console.log, var en vez de const/let, TODOs, código muerto, malas prácticas)

Si no encuentras ningún problema, devuelve un array vacío: []
No incluyas explicaciones adicionales, SOLO el JSON.`

/**
 * Analiza el contenido de un archivo usando IA.
 *
 * Envía el código a una API compatible con OpenAI (OpenAI, Anthropic, Groq, etc.)
 * y recibe un array JSON con los problemas detectados. Si no hay `AI_API_KEY`
 * configurada, retorna un array vacío para que el llamador use el fallback regex.
 *
 * @param {string} filePath - Ruta del archivo a analizar.
 * @param {string} content - Contenido del archivo.
 * @returns {Promise<Array<{severity: string, category: string, message: string, line: number}>>} Lista de problemas encontrados por la IA.
 * @throws {Error} Si la API responde con un código de error HTTP.
 *
 * @example
 * // Con API key configurada en .env
 * const issues = await analyzeWithAI('src/app.js', 'eval("alert(1)")')
 * // => [{ severity: 'critical', category: 'seguridad', message: 'Uso de eval detectado', line: 1 }]
 *
 * @example
 * // Sin API key — retorna array vacío, se usará fallback regex
 * const issues = await analyzeWithAI('src/app.js', 'console.log("hola")')
 * // => []
 */
export async function analyzeWithAI(filePath, content) {
  if (!AI_API_KEY) {
    return []
  }

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), AI_TIMEOUT_MS)

  try {
    const response = await fetch(AI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AI_API_KEY}`
      },
      body: JSON.stringify({
        model: AI_MODEL,
        temperature: AI_TEMPERATURE,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          {
            role: 'user',
            content: `Archivo: ${filePath}\n\nContenido:\n\`\`\`\n${content}\n\`\`\``
          }
        ]
      }),
      signal: controller.signal
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => '')
      throw new Error(`API de IA respondió con ${response.status}: ${errorText.slice(0, 200)}`)
    }

    const data = await response.json()
    const rawText = data.choices?.[0]?.message?.content || '[]'

    // Intentar parsear el JSON de la respuesta
    const jsonMatch = rawText.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      console.warn('⚠️  La IA no devolvió un JSON válido, se omite el análisis.')
      return []
    }

    const issues = JSON.parse(jsonMatch[0])

    // Validar que cada issue tenga el formato correcto
    return issues.filter(
      (issue) =>
        issue &&
        typeof issue.severity === 'string' &&
        typeof issue.category === 'string' &&
        typeof issue.message === 'string' &&
        typeof issue.line === 'number'
    )
  } catch (error) {
    if (error.name === 'AbortError') {
      console.warn('⚠️  Timeout en la llamada a la API de IA.')
    } else {
      console.warn(`⚠️  Error al llamar a la API de IA: ${error.message}`)
    }
    return []
  } finally {
    clearTimeout(timeout)
  }
}
