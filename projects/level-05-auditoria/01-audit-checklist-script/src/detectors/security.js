/**
 * Detectores de seguridad basados en regex
 * @type {import('./types.js').Detector[]}
 */
export const securityDetectors = [
  {
    id: 'eval-or-function',
    name: 'Uso de eval() o new Function()',
    category: 'Seguridad',
    severity: 'high',
    regex: /\beval\s*\(|new\s+Function\s*\(/,
    message: 'Ejecución dinámica de código detectada',
    recommendation: 'Eliminar eval() y new Function(); usar parsing estructurado o JSON.parse con validación'
  },
  {
    id: 'inner-html',
    name: 'Uso de innerHTML',
    category: 'Seguridad',
    severity: 'high',
    regex: /\.innerHTML\s*=/,
    message: 'Asignación a innerHTML detectada',
    recommendation: 'Usar textContent o sanitizar el HTML con una librería confiable'
  },
  {
    id: 'hardcoded-secret',
    name: 'Posible secreto hardcodeado',
    category: 'Seguridad',
    severity: 'high',
    regex: /(?:password|secret|token|api[_-]?key|private[_-]?key)\s*[:=]\s*["'][^"']{4,}["']/i,
    message: 'Posible secreto hardcodeado en código',
    recommendation: 'Mover secrets a variables de entorno y nunca commitearlos'
  },
  {
    id: 'sql-concatenation',
    name: 'Concatenación en query SQL',
    category: 'Seguridad',
    severity: 'high',
    regex: /(?:query|execute|queryRaw)\s*\(\s*(?:[`"'][^`"']*\$\{|[^,]*\+|\+\s*[`"'])/i,
    message: 'Posible concatenación de query SQL',
    recommendation: 'Usar queries parametrizadas o el ORM; nunca concatenar input de usuario'
  },
  {
    id: 'insecure-default-secret',
    name: 'Default inseguro para secret',
    category: 'Seguridad',
    severity: 'medium',
    regex: /process\.env\.[A-Z_]*(?:SECRET|TOKEN|KEY)\s*\|\|\s*["'][^"']+["']/i,
    message: 'Fallback hardcodeado para variable de entorno sensible',
    recommendation: 'Requerir la variable de entorno y fallar al arrancar si no está definida'
  }
]
