const authService = require('./auth-service');
const usersService = require('./users-service');
const ordersService = require('./orders-service');
const notificationsService = require('./notifications-service');
const gateway = require('./gateway');

async function main() {
  console.log('🚀 Iniciando sistema de microservicios...\n');

  console.log('   ┌─────────────────────────────────────────┐');
  console.log('   │         Microservices System            │');
  console.log('   │      AI Engineering Bootcamp N10        │');
  console.log('   └─────────────────────────────────────────┘\n');

  await authService.start();       // 3000
  await usersService.start();      // 3001
  await ordersService.start();     // 3002
  await notificationsService.start(); // sin HTTP
  await gateway.start();           // 8080

  console.log('\n✅ Todos los servicios listos\n');
  console.log('   🚪 Gateway:        http://localhost:8080');
  console.log('   🔐 Auth:           http://localhost:3000');
  console.log('   👤 Users:          http://localhost:3001');
  console.log('   📦 Orders:         http://localhost:3002');
  console.log('   🔔 Notifications:  event bus (sin HTTP)\n');
  console.log('   Health agregado:   http://localhost:8080/health');
  console.log('   Endpoints:         http://localhost:8080/\n');
}

// Graceful shutdown
const services = [authService, usersService, ordersService, notificationsService, gateway];

process.on('SIGINT', () => {
  console.log('\n🛑 Cerrando servicios...');
  for (const svc of services) {
    if (svc.stop) svc.stop();
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Cerrando servicios...');
  for (const svc of services) {
    if (svc.stop) svc.stop();
  }
  process.exit(0);
});

main().catch((err) => {
  console.error('Error al iniciar:', err);
  process.exit(1);
});
