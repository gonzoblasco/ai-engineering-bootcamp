const { Router } = require('express');
const tasksService = require('../services/tasksService');

const router = Router();

// GET /tasks — lista paginada
router.get('/', (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 10));
  const all = tasksService.getAll();
  const total = all.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const data = all.slice(offset, offset + limit);

  res.json({ data, total, page, totalPages });
});

// GET /tasks/:id — una tarea
router.get('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const task = tasksService.getById(id);

  if (!task) {
    return res.status(404).json({ error: `Tarea con id ${id} no encontrada` });
  }

  res.json(task);
});

// POST /tasks — crear
router.post('/', (req, res) => {
  const { title, done } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return res.status(400).json({ error: 'title es obligatorio y debe ser un string no vacío' });
  }

  const task = tasksService.create({ title: title.trim(), done });
  res.status(201).json(task);
});

// PUT /tasks/:id — actualizar
router.put('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { title, done } = req.body;

  if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
    return res.status(400).json({ error: 'title debe ser un string no vacío' });
  }

  const updated = tasksService.update(id, {
    ...(title !== undefined && { title: title.trim() }),
    ...(done !== undefined && { done }),
  });

  if (!updated) {
    return res.status(404).json({ error: `Tarea con id ${id} no encontrada` });
  }

  res.json(updated);
});

// DELETE /tasks/:id — eliminar
router.delete('/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const deleted = tasksService.remove(id);

  if (!deleted) {
    return res.status(404).json({ error: `Tarea con id ${id} no encontrada` });
  }

  res.status(204).send();
});

module.exports = router;
