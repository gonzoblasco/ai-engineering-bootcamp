import { prisma } from '../config/db.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import {
  generateAccessToken,
  generateRefreshTokenValue,
} from '../utils/token.js';
import { config } from '../config/index.js';

/**
 * POST /api/auth/register
 * Crea un usuario con email + password. Rol por defecto: "user".
 * Devuelve access token + refresh token.
 */
export async function register(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password son obligatorios' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    const hashed = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, password: hashed, role: 'user' },
    });

    const tokens = await issueTokens(user.id);
    res.status(201).json({ data: { user: sanitize(user), ...tokens } });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 * Valida credenciales y devuelve tokens.
 * Mismo mensaje para email inexistente y password incorrecta (anti-enumeration).
 */
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password son obligatorios' });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Mismo flujo y mensaje sin importar si el email existe o no
    const valid = user ? await comparePassword(password, user.password) : false;
    if (!user || !valid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const tokens = await issueTokens(user.id);
    res.json({ data: { user: sanitize(user), ...tokens } });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/refresh
 * Intercambia un refresh token válido por un access token nuevo.
 * El refresh token viejo se revoca (rotación).
 */
export async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token requerido' });
    }

    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!stored || stored.revoked || stored.expiresAt < new Date()) {
      return res.status(401).json({ error: 'Refresh token inválido o expirado' });
    }

    // Rotación: revoca el token viejo
    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revoked: true },
    });

    const tokens = await issueTokens(stored.userId);
    res.json({ data: tokens });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/logout
 * Revoca el refresh token activo del usuario.
 */
export async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token requerido' });
    }

    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!stored) {
      // Idempotente: no revelar si existía o no
      return res.json({ data: { message: 'Sesión cerrada' } });
    }

    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revoked: true },
    });

    res.json({ data: { message: 'Sesión cerrada' } });
  } catch (err) {
    next(err);
  }
}

// --- Helpers ---

/**
 * Crea un par access + refresh token y persiste el refresh en DB.
 */
async function issueTokens(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const accessToken = generateAccessToken(user);
  const refreshTokenValue = generateRefreshTokenValue();
  const expiresAt = new Date(
    Date.now() + config.refreshToken.expiresInSeconds * 1000,
  );

  await prisma.refreshToken.create({
    data: {
      userId,
      token: refreshTokenValue,
      expiresAt,
    },
  });

  return { accessToken, refreshToken: refreshTokenValue };
}

/**
 * Elimina la password del objeto de respuesta.
 */
function sanitize(user) {
  const { password, ...rest } = user;
  return rest;
}