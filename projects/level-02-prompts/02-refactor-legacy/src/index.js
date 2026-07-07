// src/index.js
// Composition root: construye e inyecta todas las dependencias.

const fs = require('fs');

const Logger = require('./services/logger');
const UserRepository = require('./services/userRepository');
const OrderRepository = require('./services/orderRepository');
const NotificationService = require('./services/notificationService');
const EmailService = require('./services/emailService');
const DataProcessor = require('./services/dataProcessor');
const ProcessorRegistry = require('./processors/registry');
const UserProcessor = require('./processors/userProcessor');
const OrderProcessor = require('./processors/orderProcessor');
const NotificationProcessor = require('./processors/notificationProcessor');
const { calculateAdjustedScore } = require('./utils/calc');

function createDataProcessor() {
  const logger = new Logger();
  const userRepository = new UserRepository(fs);
  const orderRepository = new OrderRepository(fs);
  const emailService = new EmailService(logger);
  const notificationService = new NotificationService(logger);

  const registry = new ProcessorRegistry();
  registry.register(new UserProcessor(userRepository, emailService, logger));
  registry.register(new OrderProcessor(orderRepository));
  registry.register(new NotificationProcessor(notificationService));

  return new DataProcessor(registry);
}

module.exports = {
  createDataProcessor,
  calculateAdjustedScore,
  DataProcessor,
  ProcessorRegistry,
  UserProcessor,
  OrderProcessor,
  NotificationProcessor,
  UserRepository,
  OrderRepository,
  NotificationService,
  EmailService,
  Logger,
};