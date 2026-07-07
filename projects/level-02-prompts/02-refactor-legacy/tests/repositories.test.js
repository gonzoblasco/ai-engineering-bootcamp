// tests/repositories.test.js
const UserRepository = require('../src/services/userRepository');
const OrderRepository = require('../src/services/orderRepository');

describe('UserRepository', () => {
  it('save writes JSON to file', async () => {
    const fs = { writeFile: jest.fn((_, __, ___, cb) => cb(null)) };
    const repo = new UserRepository(fs, './fake.json');
    const dto = { id: 1, name: 'Alice' };
    await expect(repo.save(dto)).resolves.toEqual(dto);
    expect(fs.writeFile).toHaveBeenCalled();
  });

  it('findById returns user when id matches', async () => {
    const fs = {
      readFile: jest.fn((_, __, cb) => cb(null, JSON.stringify({ id: 1, name: 'Alice' }))),
    };
    const repo = new UserRepository(fs, './fake.json');
    const user = await repo.findById(1);
    expect(user).toEqual({ id: 1, name: 'Alice' });
  });

  it('findById returns null when id does not match', async () => {
    const fs = {
      readFile: jest.fn((_, __, cb) => cb(null, JSON.stringify({ id: 2 }))),
    };
    const repo = new UserRepository(fs, './fake.json');
    expect(await repo.findById(1)).toBeNull();
  });

  it('findById rejects on read error', async () => {
    const fs = { readFile: jest.fn((_, __, cb) => cb(new Error('fail'))) };
    const repo = new UserRepository(fs, './fake.json');
    await expect(repo.findById(1)).rejects.toThrow('fail');
  });
});

describe('OrderRepository', () => {
  it('append writes a line to the log', async () => {
    const fs = { appendFile: jest.fn((_, __, cb) => cb(null)) };
    const repo = new OrderRepository(fs, './fake.log');
    const dto = { id: 1, total: 100, grandTotal: 121 };
    await expect(repo.append(dto)).resolves.toEqual(dto);
    expect(fs.appendFile).toHaveBeenCalledWith(
      './fake.log',
      '1,100,121\n',
      expect.any(Function)
    );
  });
});