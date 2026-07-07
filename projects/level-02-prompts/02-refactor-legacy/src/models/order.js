// src/models/order.js
// Responsabilidad única: calcular totales, descuentos e impuestos de un pedido.

const { DISCOUNTS, TAX_RATE } = require('../config/constants');

class Order {
  constructor({ id, items }) {
    this.id = id;
    this.items = items;
    this.date = new Date().toISOString();
  }

  subtotal() {
    return this.items.reduce(
      (sum, item) => sum + item.price * item.qty,
      0
    );
  }

  discountRate() {
    if (this.subtotal() > DISCOUNTS.TIER_2_THRESHOLD) {
      return DISCOUNTS.TIER_2_RATE;
    }
    if (this.subtotal() > DISCOUNTS.TIER_1_THRESHOLD) {
      return DISCOUNTS.TIER_1_RATE;
    }
    return 0;
  }

  discountedTotal() {
    return this.subtotal() * (1 - this.discountRate());
  }

  tax() {
    return this.discountedTotal() * TAX_RATE;
  }

  grandTotal() {
    return this.discountedTotal() + this.tax();
  }

  toDTO() {
    return {
      id: this.id,
      total: this.discountedTotal(),
      date: this.date,
      tax: this.tax(),
      grandTotal: this.grandTotal(),
    };
  }
}

module.exports = Order;