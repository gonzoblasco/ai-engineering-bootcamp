// Integration tests for the tasks API (Level 2, Project 1 step 5).
// Zero-dependency: uses Node's built-in test runner + http against an
// ephemeral port. Run: node --test

const test = require('node:test');
const assert = require('node:assert');
const http = require('http');
const app = require('./index'); // index.js exports the express app

let server;
let base = '';

test.before(async () => {
  await new Promise((resolve) => {
    server = app.listen(0, () => {
      base = `http://127.0.0.1:${server.address().port}`;
      resolve();
    });
  });
});

test.after(() => {
  if (server) server.close();
});

function req(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      method,
      host: '127.0.0.1',
      port: server.address().port,
      path,
      headers: { 'Content-Type': 'application/json' },
    };
    if (data) options.headers['Content-Length'] = Buffer.byteLength(data);
    const r = http.request(options, (res) => {
      let raw = '';
      res.on('data', (c) => (raw += c));
      res.on('end', () => {
        let json = null;
        try {
          json = raw ? JSON.parse(raw) : null;
        } catch {}
        resolve({ status: res.statusCode, json });
      });
    });
    r.on('error', reject);
    if (data) r.write(data);
    r.end();
  });
}

test('GET /tasks returns a list', async () => {
  const res = await req('GET', '/tasks');
  assert.strictEqual(res.status, 200);
  assert.ok(Array.isArray(res.json.data));
});

test('POST /tasks creates a task', async () => {
  const res = await req('POST', '/tasks', { title: 'Buy milk' });
  assert.strictEqual(res.status, 201);
  assert.strictEqual(res.json.title, 'Buy milk');
});

test('POST /tasks rejects missing title', async () => {
  const res = await req('POST', '/tasks', {});
  assert.strictEqual(res.status, 400);
});

test('POST /tasks rejects non-string title', async () => {
  const res = await req('POST', '/tasks', { title: 42 });
  assert.strictEqual(res.status, 400);
});

test('GET /tasks/:id returns a task by id', async () => {
  const created = await req('POST', '/tasks', { title: 'Find me' });
  const res = await req('GET', `/tasks/${created.json.id}`);
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.json.title, 'Find me');
});

test('GET /tasks/:id returns 404 for unknown id', async () => {
  const res = await req('GET', '/tasks/999999');
  assert.strictEqual(res.status, 404);
});

test('PUT /tasks/:id updates a task', async () => {
  const created = await req('POST', '/tasks', { title: 'Before' });
  const res = await req('PUT', `/tasks/${created.json.id}`, { done: true });
  assert.strictEqual(res.status, 200);
  assert.strictEqual(res.json.done, true);
});

test('DELETE /tasks/:id removes a task', async () => {
  const created = await req('POST', '/tasks', { title: 'Remove me' });
  const res = await req('DELETE', `/tasks/${created.json.id}`);
  assert.strictEqual(res.status, 204);
});
