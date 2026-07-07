/**
 * Modelo de Task (en memoria).
 *
 * Para mantener este ejercicio autocontenido y sin dependencias externas
 * (bases de datos), usamos un Map en memoria como almacén. En un proyecto
 * real, aquí tendrías la conexión a PostgreSQL, MongoDB, etc.
 *
 * La API pública del modelo es deliberadamente pequeña y síncrona para que
 * sea trivial de testear. Si migras a una base de datos real, solo tendrás
 * que cambiar la implementación interna manteniendo la misma firma.
 */
import { randomUUID } from 'node:crypto';

/**
 * @typedef {Object} Task
 * @property {string} id        - UUID único de la tarea.
 * @property {string} title     - Título de la tarea (no vacío).
 * @property {boolean} done     - ¿Está completada?
 * @property {string} createdAt - ISO date de creación.
 * @property {string} updatedAt - ISO date de última actualización.
 */

/** Almacén en memoria: Map<id, Task> */
const store = new Map();

export const taskModel = {
  /** Devuelve todas las tareas como array. */
  findAll() {
    return Array.from(store.values());
  },

  /**
   * Devuelve tareas paginadas y filtradas.
   *
   * @param {Object} opts
   * @param {number} [opts.page=1]     - Página (1-based).
   * @param {number} [opts.limit=10]   - Tareas por página.
   * @param {string} [opts.title]      - Filtra por título (substring, case-insensitive).
   * @param {boolean} [opts.done]      - Filtra por estado `done`.
   * @returns {{ data: Task[], meta: { page, limit, total, totalPages, hasNext, hasPrev } }}
   */
  findMany({ page = 1, limit = 10, title, done } = {}) {
    let tasks = this.findAll();

    // --- Filtering ---
    if (title !== undefined) {
      const needle = String(title).toLowerCase();
      tasks = tasks.filter((t) => t.title.toLowerCase().includes(needle));
    }
    if (done !== undefined) {
      // done llega como string desde query params; normalizamos
      const wantDone = done === true || done === 'true';
      tasks = tasks.filter((t) => t.done === wantDone);
    }

    const total = tasks.length;

    // --- Paginación (1-based) ---
    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safeLimit = Math.max(1, parseInt(limit, 10) || 10);
    const totalPages = Math.max(1, Math.ceil(total / safeLimit));
    const start = (safePage - 1) * safeLimit;
    const data = tasks.slice(start, start + safeLimit);

    return {
      data,
      meta: {
        page: safePage,
        limit: safeLimit,
        total,
        totalPages,
        hasNext: safePage < totalPages,
        hasPrev: safePage > 1,
      },
    };
  },

  /** Devuelve una tarea por id, o undefined si no existe. */
  findById(id) {
    return store.get(id);
  },

  /** Crea una nueva tarea a partir de { title, done? }. */
  create({ title, done = false }) {
    const now = new Date().toISOString();
    /** @type {Task} */
    const task = {
      id: randomUUID(),
      title,
      done: Boolean(done),
      createdAt: now,
      updatedAt: now,
    };
    store.set(task.id, task);
    return task;
  },

  /**
   * Actualiza una tarea existente. Devuelve la tarea actualizada
   * o undefined si no existe.
   */
  update(id, { title, done }) {
    const existing = store.get(id);
    if (!existing) return undefined;

    const updated = {
      ...existing,
      // Solo sobreescribe los campos que lleguen definidos
      ...(title !== undefined ? { title } : {}),
      ...(done !== undefined ? { done: Boolean(done) } : {}),
      updatedAt: new Date().toISOString(),
    };
    store.set(id, updated);
    return updated;
  },

  /** Elimina una tarea por id. Devuelve true si existía, false si no. */
  delete(id) {
    return store.delete(id);
  },

  /** Limpia el almacén — útil para tests. */
  clear() {
    store.clear();
  },
};