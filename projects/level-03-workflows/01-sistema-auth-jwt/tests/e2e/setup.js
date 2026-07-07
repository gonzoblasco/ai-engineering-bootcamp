import { execSync } from 'child_process';
import { PrismaClient } from '@prisma/client';
import { createApp } from '../../src/app.js';

const prisma = new PrismaClient();

// Base de datos de test efímera: resetea antes de cada suite
async function resetDatabase() {
  // Orden importa por las foreign keys
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
}

beforeAll(async () => {
  // Asegura que el schema existe
  execSync('npx prisma db push --force-reset --skip-generate', {
    stdio: 'inherit',
  });
});

beforeEach(async () => {
  await resetDatabase();
});

afterAll(async () => {
  await prisma.$disconnect();
});

const app = createApp();

export { app };