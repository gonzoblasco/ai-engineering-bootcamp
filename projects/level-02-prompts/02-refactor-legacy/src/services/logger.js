// src/services/logger.js
// Abstracción de logging para no usar console.log directamente.

class Logger {
  constructor(writer = console) {
    this.writer = writer;
  }

  info(message) {
    this.writer.log(message);
  }

  warn(message) {
    this.writer.warn(message);
  }

  error(message) {
    this.writer.error(message);
  }
}

module.exports = Logger;