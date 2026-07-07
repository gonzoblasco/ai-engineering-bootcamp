// src/services/dataProcessor.js
// Orquestador: recibe items y delega al procesador correspondiente.
// Sustituye a la god function `processData` del legacy.

class DataProcessor {
  constructor(registry) {
    this.registry = registry;
  }

  async process(items) {
    if (!Array.isArray(items)) {
      throw new Error('items must be an array');
    }

    const results = [];
    for (const item of items) {
      const processor = this.registry.findProcessorFor(item);
      if (!processor) {
        continue; // tipo desconocido: ignorar en lugar de crashear
      }
      const result = await processor.process(item);
      if (result !== null) {
        results.push(result);
      }
    }
    return results;
  }
}

module.exports = DataProcessor;