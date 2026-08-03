import { describe, beforeEach, afterAll, it, expect } from '@jest/globals';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/config/db.js';

beforeEach(async () => {
  // Limpiar BD (productos primero por FK)
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

describe('Users API', () => {
  describe('POST /api/users', () => {
    it('debe crear un usuario y responder 201 sin devolver password', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.name).toBe('John Doe');
      expect(res.body.data.email).toBe('john@example.com');
      expect(res.body.data).not.toHaveProperty('password');
    });

    it('debe responder 400 si la validación falla', async () => {
      const res = await request(app)
        .post('/api/users')
        .send({
          name: '',
          email: 'not-an-email',
          password: 'short',
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });

    it('debe responder 409 si el email ya existe', async () => {
      await prisma.user.create({
        data: {
          name: 'Existing',
          email: 'existing@example.com',
          password: 'hashedpassword123',
        },
      });

      const res = await request(app)
        .post('/api/users')
        .send({
          name: 'John Doe',
          email: 'existing@example.com',
          password: 'password123',
        });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('CONFLICT');
    });
  });

  describe('GET /api/users', () => {
    it('debe listar todos los usuarios y responder 200 sin passwords', async () => {
      await prisma.user.create({
        data: {
          name: 'John',
          email: 'john@example.com',
          password: 'hashedpassword123',
        },
      });

      const res = await request(app).get('/api/users');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0]).not.toHaveProperty('password');
    });
  });

  describe('GET /api/users/:id', () => {
    it('debe responder 200 con el usuario e incluir products', async () => {
      const user = await prisma.user.create({
        data: {
          name: 'John',
          email: 'john@example.com',
          password: 'hashedpassword123',
        },
      });

      const res = await request(app).get(`/api/users/${user.id}`);

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('John');
      expect(res.body.data.products).toBeDefined();
      expect(res.body.data).not.toHaveProperty('password');
    });

    it('debe responder 404 si el usuario no existe', async () => {
      const res = await request(app).get('/api/users/nonexistent');

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('debe actualizar el usuario y responder 200', async () => {
      const user = await prisma.user.create({
        data: {
          name: 'John',
          email: 'john@example.com',
          password: 'hashedpassword123',
        },
      });

      const res = await request(app)
        .put(`/api/users/${user.id}`)
        .send({ name: 'John Updated' });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('John Updated');
      expect(res.body.data).not.toHaveProperty('password');
    });

    it('debe responder 404 si el usuario no existe', async () => {
      const res = await request(app)
        .put('/api/users/nonexistent')
        .send({ name: 'John Updated' });

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('debe eliminar el usuario y responder 204', async () => {
      const user = await prisma.user.create({
        data: {
          name: 'John',
          email: 'john@example.com',
          password: 'hashedpassword123',
        },
      });

      const res = await request(app).delete(`/api/users/${user.id}`);

      expect(res.status).toBe(204);
    });

    it('debe responder 404 si el usuario no existe', async () => {
      const res = await request(app).delete('/api/users/nonexistent');

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });
});