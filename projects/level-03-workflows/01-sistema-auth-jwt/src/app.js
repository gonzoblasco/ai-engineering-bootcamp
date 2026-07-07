import express from 'express';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();

  // Parsing
  app.use(express.json());

  // Health check
  app.get('/health', (req, res) => {
    res.json({ data: { status: 'ok' } });
  });

  // Rutas
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);

  // 404 — ruta no encontrada
  app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
  });

  // Middleware de errores centralizado (siempre al final)
  app.use(errorHandler);

  return app;
}