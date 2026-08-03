import { PrismaClient } from '@prisma/client';

// Singleton para evitar múltiples conexiones en dev con --watch
const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.__prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.__prisma = prisma;
}