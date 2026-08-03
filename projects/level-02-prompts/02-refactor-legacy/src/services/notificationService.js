// src/services/notificationService.js
// Responsabilidad única: enviar notificaciones por múltiples canales.

const { NOTIFICATION_CHANNELS } = require('../config/constants');

class NotificationService {
  constructor(logger) {
    this.logger = logger;
    this.channels = NOTIFICATION_CHANNELS;
  }

  send(notification) {
    this.channels.forEach((channel) => {
      this.logger.info(`${channel.toUpperCase()}: ${notification.message}`);
    });
    return notification.toDTO();
  }
}

module.exports = NotificationService;