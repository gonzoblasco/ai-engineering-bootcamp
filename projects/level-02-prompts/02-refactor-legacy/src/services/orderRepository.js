// src/services/orderRepository.js
// Responsabilidad única: persistir pedidos en un log.

const { FILE_PATHS } = require('../config/constants');

class OrderRepository {
  constructor(fs, filePath = FILE_PATHS.ORDERS_LOG) {
    this.fs = fs;
    this.filePath = filePath;
  }

  append(orderDTO) {
    return new Promise((resolve, reject) => {
      const line = `${orderDTO.id},${orderDTO.total},${orderDTO.grandTotal}\n`;
      this.fs.appendFile(this.filePath, line, (err) => {
        if (err) return reject(err);
        resolve(orderDTO);
      });
    });
  }
}

module.exports = OrderRepository;