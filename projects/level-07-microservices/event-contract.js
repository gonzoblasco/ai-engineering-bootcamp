/**
 * event-contract.js — El contrato de eventos del sistema (Project 3)
 *
 * Los eventos son una API asíncrona. Este archivo declara qué eventos
 * existen, qué payload llevan, y quién los produce/consume — como código,
 * para que un test pueda verificar que se cumplen.
 *
 * Un evento sin contrato chequeable es deuda silenciosa: el día que alguien
 * le cambia el shape, un consumidor se rompe en runtime, no al compilar.
 */

const CONTRACT = {
  'user.created': {
    required: ['id', 'name', 'email'],
    producer: 'users',
    consumers: ['notifications'],
  },
  'user.registered': {
    required: ['id', 'name', 'email'],
    producer: 'auth',
    consumers: ['notifications'],
  },
  'user.deleted': {
    required: ['id', 'name', 'email'],
    producer: 'users',
    consumers: ['orders', 'notifications'],
  },
  'order.created': {
    required: ['id', 'userId', 'product', 'amount'],
    producer: 'orders',
    consumers: ['notifications'],
  },
  'order.updated': {
    required: ['id', 'userId', 'product', 'amount'],
    producer: 'orders',
    consumers: ['notifications'],
  },
  'order.cancelled': {
    required: ['id', 'userId', 'product', 'amount'],
    producer: 'orders',
    consumers: ['notifications'],
  },
};

/**
 * Valida que un payload cumpla el contrato de un evento.
 * Devuelve la lista de campos requeridos que faltan ([] si cumple).
 */
function missingFields(event, payload) {
  const spec = CONTRACT[event];
  if (!spec) return [`evento '${event}' no declarado en el contrato`];
  return spec.required.filter((f) => payload[f] === undefined || payload[f] === null);
}

module.exports = { CONTRACT, missingFields };
