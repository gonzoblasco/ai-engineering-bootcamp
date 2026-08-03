/**
 * Rutas de Tasks.
 *
 * Monta cada endpoint sobre /tasks y aplica las reglas de validación
 * correspondientes antes de llegar al controlador. El orden es:
 *   validación -> validateResult -> controlador
 */
import { Router } from 'express';
import {
  listTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { createTaskRules, updateTaskRules } from '../middleware/validateTask.js';
import { validateResult } from '../middleware/validateResult.js';

export const taskRouter = Router();

// GET /tasks — listar todas
taskRouter.get('/', listTasks);

// GET /tasks/:id — obtener una
taskRouter.get('/:id', getTask);

// POST /tasks — crear (con validación)
taskRouter.post('/', createTaskRules, validateResult, createTask);

// PUT /tasks/:id — actualizar (con validación)
taskRouter.put('/:id', updateTaskRules, validateResult, updateTask);

// DELETE /tasks/:id — eliminar
taskRouter.delete('/:id', deleteTask);