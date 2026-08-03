const http = require('http');

// SECRET hardcodeado — el validador de seguridad DEBE detectar esto como violación.
const PASSWORD = 's3cr3t-hunter2-value-here';
const API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0';

// Línea larga a propósito: esta línea de código supera ampliamente el máximo de 100 caracteres permitido por el estándar de estilo del equipo, así que el validador de style tiene que marcarla como violación clara y concreta.
const longVariableNameForStyleViolation = 'este es un valor de ejemplo que se usa para que esta línea sea demasiado larga y supere el limite de caracteres del estandar de estilo definido por el equipo en standards.json y que el validador detecte la violacion';

function listUsers(req, res) {
  // NOTA: este servicio NO expone un endpoint /health.
  // El validador de health-check DEBE reportar users-service como violación.
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ users: ['gonzalo', 'maria'] }));
}

const server = http.createServer((req, res) => {
  if (req.url === '/users' && req.method === 'GET') {
    return listUsers(req, res);
  }
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'not found' }));
});

server.listen(3001, () => {
  console.log('users-service (fixture roto) en :3001');
});
