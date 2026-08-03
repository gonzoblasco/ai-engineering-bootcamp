# Level 7 — Microservices 🟣

> **Goal:** Build and orchestrate microservices with AI assistance. Learn to design service boundaries, inter-service communication, and event-driven architectures.
>
> **Difficulty:** Advanced | **Projects:** 2 | **Estimated time:** 4-5 hours

## Skills you'll gain

- [ ] Design microservice boundaries with AI
- [ ] Implement inter-service communication
- [ ] Use message queues with AI-generated code
- [ ] Handle distributed transactions
- [ ] Implement service discovery

---

## Project 1: Two-service system

**Description:** Build two microservices that communicate via HTTP and a message queue.

### Steps

1. Ask Copilot: *"Create two Express.js microservices: a User Service (port 3001) and a Notification Service (port 3002). The User Service should emit events when users are created."*
2. Add message queue: *"Add a message queue (use a simple in-memory event bus or Bull/BullMQ with Redis) between the services."*
3. Add service discovery: *"Add a simple service registry so services can find each other by name."*
4. Add error handling: *"Add circuit breaker pattern for inter-service calls."*

### Completion criteria

- [ ] Both services run and communicate
- [ ] Events flow through the message queue
- [ ] Service discovery works
- [ ] Circuit breaker handles failures gracefully

---

## Project 2: Event-driven architecture

**Description:** Extend the two-service system with event-driven patterns.

### Steps

1. Ask Copilot: *"Add an Order Service (port 3003) that publishes events: OrderCreated, OrderShipped, OrderCancelled."*
2. Add event handlers: *"The Notification Service should listen to OrderCreated and send a confirmation. The User Service should track order history."*
3. Add retry logic: *"Add retry with exponential backoff for failed event handlers."*
4. Add monitoring: *"Add a simple dashboard that shows event flow between services."*

### Completion criteria

- [ ] All 3 services communicate via events
- [ ] Event handlers have retry logic
- [ ] Dashboard shows event flow
- [ ] System handles partial failures gracefully

---

## Self-review

Before advancing to Level 8, answer:

- Can you design microservice boundaries with AI assistance?
- Do you understand event-driven architecture patterns?
- Can you implement inter-service communication with retry logic?

→ If you answered "yes" to all, advance to **Level 8**.
