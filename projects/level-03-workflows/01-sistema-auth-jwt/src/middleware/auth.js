import { verifyAccessToken } from '../utils/token.js';
import { prisma } from '../config/db.js';

/**
 * Middleware de autenticación.
 * Valida el access token del header Authorization: Bearer <token>.
 * Adjunta req.user con { id, role, email } si es válido.
 */
export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token de acceso requerido' });
    }

    const token = header.slice('Bearer '.length).trim();
    let payload;

    try {
      payload = verifyAccessToken(token);
    } catch {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }

    // Verifica que el usuario siga existiendo (pudo ser eliminado)
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true, email: true },
    });

    if (!user) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}