const express = require('express');
const bus = require('../event-bus');

const app = express();
const PORT = 3001;

app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

let nextId = 1;
const users = [];

// POST /users — crear usuario
app.post('/users', (req, res) => {
  const { name, email } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'name es obligatorio' });
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'email inválido' });
  }

  const user = {
    id: nextId++,
    name: name.trim(),
    email: email.trim(),
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  bus.publish('user.created', { ...user });

  res.status(201).json(user);
});

// GET /users/:id — obtener usuario
app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ error: `Usuario con id ${id} no encontrado` });
  }

  res.json(user);
});

// GET /users — listar usuarios
app.get('/users', (_req, res) => {
  res.json(users);
});

// DELETE /users/:id — eliminar usuario
app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: `Usuario con id ${id} no encontrado` });
  }

  const [user] = users.splice(index, 1);
  bus.publish('user.deleted', { id: user.id, name: user.name, email: user.email });

  res.json({ message: `Usuario ${id} eliminado` });
});

function start() {
  return new Promise((resolve) => {
    app.listen(PORT, () => {
      console.log(`👤 Users Service corriendo en http://localhost:${PORT}`);
      resolve();
    });
  });
}

function stop() {
  // En una app real cerraríamos el server
}

module.exports = { start, stop, app };
