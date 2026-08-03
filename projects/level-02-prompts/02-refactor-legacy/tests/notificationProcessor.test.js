// tests/notificationProcessor.test.js
const NotificationProcessor = require('../src/processors/notificationProcessor');

describe('NotificationProcessor', () => {
  let service, processor;

  beforeEach(() => {
    service = { send: jest.fn((n) => n.toDTO()) };
    processor = new NotificationProcessor(service);
  });

  it('canProcess returns true for type "notification"', async () => {
    expect(await processor.canProcess({ type: 'notification' })).toBe(true);
  });

  it('canProcess returns false for other types', async () => {
    expect(await processor.canProcess({ type: 'user' })).toBe(false);
  });

  it('sends notification and returns DTO', async () => {
    const result = await processor.process({
      type: 'notification', message: 'hello',
    });
    expect(service.send).toHaveBeenCalled();
    expect(result).toEqual({ sent: true, message: 'hello' });
  });

  it('uses default message when none provided', async () => {
    const result = await processor.process({
      type: 'notification', message: null,
    });
    expect(result.message).toBe('default message');
  });
});