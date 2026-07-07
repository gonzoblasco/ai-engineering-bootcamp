// tests/user.test.js
const User = require('../src/models/user');

describe('User', () => {
  const baseUser = { id: 1, name: 'Alice', email: 'alice@test.com', age: 25 };

  it('isAdult returns true when age >= 18', () => {
    expect(new User(baseUser).isAdult()).toBe(true);
  });

  it('isAdult returns false when age < 18', () => {
    expect(new User({ ...baseUser, age: 15 }).isAdult()).toBe(false);
  });

  it('hasValidEmail returns false for empty or null', () => {
    expect(new User({ ...baseUser, email: '' }).hasValidEmail()).toBe(false);
    expect(new User({ ...baseUser, email: null }).hasValidEmail()).toBe(false);
  });

  it('hasValidName returns false when name > 50 chars', () => {
    const longName = 'x'.repeat(51);
    expect(new User({ ...baseUser, name: longName }).hasValidName()).toBe(false);
  });

  it('toDTO returns status "active" for valid name', () => {
    const dto = new User(baseUser).toDTO();
    expect(dto.status).toBe('active');
  });

  it('toDTO returns status "name too long" for long name', () => {
    const dto = new User({ ...baseUser, name: 'x'.repeat(51) }).toDTO();
    expect(dto.status).toBe('name too long');
  });
});