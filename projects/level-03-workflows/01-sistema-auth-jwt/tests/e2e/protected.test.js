import request from 'supertest';
import jwt from 'jsonwebtoken';
import { app } from './setup.js';
import { config } from '../../src/config/index.js';

describe('Rutas protegidas y roles', () => {
  let userToken;
  let adminToken;

  beforeEach(async () => {
    // Usuario normal
    const userRes = await request(app)
      .post('/api/auth/register')
      .send({ email: 'user@example.com', password: 'Password123!' });
    userToken = userRes.body.data.accessToken;

    // Admin (creado directamente como admin via DB no es posible desde la API
    // pública, así que registramos y luego promovemos a admin manualmente).
    // Para este test, creamos el admin usando el flujo de la API:
    // primero registramos un user, lo promovemos con Prisma, y logueamos.
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();

    const adminRes = await request(app)
      .post('/api/auth/register')
      .send({ email: 'admin@example.com', password: 'Password123!' });

    await prisma.user.update({
      where: { email: 'admin@example.com' },
      data: { role: 'admin' },
    });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'Password123!' });

    adminToken = loginRes.body.data.accessToken;
    await prisma.$disconnect();
  });

  it('GET /api/users/me devuelve el perfil del usuario autenticado', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('user@example.com');
    expect(res.body.data.role).toBe('user');
  });

  it('rechaza acceso sin token', async () => {
    const res = await request(app).get('/api/users/me');

    expect(res.status).toBe(401);
  });

  it('rechaza acceso con token inválido', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', 'Bearer invalid-token');

    expect(res.status).toBe(401);
  });

  it('un user no puede crear admins (403)', async () => {
    const res = await request(app)
      .post('/api/users/admin')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ email: 'newadmin@example.com', password: 'Password123!' });

    expect(res.status).toBe(403);
  });

  it('un admin puede crear otros admins', async () => {
    const res = await request(app)
      .post('/api/users/admin')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ email: 'newadmin@example.com', password: 'Password123!' });

    expect(res.status).toBe(201);
    expect(res.body.data.role).toBe('admin');
  });

  it('acepta token con scheme "bearer" en minúscula (RFC 6750)', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('user@example.com');
  });

  it('acepta token con scheme "BEARER" en mayúscula (RFC 6750)', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `BEARER ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.email).toBe('user@example.com');
  });

  it('rechaza token malformado sin sub con 401 (no 500)', async () => {
    // JWT firmado con el secret correcto pero sin claim sub en el payload
    const malformedToken = jwt.sign({}, config.jwt.secret);

    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', `Bearer ${malformedToken}`);

    expect(res.status).toBe(401);
  });
});