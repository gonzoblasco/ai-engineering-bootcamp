/**
 * Tests de los endpoints de Tasks usando Jest + supertest.
 *
 * Se importa `app` (no `server`) para no abrir un socket real; supertest
 * se encarga de hacer las peticiones contra la app Express directamente.
 */
import { describe, it, expect, beforeEach } from '@jest/globals';
import request from 'supertest';
import { app } from '../src/app.js';
import { taskModel } from '../src/models/taskModel.js';

describe('Tasks API', () => {
  // Limpia el almacén en memoria antes de cada test para que sean
  // independientes entre sí.
  beforeEach(() => taskModel.clear());

  describe('GET /tasks', () => {
    it('responde 200 con un array (vacío al inicio)', async () => {
      const res = await request(app).get('/tasks');
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });

    it('devuelve las tareas creadas', async () => {
      await request(app).post('/tasks').send({ title: 'Aprender prompts' });
      await request(app).post('/tasks').send({ title: 'Hacer tests' });

      const res = await request(app).get('/tasks');
      expect(res.body.data).toHaveLength(2);
      expect(res.body.data[0]).toHaveProperty('title', 'Aprender prompts');
    });
  });

  describe('GET /tasks/:id', () => {
    it('responde 200 si la tarea existe', async () => {
      const created = await request(app).post('/tasks').send({ title: 'Leer docs' });
      const res = await request(app).get(`/tasks/${created.body.data.id}`);
      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Leer docs');
    });

    it('responde 404 si la tarea no existe', async () => {
      const res = await request(app).get('/tasks/no-existe');
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('TASK_NOT_FOUND');
    });
  });

  describe('POST /tasks', () => {
    it('crea una tarea y responde 201', async () => {
      const res = await request(app).post('/tasks').send({ title: 'Nueva' });
      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.title).toBe('Nueva');
      expect(res.body.data.done).toBe(false);
    });

    it('responde 400 si falta el título', async () => {
      const res = await request(app).post('/tasks').send({});
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('responde 400 si done no es booleano', async () => {
      const res = await request(app).post('/tasks').send({ title: 'X', done: 'si' });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('responde 400 si el título supera 200 caracteres', async () => {
      const longTitle = 'a'.repeat(201);
      const res = await request(app).post('/tasks').send({ title: longTitle });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
      // El detalle debe indicar el campo problemático
      expect(res.body.error.details[0].field).toBe('title');
    });

    it('trim() elimina espacios alrededor del título', async () => {
      const res = await request(app).post('/tasks').send({ title: '  Con espacios  ' });
      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe('Con espacios');
    });

    it('responde 400 si el título es solo espacios (vacío tras trim)', async () => {
      const res = await request(app).post('/tasks').send({ title: '   ' });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('el error 400 incluye details con field y message', async () => {
      const res = await request(app).post('/tasks').send({});
      expect(res.body.error.details).toBeInstanceOf(Array);
      expect(res.body.error.details[0]).toHaveProperty('field');
      expect(res.body.error.details[0]).toHaveProperty('message');
    });
  });

  describe('PUT /tasks/:id', () => {
    it('actualiza una tarea existente', async () => {
      const created = await request(app).post('/tasks').send({ title: 'Vieja' });
      const res = await request(app).put(`/tasks/${created.body.data.id}`).send({ done: true });
      expect(res.status).toBe(200);
      expect(res.body.data.done).toBe(true);
      expect(res.body.data.title).toBe('Vieja'); // no se sobreescribe
    });

    it('responde 404 si la tarea no existe', async () => {
      const res = await request(app).put('/tasks/no-existe').send({ done: true });
      expect(res.status).toBe(404);
    });

    it('actualiza solo el título manteniendo done', async () => {
      const created = await request(app).post('/tasks').send({ title: 'Vieja', done: true });
      const res = await request(app).put(`/tasks/${created.body.data.id}`).send({ title: 'Nueva' });
      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe('Nueva');
      expect(res.body.data.done).toBe(true); // se mantiene
    });

    it('responde 400 si el título actualizado es vacío', async () => {
      const created = await request(app).post('/tasks').send({ title: 'Vieja' });
      const res = await request(app).put(`/tasks/${created.body.data.id}`).send({ title: '' });
      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('elimina una tarea existente y responde 204', async () => {
      const created = await request(app).post('/tasks').send({ title: 'Bórrame' });
      const res = await request(app).delete(`/tasks/${created.body.data.id}`);
      expect(res.status).toBe(204);

      // Ya no existe
      const get = await request(app).get(`/tasks/${created.body.data.id}`);
      expect(get.status).toBe(404);
    });

    it('responde 404 si la tarea no existe', async () => {
      const res = await request(app).delete('/tasks/no-existe');
      expect(res.status).toBe(404);
    });
  });

  describe('Health y rutas inexistentes', () => {
    it('GET /health responde 200', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
    });

    it('ruta inexistente responde 404 con JSON', async () => {
      const res = await request(app).get('/no-existe');
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });

    it('POST a ruta inexistente también responde 404', async () => {
      const res = await request(app).post('/no-existe').send({ foo: 'bar' });
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('Estructura de respuestas', () => {
    it('las respuestas exitosas envuelven datos en { data }', async () => {
      const res = await request(app).post('/tasks').send({ title: 'Estructura' });
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toHaveProperty('id');
    });

    it('los errores envuelven detalles en { error }', async () => {
      const res = await request(app).get('/tasks/no-existe');
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toHaveProperty('code');
      expect(res.body.error).toHaveProperty('message');
    });
  });

  describe('Paginación y filtering en GET /tasks', () => {
    // Crea 15 tareas: 7 con "api" en el título, 8 con "docs"; algunas done.
    beforeEach(async () => {
      for (let i = 1; i <= 7; i++) {
        await request(app).post('/tasks').send({ title: `api-${i}`, done: i % 2 === 0 });
      }
      for (let i = 1; i <= 8; i++) {
        await request(app).post('/tasks').send({ title: `docs-${i}`, done: false });
      }
    });

    it('devuelve meta con page, limit, total y totalPages', async () => {
      const res = await request(app).get('/tasks?page=1&limit=5');
      expect(res.status).toBe(200);
      expect(res.body.meta).toEqual({
        page: 1,
        limit: 5,
        total: 15,
        totalPages: 3,
        hasNext: true,
        hasPrev: false,
      });
      expect(res.body.data).toHaveLength(5);
    });

    it('la página 2 devuelve los siguientes 5 elementos', async () => {
      const res = await request(app).get('/tasks?page=2&limit=5');
      expect(res.body.meta.page).toBe(2);
      expect(res.body.data).toHaveLength(5);
      expect(res.body.meta.hasNext).toBe(true);
      expect(res.body.meta.hasPrev).toBe(true);
    });

    it('la última página tiene hasNext=false', async () => {
      const res = await request(app).get('/tasks?page=3&limit=5');
      expect(res.body.meta.totalPages).toBe(3);
      expect(res.body.data).toHaveLength(5);
      expect(res.body.meta.hasNext).toBe(false);
      expect(res.body.meta.hasPrev).toBe(true);
    });

    it('filtra por título (substring, case-insensitive)', async () => {
      const res = await request(app).get('/tasks?title=API');
      expect(res.body.meta.total).toBe(7);
      expect(res.body.data.every((t) => t.title.includes('api'))).toBe(true);
    });

    it('filtra por done=true', async () => {
      const res = await request(app).get('/tasks?done=true');
      // api-2, api-4, api-6 → 3 tareas done
      expect(res.body.meta.total).toBe(3);
      expect(res.body.data.every((t) => t.done === true)).toBe(true);
    });

    it('filtra por done=false', async () => {
      const res = await request(app).get('/tasks?done=false');
      expect(res.body.meta.total).toBe(12);
      expect(res.body.data.every((t) => t.done === false)).toBe(true);
    });

    it('combina filtering por título y done', async () => {
      const res = await request(app).get('/tasks?title=api&done=false');
      // api-1, api-3, api-5, api-7 → 4 tareas api no done
      expect(res.body.meta.total).toBe(4);
      expect(res.body.data.every((t) => t.title.includes('api'))).toBe(true);
      expect(res.body.data.every((t) => t.done === false)).toBe(true);
    });

    it('combina paginación + filtering', async () => {
      const res = await request(app).get('/tasks?title=docs&done=false&page=1&limit=3');
      expect(res.body.meta.total).toBe(8);
      expect(res.body.meta.totalPages).toBe(3);
      expect(res.body.data).toHaveLength(3);
      expect(res.body.data.every((t) => t.title.includes('docs'))).toBe(true);
    });

    it('usa valores por defecto si no se pasan query params', async () => {
      const res = await request(app).get('/tasks');
      expect(res.body.meta.page).toBe(1);
      expect(res.body.meta.limit).toBe(10);
      expect(res.body.meta.total).toBe(15);
      expect(res.body.data).toHaveLength(10);
    });

    it('limit=0 o negativo cae al valor por defecto (10)', async () => {
      const res = await request(app).get('/tasks?limit=0');
      expect(res.body.meta.limit).toBe(10);
    });

    it('page=0 o negativo cae a página 1', async () => {
      const res = await request(app).get('/tasks?page=-3');
      expect(res.body.meta.page).toBe(1);
    });

    it('un filtro sin resultados devuelve data vacía y total 0', async () => {
      const res = await request(app).get('/tasks?title=inexistente');
      expect(res.body.meta.total).toBe(0);
      expect(res.body.data).toEqual([]);
      expect(res.body.meta.totalPages).toBe(1);
    });
  });
});