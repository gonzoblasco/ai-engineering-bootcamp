import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre no puede exceder 100 caracteres'),
  price: z.number({ required_error: 'El precio es requerido' }).positive('El precio debe ser mayor a 0'),
  description: z.string().max(500, 'La descripción no puede exceder 500 caracteres').optional(),
  stock: z.number({ required_error: 'El stock es requerido' }).int('El stock debe ser un entero').nonnegative('El stock debe ser >= 0'),
  userId: z.string().min(1, 'El userId es requerido'),
});

export const updateProductSchema = createProductSchema.partial();