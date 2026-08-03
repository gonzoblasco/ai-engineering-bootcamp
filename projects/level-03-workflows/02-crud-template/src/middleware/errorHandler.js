import { Prisma } from '@prisma/client';

/**
 * Middleware centralizado de manejo de errores.
 * Mapea errores de Prisma y otros errores conocidos a respuestas HTTP consistentes.
 *
 * Formato de error: { error: { code, message } }
 */
export function errorHandler(err, _req, res, _next) {
  // Errores conocidos de Prisma
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        return res.status(409).json({
          error: {
            code: 'CONFLICT',
            message: 'Ya existe un registro con ese valor único',
          },
        });
      case 'P2025':
        return res.status(404).json({
          error: {
            code: 'NOT_FOUND',
            message: 'Registro no encontrado',
          },
        });
      default:
        return res.status(400).json({
          error: {
            code: 'DATABASE_ERROR',
            message: err.message,
          },
        });
    }
  }

  // Error con status code explícito (lanzado manualmente)
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: {
        code: err.code || 'ERROR',
        message: err.message,
      },
    });
  }

  // Error genérico no manejado
  console.error('Unhandled error:', err);
  return res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Error interno del servidor',
    },
  });
}