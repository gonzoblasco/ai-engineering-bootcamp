/**
 * Middleware de manejo de errores centralizado.
 *
 * Es el ÚNICO lugar de la app que decide cómo se formatean los errores
 * hacia el cliente. Cualquier middleware/ruta que llame a next(err)
 * terminará aquí. Esto evita repetir try/catch en cada controlador.
 *
 * En producción se ocultan los detalles internos del error; en
 * desarrollo se incluyen para facilitar el debugging.
 */
import { config } from '../config/index.js';

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // Log completo siempre (servidor), pero el cliente ve menos en prod.
  console.error('[error]', err);

  const status = err.status || 500;
  const payload = {
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message: status >= 500 && config.isProduction
        ? 'Error interno del servidor'
        : err.message,
    },
  };

  // En desarrollo incluimos el stack para depurar más rápido.
  if (!config.isProduction && err.stack) {
    payload.error.stack = err.stack;
  }

  res.status(status).json(payload);
}