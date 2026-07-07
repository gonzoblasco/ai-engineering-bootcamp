/**
 * Middleware 404 — se ejecuta cuando ninguna ruta coincidió.
 * Responde con un JSON consistente en lugar del HTML por defecto de Express.
 */
export function notFound(req, res) {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
    },
  });
}