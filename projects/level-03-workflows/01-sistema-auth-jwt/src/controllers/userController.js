import { prisma } from '../config/db.js';

/**
 * GET /api/users/me
 * Devuelve el perfil del usuario autenticado.
 */
export async function getProfile(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, role: true, createdAt: true },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ data: user });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/users/admin
 * Crea un usuario con rol admin. Solo accesible para admins.
 */
export async function createAdmin(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y password son obligatorios' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    const { hashPassword } = await import('../utils/password.js');
    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: { email, password: hashed, role: 'admin' },
      select: { id: true, email: true, role: true, createdAt: true },
    });

    res.status(201).json({ data: user });
  } catch (err) {
    next(err);
  }
}