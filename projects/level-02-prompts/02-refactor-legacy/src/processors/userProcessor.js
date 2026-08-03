// src/processors/userProcessor.js
// Responsabilidad única: procesar items de tipo "user".

class UserProcessor {
  constructor(userRepository, emailService, logger) {
    this.userRepository = userRepository;
    this.emailService = emailService;
    this.logger = logger;
  }

  async canProcess(item) {
    return item.type === 'user';
  }

  async process(item) {
    const user = new (require('../models/user'))(item);
    if (!user.isAdult()) {
      this.logger.info('minor');
      return null;
    }
    if (!user.hasValidEmail()) {
      this.logger.info('no email');
      return null;
    }
    const dto = user.toDTO();
    this.emailService.sendTo(dto.email);
    await this.userRepository.save(dto);
    return dto;
  }
}

module.exports = UserProcessor;