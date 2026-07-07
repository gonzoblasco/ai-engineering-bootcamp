/**
 * App Express.
 *
 * Aquí se monta toda la aplicación: middlewares globales, rutas y los
 * manejadores de 404/errores al final (el orden importa en Express).
 *
 * Se separa de server.js para poder importar `app` en los tests sin
 * levantar el servidor HTTP (supertest usa app directamente).
 */
import express from 'express';
import { taskRouter } from './routes/taskRoutes.js';
import { notFound } from './middleware/notFound.js';
import { errorHandler } from './middleware/errorHandler.js';

export const app = express();

// --- Middlewares globales ---
app.use(express.json()); // parsea bodies JSON
app.use(express.urlencoded({ extended: true })); // parsea form-urlencoded

// --- Rutas ---
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
app.use('/tasks', taskRouter);

// --- Manejadores finales (deben ir DESPUÉS de las rutas) ---
app.use(notFound);        // 404 para rutas inexistentes
app.use(errorHandler);    // errores centralizados