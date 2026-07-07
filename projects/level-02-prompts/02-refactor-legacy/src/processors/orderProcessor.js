// src/processors/orderProcessor.js
// Responsabilidad única: procesar items de tipo "order".

class OrderProcessor {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async canProcess(item) {
    return item.type === 'order';
  }

  async process(item) {
    const Order = require('../models/order');
    const order = new Order(item);
    const dto = order.toDTO();
    await this.orderRepository.append(dto);
    return dto;
  }
}

module.exports = OrderProcessor;