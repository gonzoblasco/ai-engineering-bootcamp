/**
 * Punto de entrada del servidor.
 *
 * Importa `app` desde app.js y la levanta en el puerto configurado.
 * Separar app de server permite usar supertest en los tests sin
 * abrir un socket real.
 */
import { app } from './app.js';
import { config } from './config/index.js';

const server = app.listen(config.port, () => {
  console.log(`🚀 API To-Do escuchando en http://localhost:${config.port}`);
  console.log(`   Entorno: ${config.nodeEnv}`);
});

// Cierre ordenado al recibir señales de terminación (útil en producción).
function shutdown(signal) {
  console.log(`\n${signal} recibido, cerrando servidor...`);
  server.close(() => {
    console.log('Servidor cerrado. ¡Hasta pronto! 👋');
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));

export default server;