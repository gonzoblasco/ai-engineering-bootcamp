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
    // RFC 6750: el scheme es case-insensitive (Bearer, bearer, BEARER, etc.)
    if (!header || !/^bearer\s/i.test(header)) {
      return res.status(401).json({ error: 'Token de acceso requerido' });
    }

    const token = header.slice(header.indexOf(' ') + 1).trim();
    let payload;

    try {
      payload = verifyAccessToken(token);
    } catch {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }

    // Token con firma válida pero payload malformado (sin sub)
    if (!payload?.sub) {
      return res.status(401).json({ error: 'Token inválido o expirado' });
    }

    // Verifica que el usuario siga existiendo (pudo ser eliminado).
    // Tradeoff: esta consulta agrega latencia a cada request protegido,
    // pero garantiza revocación inmediata al eliminar el usuario.
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