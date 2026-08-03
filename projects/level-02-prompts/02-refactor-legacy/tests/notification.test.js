// tests/notification.test.js
const Notification = require('../src/models/notification');

describe('Notification', () => {
  it('uses provided message', () => {
    expect(new Notification({ message: 'hello' }).message).toBe('hello');
  });

  it('falls back to default message when empty', () => {
    expect(new Notification({ message: '' }).message).toBe('default message');
  });

  it('falls back to default message when null', () => {
    expect(new Notification({ message: null }).message).toBe('default message');
  });

  it('toDTO returns sent=true and message', () => {
    const dto = new Notification({ message: 'hi' }).toDTO();
    expect(dto).toEqual({ sent: true, message: 'hi' });
  });
});