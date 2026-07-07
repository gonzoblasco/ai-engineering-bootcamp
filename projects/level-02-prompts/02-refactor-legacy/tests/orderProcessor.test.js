// tests/orderProcessor.test.js
const OrderProcessor = require('../src/processors/orderProcessor');

describe('OrderProcessor', () => {
  let repo, processor;

  beforeEach(() => {
    repo = { append: jest.fn().mockResolvedValue(undefined) };
    processor = new OrderProcessor(repo);
  });

  it('canProcess returns true for type "order"', async () => {
    expect(await processor.canProcess({ type: 'order' })).toBe(true);
  });

  it('canProcess returns false for other types', async () => {
    expect(await processor.canProcess({ type: 'user' })).toBe(false);
  });

  it('appends to repo and returns DTO', async () => {
    const result = await processor.process({
      type: 'order', id: 99, items: [{ price: 100, qty: 2 }],
    });
    expect(result.id).toBe(99);
    expect(result.total).toBe(180); // 200 * 0.9 (10% discount)
    expect(repo.append).toHaveBeenCalled();
  });
});