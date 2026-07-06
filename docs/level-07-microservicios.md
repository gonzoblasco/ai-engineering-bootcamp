# Nivel 7 — Microservicios con IA 🔴

> **Objetivo:** Diseñar arquitectura de microservicios asistido por IA.
>
> **Dificultad:** Avanzado | **Proyectos:** 2 | **Tiempo estimado:** 6-8 horas

## Skills que ganarás

- [ ] Microservices design asistido por IA
- [ ] API Gateway patterns
- [ ] Inter-service communication
- [ ] Decisiones de arquitectura con IA
- [ ] Documentación de decisiones arquitectónicas (ADRs)

---

## Proyecto 1: Sistema de microservicios

**Descripción:** API Gateway + Auth Service + Product Service.

### Arquitectura

```
                    ┌──────────────┐
                    │  API Gateway  │
                    └──────┬───────┘
                           │
              ┌────────────┼────────────┐
              │            │            │
     ┌────────┴───┐ ┌─────┴────┐ ┌─────┴─────┐
     │ Auth Service│ │Product Svc│ │Order Svc  │
     └────────────┘ └──────────┘ └───────────┘
              │            │            │
         ┌────┴────┐  ┌────┴────┐  ┌────┴────┐
         │PostgreSQL│  │PostgreSQL│  │ MongoDB  │
         └─────────┘  └─────────┘  └─────────┘
```

### Pasos

1. Pídele a Copilot: *"Diseña una arquitectura de microservicios para un e-commerce con API Gateway, Auth, Products y Orders. Incluye diagrama, tech stack y justificación"*
2. Implementa cada servicio con Copilot
3. Configura el API Gateway (Express http-proxy o similar)
4. Implementa service discovery (puede ser simple con env vars)
5. Documenta cada decisión en ADRs (Architecture Decision Records)

### Criterios de completitud

- [ ] 3+ microservicios funcionando
- [ ] API Gateway enruta correctamente
- [ ] Cada servicio tiene su propia DB
- [ ] ADRs documentados
- [ ] Docker Compose para levantar todo

---

## Proyecto 2: Comunicación entre servicios

**Descripción:** Implementa comunicación event-driven entre servicios.

### Pasos

1. Añade RabbitMQ o Redis pub-sub
2. Cuando se crea una orden → evento → Product Service actualiza stock
3. Cuando stock baja → evento → notification service alerta
4. Usa Copilot para diseñar el sistema de eventos
5. Implementa retry y dead letter queue

### Criterios de completitud

- [ ] Comunicación event-driven funcionando
- [ ] Retry y dead letter queue implementados
- [ ] Eventos documentados
- [ ] Tests de integración entre servicios

---

## Self-review

- ¿Puedes diseñar arquitectura de microservicios con IA de forma eficiente?
- ¿Documentas las decisiones arquitectónicas?
- ¿Entiendes los trade-offs de comunicación síncrona vs asíncrona?

→ Si respondiste "sí" a todo, avanza al **Nivel 8**.