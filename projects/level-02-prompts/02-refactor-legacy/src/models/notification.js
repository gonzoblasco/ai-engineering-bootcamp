// src/models/notification.js
// Responsabilidad única: representar una notificación y su canal.

const { NOTIFICATION_DEFAULTS } = require('../config/constants');

class Notification {
  constructor({ message }) {
    this.message = message || NOTIFICATION_DEFAULTS.MESSAGE;
  }

  toDTO() {
    return { sent: true, message: this.message };
  }
}

module.exports = Notification;