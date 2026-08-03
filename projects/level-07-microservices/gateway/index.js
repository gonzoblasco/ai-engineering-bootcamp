const http = require('http');

const PORT = 8080;

// Mapa de rutas → servicio destino
const ROUTES = [
  { prefix: '/auth', target: { host: 'localhost', port: 3000 } },
  { prefix: '/users', target: { host: 'localhost', port: 3001 } },
  { prefix: '/orders', target: { host: 'localhost', port: 3002 } },
];

// Estados de los servicios (para /health agregado)
const SERVICE_STATUS = {
  auth: { host: 'localhost', port: 3000 },
  users: { host: 'localhost', port: 3001 },
  orders: { host: 'localhost', port: 3002 },
  notifications: { host: 'localhost', port: null, internal: true },
};

function forwardRequest(req, res, target, path) {
  const start = Date.now();
  const bodyChunks = [];

  req.on('data', (chunk) => bodyChunks.push(chunk));

  req.on('end', () => {
    const body = Buffer.concat(bodyChunks);

    const options = {
      host: target.host,
      port: target.port,
      path,
      method: req.method,
      headers: { ...req.headers, host: `${target.host}:${target.port}` },
    };

    const proxy = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res);
      const duration = Date.now() - start;
      console.log(`[Gateway] ${req.method} ${req.url} → ${target.host}:${target.port}${path} — ${duration}ms`);
    });

    proxy.on('error', (err) => {
      console.error(`[Gateway] Error forwarding a ${target.host}:${target.port}:`, err.message);
      res.writeHead(502, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Servicio no disponible', target: path }));
    });

    if (body.length > 0) {
      proxy.write(body);
    }
    proxy.end();
  });
}

function checkHealth(service) {
  return new Promise((resolve) => {
    if (service.internal) {
      return resolve('ok');
    }

    const req = http.get({ host: service.host, port: service.port, path: '/health', timeout: 2000 }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => resolve(res.statusCode === 200 ? 'ok' : 'degraded'));
    });

    req.on('error', () => resolve('down'));
    req.on('timeout', () => {
      req.destroy();
      resolve('down');
    });
  });
}

const server = http.createServer(async (req, res) => {
  // GET / — lista de endpoints
  if (req.url === '/' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      message: 'Microservices System — AI Engineering Bootcamp',
      gateway: 'http://localhost:8080',
      endpoints: {
        'GET /health': 'Estado agregado de todos los servicios',
        'POST /auth/register': 'Registrar usuario',
        'POST /auth/login': 'Login (devuelve token)',
        'POST /users': 'Crear usuario',
        'GET /users': 'Listar usuarios',
        'GET /users/:id': 'Obtener usuario',
        'POST /orders': 'Crear orden',
        'GET /orders': 'Listar órdenes',
      },
      services: {
        auth: 'http://localhost:3000',
        users: 'http://localhost:3001',
        orders: 'http://localhost:3002',
      },
    }, null, 2));
    return;
  }

  // GET /health — estado agregado
  if (req.url === '/health' && req.method === 'GET') {
    const statuses = {};
    for (const [name, svc] of Object.entries(SERVICE_STATUS)) {
      statuses[name] = await checkHealth(svc);
    }

    const allOk = Object.values(statuses).every((s) => s === 'ok');
    res.writeHead(allOk ? 200 : 503, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ gateway: 'ok', services: statuses }, null, 2));
    return;
  }

  // Enrutar por prefijo
  const route = ROUTES.find((r) => req.url.startsWith(r.prefix));

  if (!route) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Ruta no encontrada', hint: 'Ver GET / para endpoints disponibles' }));
    return;
  }

  const target = route.target;
  const path = req.url;
  forwardRequest(req, res, target, path);
});

function start() {
  return new Promise((resolve) => {
    server.listen(PORT, () => {
      console.log(`🚪 Gateway corriendo en http://localhost:${PORT}`);
      resolve();
    });
  });
}

function stop() {
  server.close();
}

module.exports = { start, stop, server };
