/**
 * Middleware de autorización por rol.
 * Debe usarse DESPUÉS de authenticate.
 * Uso: authorize('admin') o authorize('admin', 'user')
 */
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'No tienes permisos para esta acción' });
    }

    next();
  };
}