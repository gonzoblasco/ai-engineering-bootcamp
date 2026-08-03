const express = require('express');
const bus = require('../event-bus');

const app = express();
const PORT = 3002;

app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

let nextId = 1;
const orders = [];

// POST /orders — crear orden
app.post('/orders', (req, res) => {
  const { userId, product, amount } = req.body;

  if (!userId || typeof userId !== 'number') {
    return res.status(400).json({ error: 'userId es obligatorio y debe ser un número' });
  }

  if (!product || typeof product !== 'string' || product.trim().length === 0) {
    return res.status(400).json({ error: 'product es obligatorio' });
  }

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'amount debe ser un número mayor a 0' });
  }

  const order = {
    id: nextId++,
    userId,
    product: product.trim(),
    amount,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  orders.push(order);
  bus.publish('order.created', { ...order });

  res.status(201).json(order);
});

// GET /orders/:id — obtener orden
app.get('/orders/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const order = orders.find((o) => o.id === id);

  if (!order) {
    return res.status(404).json({ error: `Orden con id ${id} no encontrada` });
  }

  res.json(order);
});

// GET /orders — listar órdenes (con filtro opcional por userId)
app.get('/orders', (req, res) => {
  const userId = req.query.userId ? parseInt(req.query.userId, 10) : null;

  if (userId) {
    return res.json(orders.filter((o) => o.userId === userId));
  }

  res.json(orders);
});

// Consumir user.deleted — cancelar órdenes del usuario eliminado
bus.subscribe('user.deleted', (payload) => {
  const userOrders = orders.filter((o) => o.userId === payload.id && o.status !== 'cancelled');

  for (const order of userOrders) {
    order.status = 'cancelled';
    bus.publish('order.updated', { ...order });
    const cancelled = { id: order.id, userId: order.userId,
      product: order.product, amount: order.amount };
    bus.publish('order.cancelled', cancelled);
  }

  if (userOrders.length > 0) {
    const msg = `🔄 ${userOrders.length} orden(es) cancelada(s) del usuario ${payload.id}`;
    console.log(msg);
  }
});

function start() {
  return new Promise((resolve) => {
    app.listen(PORT, () => {
      console.log(`📦 Orders Service corriendo en http://localhost:${PORT}`);
      resolve();
    });
  });
}

function stop() {}

module.exports = { start, stop, app };
