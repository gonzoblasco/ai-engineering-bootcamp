const express = require('express');
const tasksRoutes = require('./routes/tasks');
const { requestLogger } = require('./services/tasksService');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(requestLogger);

app.use('/tasks', tasksRoutes);

app.get('/', (_req, res) => {
  res.json({ message: 'Tasks API — Nivel 2 del AI Engineering Bootcamp' });
});

app.use((_req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Export the app so tests can mount it on an ephemeral port.
// Only listen when run directly (not when required by a test).
module.exports = app;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
  });
}
