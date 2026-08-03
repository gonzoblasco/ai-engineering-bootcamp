// src/services/emailService.js
// Responsabilidad única: simular el envío de emails.

const { SMTP } = require('../config/constants');

class EmailService {
  constructor(logger) {
    this.logger = logger;
  }

  sendTo(email) {
    this.logger.info(`Sending to ${SMTP.HOST}:${SMTP.PORT} for ${email}`);
  }
}

module.exports = EmailService;