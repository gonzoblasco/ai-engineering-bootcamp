/**
 * Detectores de performance basados en regex
 * @type {import('./types.js').Detector[]}
 */
export const performanceDetectors = [
  {
    id: 'console-log',
    name: 'Uso de console.log',
    category: 'Performance',
    severity: 'medium',
    regex: /\bconsole\.(log|error|warn|info)\s*\(/,
    message: 'Uso de console.log detectado',
    recommendation: 'Usar un logger estructurado y asíncrono; evitar console.log en producción'
  },
  {
    id: 'blocking-fs',
    name: 'Llamada síncrona a filesystem',
    category: 'Performance',
    severity: 'medium',
    regex: /\bfs\.\w+Sync\s*\(/,
    message: 'Operación síncrona de filesystem detectada',
    recommendation: 'Usar las versiones async/promisify de fs en handlers de request'
  },
  {
    id: 'unlimited-body-parser',
    name: 'Body parser sin límite',
    category: 'Performance',
    severity: 'low',
    regex: /express\.json\s*\(\s*\)/,
    message: 'express.json() configurado sin límite de tamaño',
    recommendation: 'Añadir { limit: "10kb" } u otro límite acorde al endpoint'
  }
]
