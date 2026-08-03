// src/models/user.js
// Responsabilidad única: representar y validar un usuario.

const { USER_LIMITS } = require('../config/constants');

class User {
  constructor({ id, name, email, age }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.age = age;
  }

  isAdult() {
    return this.age >= USER_LIMITS.MIN_ADULT_AGE;
  }

  hasValidEmail() {
    return this.email != null && this.email !== '';
  }

  hasValidName() {
    return this.name.length <= USER_LIMITS.MAX_NAME_LENGTH;
  }

  toDTO() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      status: this.hasValidName() ? 'active' : 'name too long',
    };
  }
}

module.exports = User;