import { prisma } from '../config/db.js';

export async function create(req, res, next) {
  try {
    const { userId } = req.body;

    // Validar que el FK exista
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'El usuario referenciado no existe',
        },
      });
    }

    const product = await prisma.product.create({
      data: req.body,
    });

    return res.status(201).json({ data: product });
  } catch (err) {
    return next(err);
  }
}

export async function getAll(_req, res, next) {
  try {
    const products = await prisma.product.findMany();
    return res.status(200).json({ data: products });
  } catch (err) {
    return next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { user: true },
    });

    if (!product) {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Producto no encontrado',
        },
      });
    }

    return res.status(200).json({ data: product });
  } catch (err) {
    return next(err);
  }
}

export async function update(req, res, next) {
  try {
    const product = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body,
    });

    return res.status(200).json({ data: product });
  } catch (err) {
    return next(err);
  }
}

export async function remove(req, res, next) {
  try {
    await prisma.product.delete({
      where: { id: req.params.id },
    });

    return res.status(204).send();
  } catch (err) {
    return next(err);
  }
}