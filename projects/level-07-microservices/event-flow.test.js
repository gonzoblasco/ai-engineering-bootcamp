#!/usr/bin/env node
/**
 * event-flow.test.js — Prove the event flow (Project 3)
 *
 * Run: node --test event-flow.test.js
 *
 * Verifies that the event bus:
 *   1. Delivers events to every subscriber
 *   2. Isolates failures (a throwing handler doesn't break the bus or others)
 *   3. Publishes payloads that satisfy the event contract
 *   4. Drives a real flow (user.created -> notifications reacts)
 *
 * If any of these break, your event architecture is untrustworthy.
 */
const test = require('node:test');
const assert = require('node:assert/strict');

const bus = require('./event-bus');
const { CONTRACT, missingFields } = require('./event-contract');
const notifications = require('./notifications-service');

test('bus delivers an event to every subscriber', () => {
  const received = [];
  const unsubA = bus.subscribe('x.test', (p) => received.push('A:' + p.n));
  const unsubB = bus.subscribe('x.test', (p) => received.push('B:' + p.n));
  const unsubAll = bus.subscribeAll((p, e) => { if (e === 'x.test') received.push('ALL:' + p.n); });

  bus.publish('x.test', { n: 1 });

  assert.deepEqual(received.sort(), ['A:1', 'ALL:1', 'B:1'].sort(), 'todos los suscriptores deben recibir el evento');

  unsubA(); unsubB(); unsubAll();
});

test('a throwing handler does not break the bus or other handlers', () => {
  const received = [];
  const unsubBad = bus.subscribe('x.fail', () => { throw new Error('handler roto'); });
  const unsubGood = bus.subscribe('x.fail', (p) => received.push(p.ok));
  const unsubAll = bus.subscribeAll((p, e) => { if (e === 'x.fail') received.push('all:' + p.ok); });

  // No debe lanzar — el _safeCall aísla el handler roto.
  assert.doesNotThrow(() => bus.publish('x.fail', { ok: true }));

  assert.deepEqual(received.sort(), ['all:true', true].sort(), 'el handler sano sigue corriendo pese al fallo del otro');

  unsubBad(); unsubGood(); unsubAll();
});

test('every contract event accepts a valid payload', () => {
  const sample = {
    'user.created': { id: 1, name: 'Ana', email: 'ana@x.com' },
    'user.registered': { id: 1, name: 'Ana', email: 'ana@x.com' },
    'user.deleted': { id: 1, name: 'Ana', email: 'ana@x.com' },
    'order.created': { id: 1, userId: 1, product: 'Teclado', amount: 100 },
    'order.updated': { id: 1, userId: 1, product: 'Teclado', amount: 100 },
    'order.cancelled': { id: 1, userId: 1, product: 'Teclado', amount: 100 },
  };

  for (const event of Object.keys(CONTRACT)) {
    const missing = missingFields(event, sample[event]);
    assert.deepEqual(missing, [], `${event} debería aceptar su payload válido`);
  }
});

test('contract flags a payload missing a required field', () => {
  const missing = missingFields('order.created', { id: 1, product: 'X' });
  assert.ok(missing.includes('userId'), 'order.created sin userId debe fallar el contrato');
  assert.ok(missing.includes('amount'), 'order.created sin amount debe fallar el contrato');
});

test('real flow: user.created reaches notifications', () => {
  const before = notifications.getLog().length;
  bus.publish('user.created', { id: 99, name: 'Test', email: 'test@x.com' });
  const after = notifications.getLog().length;
  assert.ok(after > before, 'publicar user.created debe hacer que notifications registre una notificación');
});
