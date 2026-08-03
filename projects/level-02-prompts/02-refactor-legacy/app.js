// Messy Express app for the Level 2 refactoring exercise (Project 2).
// Deliberately full of code smells: duplication, unclear names, weak
// error handling, dead imports. The learner refactors this with AI.

const express = require('express');
const app = express();
app.use(express.json());

// In-memory "database"
let users = [];
let nextId = 1;

// --- Endpoint: get all users ---
app.get('/users', (req, res) => {
  res.json(users);
});

// --- Endpoint: get one user ---
app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  let found = null;
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      found = users[i];
    }
  }
  if (!found) {
    res.status(404).json({ error: 'not found' });
  } else {
    res.json(found);
  }
});

// --- Endpoint: create user ---
app.post('/users', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const age = req.body.age;

  // validate
  if (!name) {
    res.status(400).json({ error: 'name required' });
    return;
  }
  if (!email) {
    res.status(400).json({ error: 'email required' });
    return;
  }
  if (typeof age !== 'number' || age < 0) {
    res.status(400).json({ error: 'age must be a positive number' });
    return;
  }

  const u = { id: nextId, name, email, age };
  nextId = nextId + 1;
  users.push(u);
  res.status(201).json(u);
});

// --- Endpoint: update user (duplicated validation from create) ---
app.put('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  let found = null;
  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      found = users[i];
    }
  }
  if (!found) {
    res.status(404).json({ error: 'not found' });
    return;
  }

  const name = req.body.name;
  const email = req.body.email;
  const age = req.body.age;

  // validate (again — duplicated logic!)
  if (name !== undefined && !name) {
    res.status(400).json({ error: 'name required' });
    return;
  }
  if (email !== undefined && !email) {
    res.status(400).json({ error: 'email required' });
    return;
  }
  if (age !== undefined && (typeof age !== 'number' || age < 0)) {
    res.status(400).json({ error: 'age must be a positive number' });
    return;
  }

  if (name !== undefined) found.name = name;
  if (email !== undefined) found.email = email;
  if (age !== undefined) found.age = age;
  res.json(found);
});

// --- Endpoint: delete user ---
app.delete('/users/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) {
    res.status(404).json({ error: 'not found' });
    return;
  }
  users.splice(idx, 1);
  res.status(204).end();
});

// dead code / unclear naming
function helperThatDoesNothing(a, b) {
  const x = a + b;
  return x;
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log('server up on ' + PORT);
});
