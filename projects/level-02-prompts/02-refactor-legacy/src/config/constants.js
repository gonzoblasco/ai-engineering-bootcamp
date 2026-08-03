// config/constants.js
// Constantes extraídas de magic numbers y hardcoded values del legacy.

const DISCOUNTS = {
  TIER_1_THRESHOLD: 100,
  TIER_1_RATE: 0.10,
  TIER_2_THRESHOLD: 500,
  TIER_2_RATE: 0.15,
};

const TAX_RATE = 0.21;

const USER_LIMITS = {
  MAX_NAME_LENGTH: 50,
  MIN_ADULT_AGE: 18,
};

const NOTIFICATION_CHANNELS = ['email', 'sms', 'push'];

const NOTIFICATION_DEFAULTS = {
  MESSAGE: 'default message',
};

const SMTP = {
  HOST: 'smtp.fake.com',
  PORT: 587,
};

const FILE_PATHS = {
  USERS: './users.json',
  ORDERS_LOG: './orders.log',
};

module.exports = {
  DISCOUNTS,
  TAX_RATE,
  USER_LIMITS,
  NOTIFICATION_CHANNELS,
  NOTIFICATION_DEFAULTS,
  SMTP,
  FILE_PATHS,
};