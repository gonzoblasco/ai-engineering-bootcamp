// src/processors/notificationProcessor.js
// Responsabilidad única: procesar items de tipo "notification".

class NotificationProcessor {
  constructor(notificationService) {
    this.notificationService = notificationService;
  }

  async canProcess(item) {
    return item.type === 'notification';
  }

  async process(item) {
    const Notification = require('../models/notification');
    const notification = new Notification(item);
    return this.notificationService.send(notification);
  }
}

module.exports = NotificationProcessor;