import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre no puede exceder 100 caracteres'),
  email: z.string().email('El email no es válido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
});

export const updateUserSchema = createUserSchema.partial();