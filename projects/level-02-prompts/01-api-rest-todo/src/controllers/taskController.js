/**
 * Controladores de Tasks.
 *
 * Cada función maneja una operación HTTP, delega en el modelo y responde
 * con JSON. Los errores se delegan al middleware centralizado mediante
 * next(err), por lo que aquí no hay try/catch repetidos.
 */
import { taskModel } from '../models/taskModel.js';

/**
 * Lista tareas con paginación y filtrado opcional.
 *
 * Lee los query params `page`, `limit`, `title` y `done` de la petición
 * y delega en `taskModel.findMany()` para obtener el resultado paginado.
 *
 * @param {import('express').Request} req - Petición HTTP de Express.
 * @param {Object} [req.query] - Parámetros de consulta opcionales.
 * @param {number} [req.query.page=1] - Número de página (1-based).
 * @param {number} [req.query.limit=10] - Tareas por página.
 * @param {string} [req.query.title] - Filtra por substring en el título (case-insensitive).
 * @param {('true'|'false')} [req.query.done] - Filtra por estado de completado.
 * @param {import('express').Response} res - Respuesta HTTP de Express.
 * @param {import('express').NextFunction} next - Función para delegar errores al errorHandler.
 * @returns {void} Responde con JSON `{ data: Task[], meta: { page, limit, total, totalPages, hasNext, hasPrev } }`.
 * @throws {Error} Si `taskModel.findMany()` lanza una excepción, se delega vía `next(err)`.
 *
 * @example
 * // GET /tasks?page=2&limit=5&done=false&title=api
 * // → 200 { data: [...], meta: { page: 2, limit: 5, total: 23, totalPages: 5, hasNext: true, hasPrev: true } }
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

/**
 * Devuelve una tarea por su id.
 *
 * Busca la tarea en el modelo y responde con `404` si no existe,
 * delegando el error al middleware centralizado.
 *
 * @param {import('express').Request} req - Petición HTTP de Express.
 * @param {Object} req.params - Parámetros de ruta.
 * @param {string} req.params.id - UUID de la tarea a buscar.
 * @param {import('express').Response} res - Respuesta HTTP de Express.
 * @param {import('express').NextFunction} next - Función para delegar errores al errorHandler.
 * @returns {void} Responde con `200 { data: Task }` o delega un error `404` con `code: 'TASK_NOT_FOUND'`.
 * @throws {Error} Si la tarea no existe (status 404) o si el modelo lanza una excepción.
 *
 * @example
 * // GET /tasks/550e8400-e29b-41d4-a716-446655440000
 * // → 200 { data: { id, title, done, createdAt, updatedAt } }
 */
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

/**
 * Crea una nueva tarea.
 *
 * Recibe `title` y `done` opcional del body (ya validado por express-validator)
 * y delega la creación en `taskModel.create()`.
 *
 * @param {import('express').Request} req - Petición HTTP de Express.
 * @param {Object} req.body - Cuerpo de la petición (validado previamente).
 * @param {string} req.body.title - Título de la tarea (no vacío).
 * @param {boolean} [req.body.done=false] - Estado inicial de la tarea.
 * @param {import('express').Response} res - Respuesta HTTP de Express.
 * @param {import('express').NextFunction} next - Función para delegar errores al errorHandler.
 * @returns {void} Responde con `201 { data: Task }` incluyendo la tarea creada.
 * @throws {Error} Si `taskModel.create()` lanza una excepción, se delega vía `next(err)`.
 *
 * @example
 * // POST /tasks  body: { title: "Aprender Express", done: false }
 * // → 201 { data: { id, title: "Aprender Express", done: false, createdAt, updatedAt } }
 */
export function createTask(req, res, next) {
  try {
    const { title, done } = req.body;
    const task = taskModel.create({ title, done });
    res.status(201).json({ data: task });
  } catch (err) {
    next(err);
  }
}

/**
 * Actualiza una tarea existente.
 *
 * Recibe `title` y/o `done` del body y delega la actualización en
 * `taskModel.update()`. Si la tarea no existe, delega un error `404`.
 *
 * @param {import('express').Request} req - Petición HTTP de Express.
 * @param {Object} req.params - Parámetros de ruta.
 * @param {string} req.params.id - UUID de la tarea a actualizar.
 * @param {Object} req.body - Cuerpo de la petición (validado previamente).
 * @param {string} [req.body.title] - Nuevo título de la tarea.
 * @param {boolean} [req.body.done] - Nuevo estado de completado.
 * @param {import('express').Response} res - Respuesta HTTP de Express.
 * @param {import('express').NextFunction} next - Función para delegar errores al errorHandler.
 * @returns {void} Responde con `200 { data: Task }` o delega un error `404` con `code: 'TASK_NOT_FOUND'`.
 * @throws {Error} Si la tarea no existe (status 404) o si el modelo lanza una excepción.
 *
 * @example
 * // PUT /tasks/550e8400...  body: { title: "Aprender Jest", done: true }
 * // → 200 { data: { id, title: "Aprender Jest", done: true, createdAt, updatedAt } }
 */
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

/**
 * Elimina una tarea por su id.
 *
 * Delega la eliminación en `taskModel.delete()`. Si la tarea no existía,
 * delega un error `404` al middleware centralizado.
 *
 * @param {import('express').Request} req - Petición HTTP de Express.
 * @param {Object} req.params - Parámetros de ruta.
 * @param {string} req.params.id - UUID de la tarea a eliminar.
 * @param {import('express').Response} res - Respuesta HTTP de Express.
 * @param {import('express').NextFunction} next - Función para delegar errores al errorHandler.
 * @returns {void} Responde con `204` (sin contenido) o delega un error `404` con `code: 'TASK_NOT_FOUND'`.
 * @throws {Error} Si la tarea no existe (status 404) o si el modelo lanza una excepción.
 *
 * @example
 * // DELETE /tasks/550e8400-e29b-41d4-a716-446655440000
 * // → 204 (sin body)
 */
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