class EventBus {
  constructor() {
    this.subscribers = {};
    this.allSubscribers = [];
  }

  subscribe(event, handler) {
    if (!this.subscribers[event]) {
      this.subscribers[event] = [];
    }
    this.subscribers[event].push(handler);

    // Devolver unsubscribe function
    return () => {
      this.subscribers[event] = this.subscribers[event].filter((h) => h !== handler);
    };
  }

  subscribeAll(handler) {
    this.allSubscribers.push(handler);
    return () => {
      this.allSubscribers = this.allSubscribers.filter((h) => h !== handler);
    };
  }

  publish(event, payload) {
    const handlers = this.subscribers[event] || [];

    // Notificar suscriptores específicos
    for (const handler of handlers) {
      this._safeCall(handler, event, payload);
    }

    // Notificar suscriptores de todos los eventos
    for (const handler of this.allSubscribers) {
      this._safeCall(handler, event, payload);
    }
  }

  _safeCall(handler, event, payload) {
    try {
      const result = handler(payload, event);
      if (result && typeof result.catch === 'function') {
        result.catch((err) => {
          console.error(`[EventBus] Error en handler async para ${event}:`, err.message);
        });
      }
    } catch (err) {
      console.error(`[EventBus] Error en handler para ${event}:`, err.message);
    }
  }
}

const instance = new EventBus();

module.exports = instance;
