import { Prisma } from '@prisma/client';

/**
 * Middleware de errores centralizado.
 * Se monta al final de app.js, después de todas las rutas.
 */
export function errorHandler(err, req, res, next) {
  // Prisma: violación de constraint única
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
    return res.status(409).json({ error: 'El recurso ya existe' });
  }

  // Prisma: registro no encontrado
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
    return res.status(404).json({ error: 'Recurso no encontrado' });
  }

  // Error de validación lanzado manualmente con status
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  // Fallback: error interno no esperado
  console.error('Error no controlado:', err.message);
  return res.status(500).json({ error: 'Error interno del servidor' });
}