#!/usr/bin/env node
/**
 * system.test.js — Prove the full system (Level 10, Project 3)
 *
 * Run: node --test system.test.js
 *
 * The final boss. Verifies the WHOLE system works end-to-end:
 *   1. The orchestrator starts all 5 services (auth, users, orders, notifications, gateway)
 *   2. Auth works through the gateway (register, login, invalid credentials)
 *   3. The gateway routes /users and /orders to the right services
 *   4. The aggregated /health reports every service as ok
 *   5. A real user flow: register -> login -> create order -> list orders
 *
 * If any link in the chain breaks, the system is not production-ready.
 * An architecture you can't test end-to-end isn't trustworthy.
 */
const test = require('node:test');
const assert = require('node:assert/strict');

const authService = require('./auth-service');
const usersService = require('./users-service');
const ordersService = require('./orders-service');
const notificationsService = require('./notifications-service');
const gateway = require('./gateway');

const GATEWAY = 'http://localhost:8080';

// Silencia el console.log de los servicios durante el arranque y las requests,
// para no ensuciar el pipe del test runner (los services loguean al arrancar).
const originalLog = console.log;
const originalError = console.error;
function silenceLogs() {
  console.log = () => {};
  console.error = () => {};
}
function restoreLogs() {
  console.log = originalLog;
  console.error = originalError;
}

// --- Lifecycle: start the full system once, stop it after ---
test.before(async () => {
  silenceLogs();
  try {
    await authService.start();          // 3000
    await usersService.start();         // 3001
    await ordersService.start();        // 3002
    await notificationsService.start(); // event bus (sin HTTP)
    await gateway.start();              // 8080
  } finally {
    restoreLogs();
  }
});

test.after(() => {
  silenceLogs();
  gateway.stop();
  authService.stop();
  usersService.stop();
  ordersService.stop();
  notificationsService.stop();
  restoreLogs();
});

// --- Helpers ---
async function api(method, path, body) {
  const res = await fetch(GATEWAY + path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  const text = await res.text();
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  return { status: res.status, data };
}

test('gateway root lists the system endpoints', async () => {
  const { status, data } = await api('GET', '/');
  assert.equal(status, 200);
  assert.ok(data.message.includes('Microservices System'), 'debería describir el sistema');
  assert.ok(data.endpoints['POST /auth/register'], 'debería listar el endpoint de register');
});

test('aggregated /health reports all services ok', async () => {
  const { status, data } = await api('GET', '/health');
  assert.equal(status, 200);
  assert.equal(data.gateway, 'ok');
  assert.equal(data.services.auth, 'ok');
  assert.equal(data.services.users, 'ok');
  assert.equal(data.services.orders, 'ok');
  assert.equal(data.services.notifications, 'ok');
});

test('auth register creates a user through the gateway', async () => {
  const { status, data } = await api('POST', '/auth/register', {
    name: 'Gonzo',
    email: 'gonzo@test.com',
    password: 'secret123',
  });
  assert.equal(status, 201, 'register debería devolver 201');
  assert.ok(data.id, 'debería devolver el id del usuario');
  assert.equal(data.email, 'gonzo@test.com');
});

test('auth login returns a token', async () => {
  const { status, data } = await api('POST', '/auth/login', {
    email: 'gonzo@test.com',
    password: 'secret123',
  });
  assert.equal(status, 200, 'login con credenciales válidas debería devolver 200');
  assert.ok(data.token, 'debería devolver un token');
  assert.equal(data.user.email, 'gonzo@test.com');
});

test('auth rejects invalid credentials', async () => {
  const { status } = await api('POST', '/auth/login', {
    email: 'gonzo@test.com',
    password: 'wrongpassword',
  });
  assert.equal(status, 401, 'login con password incorrecta debería devolver 401');
});

test('auth rejects duplicate email', async () => {
  const { status } = await api('POST', '/auth/register', {
    name: 'Otro',
    email: 'gonzo@test.com', // ya registrado arriba
    password: 'secret123',
  });
  assert.equal(status, 409, 'registrar un email duplicado debería devolver 409');
});

test('gateway routes /users to the users service', async () => {
  const { status } = await api('POST', '/users', {
    name: 'Ana',
    email: 'ana@test.com',
  });
  assert.equal(status, 201, 'POST /users a través del gateway debería llegar a users-service');

  const list = await api('GET', '/users');
  assert.equal(list.status, 200);
  assert.ok(Array.isArray(list.data), 'GET /users debería devolver un array');
});

test('gateway routes /orders to the orders service', async () => {
  const { status } = await api('POST', '/orders', {
    product: 'Teclado Mecánico',
    amount: 120,
    userId: 1,
  });
  assert.equal(status, 201, 'POST /orders a través del gateway debería llegar a orders-service');

  const list = await api('GET', '/orders');
  assert.equal(list.status, 200);
  assert.ok(Array.isArray(list.data), 'GET /orders debería devolver un array');
});

test('gateway returns 404 for unknown routes', async () => {
  const { status } = await api('GET', '/unknown-route');
  assert.equal(status, 404, 'una ruta no mapeada debería devolver 404');
});

test('full user flow: register -> login -> create order -> list orders', async () => {
  // register
  const reg = await api('POST', '/auth/register', {
    name: 'Flow',
    email: 'flow@test.com',
    password: 'flowpass123',
  });
  assert.equal(reg.status, 201);
  const userId = reg.data.id;

  // login -> token
  const login = await api('POST', '/auth/login', {
    email: 'flow@test.com',
    password: 'flowpass123',
  });
  assert.equal(login.status, 200);
  assert.ok(login.data.token, 'el flujo debería obtener un token');

  // create order (userId del usuario registrado)
  const order = await api('POST', '/orders', {
    product: 'Monitor 4K',
    amount: 450,
    userId,
  });
  assert.equal(order.status, 201);

  // list orders y confirmar que la orden creada está
  const orders = await api('GET', '/orders');
  assert.equal(orders.status, 200);
  const found = orders.data.find((o) => o.product === 'Monitor 4K');
  assert.ok(found, 'la orden creada debería estar en la lista');
});
