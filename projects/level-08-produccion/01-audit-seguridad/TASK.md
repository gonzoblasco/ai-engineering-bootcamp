# Proyecto 8.1 — Audit de seguridad con IA

> 📋 **Instrucciones del ejercicio**
> Este archivo describe el brief y los criterios de completitud del proyecto.
> La documentación del proyecto resultante (qué se construyó, cómo ejecutarlo) está en [`README.md`](./README.md).

> **Nivel:** 8 — Escalabilidad, performance, seguridad 🔴
> **Dificultad:** Avanzado
> **Documentación:** [level-08-produccion.md](../../../docs/level-08-produccion.md)

## Descripción

Toma un servicio del Nivel 7 y haz un security audit completo.

## Pasos

1. Selecciona el Auth Service
2. Pídele a Copilot: *"Haz un security audit completo de este servicio. Revisa: OWASP Top 10, secrets management, JWT implementation, input validation, SQL injection, rate limiting, CORS"*
3. Documenta todas las vulnerabilidades encontradas
4. Pide a Copilot que las corrija una por una
5. Verifica las correcciones con tests

## Criterios de completitud

- [ ] Audit documentado con todas las vulnerabilidades
- [ ] Vulnerabilidades críticas corregidas
- [ ] Tests de seguridad (ej: supertest con payloads maliciosos)
- [ ] Rate limiting implementado
- [ ] Secrets management con variables de entorno
