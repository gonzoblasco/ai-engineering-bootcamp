import request from 'supertest';
import { app } from './setup.js';

describe('Auth — Registro', () => {
  it('registra un usuario nuevo y devuelve tokens', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'Password123!' });

    expect(res.status).toBe(201);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('refreshToken');
    expect(res.body.data.user.email).toBe('test@example.com');
    expect(res.body.data.user.role).toBe('user');
    expect(res.body.data.user).not.toHaveProperty('password');
  });

  it('rechaza registro sin email o password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com' });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('rechaza email duplicado con 409', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'dup@example.com', password: 'Password123!' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'dup@example.com', password: 'Password123!' });

    expect(res.status).toBe(409);
  });
});

describe('Auth — Login', () => {
  beforeEach(async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ email: 'login@example.com', password: 'Password123!' });
  });

  it('loguea con credenciales válidas y devuelve tokens', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@example.com', password: 'Password123!' });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('refreshToken');
  });

  it('devuelve 401 con password incorrecta', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@example.com', password: 'wrong' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Credenciales inválidas');
  });

  it('devuelve el mismo mensaje para email inexistente (anti-enumeration)', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'noexist@example.com', password: 'whatever' });

    expect(res.status).toBe(401);
    expect(res.body.error).toBe('Credenciales inválidas');
  });
});

describe('Auth — Refresh', () => {
  let refreshToken;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'refresh@example.com', password: 'Password123!' });
    refreshToken = res.body.data.refreshToken;
  });

  it('intercambia refresh token por un access token nuevo', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('refreshToken');
  });

  it('revoca el refresh token viejo (rotación)', async () => {
    await request(app).post('/api/auth/refresh').send({ refreshToken });

    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });

    expect(res.status).toBe(401);
  });

  it('rechaza refresh token inexistente', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: 'fake-token' });

    expect(res.status).toBe(401);
  });
});

describe('Auth — Logout', () => {
  let refreshToken;

  beforeEach(async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'logout@example.com', password: 'Password123!' });
    refreshToken = res.body.data.refreshToken;
  });

  it('revoca el refresh token', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .send({ refreshToken });

    expect(res.status).toBe(200);

    // Ya no se puede usar para refrescar
    const refreshRes = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });

    expect(refreshRes.status).toBe(401);
  });
});