/**
 * Controladores de Tasks.
 *
 * Cada función maneja una operación HTTP, delega en el modelo y responde
 * con JSON. Los errores se delegan al middleware centralizado mediante
 * next(err), por lo que aquí no hay try/catch repetidos.
 */
import { taskModel } from '../models/taskModel.js';

/** GET /tasks — lista tareas con paginación y filtering opcional.
 *
 * Query params soportados:
 *   page  - número de página (1-based, por defecto 1)
 *   limit - tareas por página (por defecto 10)
 *   title - filtra por substring en el título (case-insensitive)
 *   done  - filtra por estado: "true" | "false"
 *
 * Ejemplo: GET /tasks?page=2&limit=5&done=false&title=api
 */
export function listTasks(req, res, next) {
  try {
    const { page, limit, title, done } = req.query;
    const result = taskModel.findMany({ page, limit, title, done });
    res.json(result); // { data, meta }
  } catch (err) {
    next(err);
  }
}

/** GET /tasks/:id — devuelve una tarea por id. */
export function getTask(req, res, next) {
  try {
    const { id } = req.params;
    const task = taskModel.findById(id);

    if (!task) {
      // Error con status para que el errorHandler lo formatee.
      const err = new Error(`Tarea con id "${id}" no encontrada`);
      err.status = 404;
      err.code = 'TASK_NOT_FOUND';
      return next(err);
    }

    return res.json({ data: task });
  } catch (err) {
    return next(err);
  }
}

/** POST /tasks — crea una nueva tarea. El body ya está validado. */
export function createTask(req, res, next) {
  try {
    const { title, done } = req.body;
    const task = taskModel.create({ title, done });
    res.status(201).json({ data: task });
  } catch (err) {
    next(err);
  }
}

/** PUT /tasks/:id — actualiza una tarea existente. */
export function updateTask(req, res, next) {
  try {
    const { id } = req.params;
    const { title, done } = req.body;
    const updated = taskModel.update(id, { title, done });

    if (!updated) {
      const err = new Error(`Tarea con id "${id}" no encontrada`);
      err.status = 404;
      err.code = 'TASK_NOT_FOUND';
      return next(err);
    }

    return res.json({ data: updated });
  } catch (err) {
    return next(err);
  }
}

/** DELETE /tasks/:id — elimina una tarea. */
export function deleteTask(req, res, next) {
  try {
    const { id } = req.params;
    const existed = taskModel.delete(id);

    if (!existed) {
      const err = new Error(`Tarea con id "${id}" no encontrada`);
      err.status = 404;
      err.code = 'TASK_NOT_FOUND';
      return next(err);
    }

    return res.status(204).end();
  } catch (err) {
    return next(err);
  }
}