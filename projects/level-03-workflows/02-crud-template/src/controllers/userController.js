import bcrypt from 'bcrypt';
import { prisma } from '../config/db.js';

export async function create(req, res, next) {
  try {
    const { password, ...rest } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { ...rest, password: hashedPassword },
    });

    // Nunca devolver el password
    const { password: _pw, ...userWithoutPassword } = user;
    return res.status(201).json({ data: userWithoutPassword });
  } catch (err) {
    return next(err);
  }
}

export async function getAll(_req, res, next) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return res.status(200).json({ data: users });
  } catch (err) {
    return next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      include: { products: true },
    });

    if (!user) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Usuario no encontrado',
        },
      });
    }

    // Nunca devolver el password
    const { password: _pw, ...userWithoutPassword } = user;
    return res.status(200).json({ data: userWithoutPassword });
  } catch (err) {
    return next(err);
  }
}

export async function update(req, res, next) {
  try {
    let data = { ...req.body };

    // Si viene password nueva, hashearla
    if (data.password) {
      data.password = await bcrypt.hash(data.password, 10);
    }

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data,
    });

    const { password: _pw, ...userWithoutPassword } = user;
    return res.status(200).json({ data: userWithoutPassword });
  } catch (err) {
    return next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await prisma.user.delete({
      where: { id: req.params.id },
    });

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}