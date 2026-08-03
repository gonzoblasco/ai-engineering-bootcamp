import { securityDetectors } from './security.js'
import { performanceDetectors } from './performance.js'
import { qualityDetectors } from './quality.js'

/**
 * Detector registrado en el scanner.
 *
 * @typedef {Object} Detector
 * @property {string} id - Identificador único del detector
 * @property {string} name - Nombre descriptivo
 * @property {string} category - Categoría del hallazgo (Seguridad, Performance, Calidad)
 * @property {'high'|'medium'|'low'} severity - Severidad asignada
 * @property {RegExp} regex - Patrón de detección por línea
 * @property {string} message - Descripción corta del problema
 * @property {string} recommendation - Acción recomendada
 */

/**
 * Retorna todos los detectores disponibles.
 *
 * Combina los detectores de seguridad, performance y calidad en un único array.
 *
 * @returns {Detector[]} Lista completa de detectores registrados
 *
 * @example
 * const detectors = getDetectors();
 * console.log(detectors.length); // 12
 */
export function getDetectors() {
  return [
    ...securityDetectors,
    ...performanceDetectors,
    ...qualityDetectors
  ]
}
