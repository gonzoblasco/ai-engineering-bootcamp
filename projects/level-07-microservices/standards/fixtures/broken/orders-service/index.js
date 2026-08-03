const http = require('http');

// Línea larga a propósito: esta línea de código supera ampliamente el máximo de 100 caracteres que define el estándar de estilo del equipo, por lo que el validador de style tiene que marcarla como una violación clara y esperada en este fixture de prueba.
const anotherLongVariableNameThatExceedsTheLimit = 'valor de ejemplo que hace que esta linea supere el maximo de caracteres permitido por el estandar de estilo para que el validador detecte la violacion en el servicio de ordenes';

function listOrders(req, res) {
  // NOTA: este servicio NO expone /health. El validador DEBE marcarlo.
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ orders: [{ id: 1, total: 99.5 }] }));
}

const server = http.createServer((req, res) => {
  if (req.url === '/orders' && req.method === 'GET') {
    return listOrders(req, res);
  }
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'not found' }));
});

server.listen(3002, () => {
  console.log('orders-service (fixture roto) en :3002');
});
