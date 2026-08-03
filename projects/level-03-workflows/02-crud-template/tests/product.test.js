import { describe, beforeEach, afterEach, afterAll, it, expect } from '@jest/globals';
import request from 'supertest';
import { app } from '../src/app.js';
import { prisma } from '../src/config/db.js';

let testUser;

beforeEach(async () => {
  // Limpiar BD
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  // Crear usuario de prueba
  testUser = await prisma.user.create({
    data: {
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword123',
    },
  });
});

afterAll(async () => {
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.$disconnect();
});

describe('Products API', () => {
  describe('POST /api/products', () => {
    it('debe crear un producto y responder 201', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({
          name: 'Laptop',
          price: 999.99,
          description: 'Una laptop',
          stock: 10,
          userId: testUser.id,
        });

      expect(res.status).toBe(201);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.name).toBe('Laptop');
      expect(res.body.data.price).toBe(999.99);
    });

    it('debe responder 400 si la validación falla', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({
          name: '',
          price: -1,
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toHaveProperty('code', 'VALIDATION_ERROR');
    });

    it('debe responder 404 si el userId no existe', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({
          name: 'Laptop',
          price: 999.99,
          stock: 10,
          userId: 'nonexistent',
        });

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('GET /api/products', () => {
    it('debe listar todos los productos y responder 200', async () => {
      await prisma.product.create({
        data: {
          name: 'Laptop',
          price: 999.99,
          stock: 10,
          userId: testUser.id,
        },
      });

      const res = await request(app).get('/api/products');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
    });
  });

  describe('GET /api/products/:id', () => {
    it('debe responder 200 con el producto e incluir la relación user', async () => {
      const product = await prisma.product.create({
        data: {
          name: 'Laptop',
          price: 999.99,
          stock: 10,
          userId: testUser.id,
        },
      });

      const res = await request(app).get(`/api/products/${product.id}`);

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Laptop');
      expect(res.body.data.user).toBeDefined();
      expect(res.body.data.user.email).toBe('test@example.com');
    });

    it('debe responder 404 si el producto no existe', async () => {
      const res = await request(app).get('/api/products/nonexistent');

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('PUT /api/products/:id', () => {
    it('debe actualizar el producto y responder 200', async () => {
      const product = await prisma.product.create({
        data: {
          name: 'Laptop',
          price: 999.99,
          stock: 10,
          userId: testUser.id,
        },
      });

      const res = await request(app)
        .put(`/api/products/${product.id}`)
        .send({ name: 'Laptop Pro' });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Laptop Pro');
    });

    it('debe responder 404 si el producto no existe', async () => {
      const res = await request(app)
        .put('/api/products/nonexistent')
        .send({ name: 'Laptop Pro' });

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('debe eliminar el producto y responder 204', async () => {
      const product = await prisma.product.create({
        data: {
          name: 'Laptop',
          price: 999.99,
          stock: 10,
          userId: testUser.id,
        },
      });

      const res = await request(app).delete(`/api/products/${product.id}`);

      expect(res.status).toBe(204);
    });

    it('debe responder 404 si el producto no existe', async () => {
      const res = await request(app).delete('/api/products/nonexistent');

      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });
});