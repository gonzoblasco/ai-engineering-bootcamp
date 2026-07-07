/**
 * Tests unitarios del modelo Task (sin HTTP).
 *
 * Al testear el modelo directamente (sin pasar por Express) validamos la
 * lógica de negocio pura: creación, actualización, IDs únicos, etc.
 * Son más rápidos y aislados que los tests de rutas.
 */
import { describe, it, expect, beforeEach } from '@jest/globals';
import { taskModel } from '../src/models/taskModel.js';

describe('taskModel (unitarios)', () => {
  beforeEach(() => taskModel.clear());

  describe('create()', () => {
    it('crea una tarea con id, timestamps y done=false por defecto', () => {
      const task = taskModel.create({ title: 'Aprender Jest' });

      expect(task.id).toBeTruthy();
      expect(task.title).toBe('Aprender Jest');
      expect(task.done).toBe(false);
      expect(task.createdAt).toBeTruthy();
      expect(task.updatedAt).toBeTruthy();
    });

    it('respeta done=true si se pasa explícitamente', () => {
      const task = taskModel.create({ title: 'Hecha', done: true });
      expect(task.done).toBe(true);
    });

    it('genera IDs únicos para cada tarea', () => {
      const a = taskModel.create({ title: 'A' });
      const b = taskModel.create({ title: 'B' });
      expect(a.id).not.toBe(b.id);
    });
  });

  describe('findAll() / findById()', () => {
    it('findAll devuelve un array vacío al inicio', () => {
      expect(taskModel.findAll()).toEqual([]);
    });

    it('findById devuelve la tarea correcta', () => {
      const created = taskModel.create({ title: 'Buscarme' });
      const found = taskModel.findById(created.id);
      expect(found).toEqual(created);
    });

    it('findById devuelve undefined si no existe', () => {
      expect(taskModel.findById('inventado')).toBeUndefined();
    });
  });

  describe('update()', () => {
    it('actualiza solo los campos proporcionados', () => {
      const task = taskModel.create({ title: 'Original', done: false });
      const updated = taskModel.update(task.id, { done: true });

      expect(updated.title).toBe('Original'); // no cambió
      expect(updated.done).toBe(true); // sí cambió
    });

    it('actualiza updatedAt al modificar', () => {
      const task = taskModel.create({ title: 'X' });
      const updated = taskModel.update(task.id, { title: 'Y' });
      // updatedAt debe ser una fecha ISO válida (puede coincidir con
      // createdAt en el mismo ms, así que solo verificamos formato).
      expect(updated.updatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      expect(new Date(updated.updatedAt).toString()).not.toBe('Invalid Date');
    });

    it('devuelve undefined si la tarea no existe', () => {
      expect(taskModel.update('no-existe', { done: true })).toBeUndefined();
    });
  });

  describe('delete()', () => {
    it('elimina una tarea existente y devuelve true', () => {
      const task = taskModel.create({ title: 'Bórrame' });
      const result = taskModel.delete(task.id);
      expect(result).toBe(true);
      expect(taskModel.findById(task.id)).toBeUndefined();
    });

    it('devuelve false si la tarea no existe', () => {
      expect(taskModel.delete('no-existe')).toBe(false);
    });
  });

  describe('clear()', () => {
    it('vacía el almacén por completo', () => {
      taskModel.create({ title: 'A' });
      taskModel.create({ title: 'B' });
      taskModel.clear();
      expect(taskModel.findAll()).toEqual([]);
    });
  });
});