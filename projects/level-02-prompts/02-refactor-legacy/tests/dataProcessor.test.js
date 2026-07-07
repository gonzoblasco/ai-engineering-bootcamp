// tests/dataProcessor.test.js
const DataProcessor = require('../src/services/dataProcessor');
const ProcessorRegistry = require('../src/processors/registry');

describe('DataProcessor', () => {
  it('throws if items is not an array', async () => {
    const dp = new DataProcessor(new ProcessorRegistry());
    await expect(dp.process(null)).rejects.toThrow('items must be an array');
  });

  it('returns empty array for empty input', async () => {
    const dp = new DataProcessor(new ProcessorRegistry());
    expect(await dp.process([])).toEqual([]);
  });

  it('skips items with unknown type', async () => {
    const dp = new DataProcessor(new ProcessorRegistry());
    const result = await dp.process([{ type: 'unknown' }]);
    expect(result).toEqual([]);
  });

  it('delegates to the matching processor', async () => {
    const fakeProcessor = {
      canProcess: (item) => item.type === 'fake',
      process: async (item) => ({ processed: item.value }),
    };
    const registry = new ProcessorRegistry();
    registry.register(fakeProcessor);
    const dp = new DataProcessor(registry);

    const result = await dp.process([
      { type: 'fake', value: 42 },
      { type: 'unknown' },
    ]);

    expect(result).toEqual([{ processed: 42 }]);
  });

  it('excludes null results from processors', async () => {
    const fakeProcessor = {
      canProcess: () => true,
      process: async () => null,
    };
    const registry = new ProcessorRegistry();
    registry.register(fakeProcessor);
    const dp = new DataProcessor(registry);

    const result = await dp.process([{ type: 'whatever' }]);
    expect(result).toEqual([]);
  });
});