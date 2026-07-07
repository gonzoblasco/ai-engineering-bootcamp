// tests/userProcessor.test.js
const UserProcessor = require('../src/processors/userProcessor');
const User = require('../src/models/user');

describe('UserProcessor', () => {
  let repo, emailService, logger, processor;

  beforeEach(() => {
    repo = { save: jest.fn().mockResolvedValue(undefined) };
    emailService = { sendTo: jest.fn() };
    logger = { info: jest.fn() };
    processor = new UserProcessor(repo, emailService, logger);
  });

  it('canProcess returns true for type "user"', async () => {
    expect(await processor.canProcess({ type: 'user' })).toBe(true);
  });

  it('canProcess returns false for other types', async () => {
    expect(await processor.canProcess({ type: 'order' })).toBe(false);
  });

  it('returns null and logs "minor" for underage user', async () => {
    const result = await processor.process({
      type: 'user', id: 1, name: 'Bob', email: 'bob@test.com', age: 15,
    });
    expect(result).toBeNull();
    expect(logger.info).toHaveBeenCalledWith('minor');
  });

  it('returns null and logs "no email" for user without email', async () => {
    const result = await processor.process({
      type: 'user', id: 1, name: 'Bob', email: '', age: 25,
    });
    expect(result).toBeNull();
    expect(logger.info).toHaveBeenCalledWith('no email');
  });

  it('saves and returns DTO for valid adult user', async () => {
    const result = await processor.process({
      type: 'user', id: 1, name: 'Alice', email: 'alice@test.com', age: 25,
    });
    expect(result).toEqual({
      id: 1, name: 'Alice', email: 'alice@test.com', status: 'active',
    });
    expect(emailService.sendTo).toHaveBeenCalledWith('alice@test.com');
    expect(repo.save).toHaveBeenCalled();
  });
});