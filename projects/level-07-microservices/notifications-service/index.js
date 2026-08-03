const bus = require('../event-bus');

const notifications = [];

// Consumir user.created
bus.subscribe('user.created', (payload) => {
  const msg = `📧 Email: Bienvenido ${payload.name}! (${payload.email})`;
  notifications.push({ type: 'user.created', message: msg, timestamp: new Date().toISOString() });
  console.log(msg);
});

// Consumir order.created
bus.subscribe('order.created', (payload) => {
  const msg = `📧 Email: Orden #${payload.id} creada — ${payload.product} por $${payload.amount}`;
  notifications.push({ type: 'order.created', message: msg, timestamp: new Date().toISOString() });
  console.log(msg);
});

// Consumir order.cancelled
bus.subscribe('order.cancelled', (payload) => {
  const msg = `📧 Email: Orden #${payload.id} cancelada`;
  notifications.push({ type: 'order.cancelled', message: msg, timestamp: new Date().toISOString() });
  console.log(msg);
});

function getLog() {
  return notifications;
}

function start() {
  console.log('🔔 Notifications Service listo (sin HTTP)');
  return Promise.resolve();
}

function stop() {}

module.exports = { start, stop, getLog };
