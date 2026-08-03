let nextId = 1;
const tasks = [];

function requestLogger(req, _res, next) {
  const start = Date.now();
  const originalEnd = _res.end;

  _res.end = function (...args) {
    const duration = Date.now() - start;
    console.log(`[${req.method}] ${req.originalUrl} — ${duration}ms`);
    return originalEnd.apply(this, args);
  };

  next();
}

function getAll() {
  return tasks;
}

function getById(id) {
  return tasks.find((t) => t.id === id) || null;
}

function create({ title, done = false }) {
  const task = { id: nextId++, title, done, createdAt: new Date().toISOString() };
  tasks.push(task);
  return task;
}

function update(id, data) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return null;

  tasks[index] = { ...tasks[index], ...data, id };
  return tasks[index];
}

function remove(id) {
  const index = tasks.findIndex((t) => t.id === id);
  if (index === -1) return false;

  tasks.splice(index, 1);
  return true;
}

module.exports = { requestLogger, getAll, getById, create, update, remove };
