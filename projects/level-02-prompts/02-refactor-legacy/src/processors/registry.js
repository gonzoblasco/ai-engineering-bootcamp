// src/processors/registry.js
// Registry de procesadores: implementa el patrón Strategy/Chain.
// Permite añadir nuevos tipos de item sin tocar DataProcessor (OCP).

class ProcessorRegistry {
  constructor() {
    this.processors = [];
  }

  register(processor) {
    this.processors.push(processor);
  }

  findProcessorFor(item) {
    return this.processors.find((p) => p.canProcess(item));
  }
}

module.exports = ProcessorRegistry;