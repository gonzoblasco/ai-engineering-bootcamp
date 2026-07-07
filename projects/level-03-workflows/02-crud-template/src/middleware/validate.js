import { ZodError } from 'zod';

/**
 * Middleware genérico que valida req.body contra un schema Zod.
 * Si la validación falla, responde 400 con el formato de error estándar.
 *
 * Uso: router.post('/', validate(createProductSchema), controller.create)
 */
export function validate(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: err.errors.map((e) => e.message).join('; '),
          },
        });
      }
      next(err);
    }
  };
}