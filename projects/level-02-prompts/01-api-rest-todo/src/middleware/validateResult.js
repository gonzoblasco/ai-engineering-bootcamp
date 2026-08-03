/**
 * Middleware que recolecta los errores de express-validator.
 *
 * Si hay errores de validación, responde 400 con un JSON estructurado
 * y corta la cadena de middlewares. Si no hay errores, llama a next().
 */
import { validationResult } from 'express-validator';

export function validateResult(req, res, next) {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  return res.status(400).json({
    error: {
      code: 'VALIDATION_ERROR',
      message: 'Los datos enviados no son válidos',
      details: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    },
  });
}