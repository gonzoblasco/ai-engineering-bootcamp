/**
 * Detectores de calidad de código basados en regex
 * @type {import('./types.js').Detector[]}
 */
export const qualityDetectors = [
  {
    id: 'var-usage',
    name: 'Uso de var',
    category: 'Calidad',
    severity: 'low',
    regex: /\bvar\s+/,
    message: 'Uso de var detectado',
    recommendation: 'Usar const por defecto y let solo cuando se reasigne'
  },
  {
    id: 'empty-catch',
    name: 'Catch vacío',
    category: 'Calidad',
    severity: 'medium',
    regex: /catch\s*\(\s*\)?\s*\{\s*\}/,
    message: 'Bloque catch vacío detectado',
    recommendation: 'Loggear o propagar el error; nunca silenciar excepciones sin acción'
  },
  {
    id: 'direct-req-body-data',
    name: 'Uso directo de req.body en datos de modelo',
    category: 'Calidad',
    severity: 'medium',
    regex: /data\s*:\s*req\.body\b/,
    message: 'req.body se pasa directamente como data al ORM',
    recommendation: 'Construir el objeto de datos desde campos validados, no desde req.body directamente'
  },
  {
    id: 'spread-req-body',
    name: 'Spread de req.body en objeto de datos',
    category: 'Calidad',
    severity: 'medium',
    regex: /\{\s*\.\.\.\s*req\.body\s*\}/,
    message: 'Spread de req.body hacia datos de modelo',
    recommendation: 'Seleccionar campos explícitos validados en lugar de propagar todo req.body'
  },
  {
    id: 'leaky-error-message',
    name: 'Error message expuesto al cliente',
    category: 'Calidad',
    severity: 'medium',
    regex: /message\s*:\s*err\.message/,
    message: 'Mensaje de error interno expuesto al cliente',
    recommendation: 'Devolver un mensaje genérico al cliente y loggear el error completo en servidor'
  }
]
