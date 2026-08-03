const express = require('express');
const bus = require('../event-bus');

const app = express();
const PORT = 3000;

app.use(express.json());

// Simulación de hash de password (NO usar en producción — solo demo)
function hashPassword(password) {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0;
  }
  return 'h' + Math.abs(hash).toString(36);
}

// Simulación de token (NO usar en producción — solo demo)
function generateToken(email) {
  return 'tok_' + Buffer.from(email + ':' + Date.now()).toString('base64').replace(/[^a-zA-Z0-9]/g, '').substring(0, 24);
}

let nextId = 1;
const users = []; // { id, name, email, passwordHash }
const sessions = []; // { token, userId, email }

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

// POST /auth/register — registrar usuario
app.post('/auth/register', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    return res.status(400).json({ error: 'name es obligatorio' });
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return res.status(400).json({ error: 'email inválido' });
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'password debe tener al menos 6 caracteres' });
  }

  // No duplicar emails
  if (users.some((u) => u.email === email)) {
    return res.status(409).json({ error: 'email ya registrado' });
  }

  const user = {
    id: nextId++,
    name: name.trim(),
    email: email.trim(),
    passwordHash: hashPassword(password),
  };

  users.push(user);
  bus.publish('user.registered', { id: user.id, name: user.name, email: user.email });

  res.status(201).json({ id: user.id, name: user.name, email: user.email });
});

// POST /auth/login — login
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email y password son obligatorios' });
  }

  const user = users.find((u) => u.email === email);

  if (!user || user.passwordHash !== hashPassword(password)) {
    return res.status(401).json({ error: 'credenciales inválidas' });
  }

  const token = generateToken(user.email);
  sessions.push({ token, userId: user.id, email: user.email });

  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// POST /auth/logout — logout
app.post('/auth/logout', (req, res) => {
  const { token } = req.body;
  const idx = sessions.findIndex((s) => s.token === token);

  if (idx !== -1) {
    sessions.splice(idx, 1);
  }

  res.json({ message: 'logout exitoso' });
});

function start() {
  return new Promise((resolve) => {
    app.listen(PORT, () => {
      console.log(`🔐 Auth Service corriendo en http://localhost:${PORT}`);
      resolve();
    });
  });
}

function stop() {}

module.exports = { start, stop, app };
