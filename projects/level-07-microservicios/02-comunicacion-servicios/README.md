# Proyecto 7.2 — Comunicación entre servicios

> **Nivel:** 7 — Microservicios con IA 🔴
> **Dificultad:** Avanzado
> **Documentación:** [level-07-microservicios.md](../../../docs/level-07-microservicios.md)

## Descripción

Implementa comunicación event-driven entre servicios.

## Pasos

1. Añade RabbitMQ o Redis pub-sub
2. Cuando se crea una orden → evento → Product Service actualiza stock
3. Cuando stock baja → evento → notification service alerta
4. Usa Copilot para diseñar el sistema de eventos
5. Implementa retry y dead letter queue

## Criterios de completitud

- [ ] Comunicación event-driven funcionando
- [ ] Retry y dead letter queue implementados
- [ ] Eventos documentados
- [ ] Tests de integración entre servicios