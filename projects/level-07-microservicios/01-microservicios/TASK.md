# Proyecto 7.1 — Sistema de microservicios

> 📋 **Instrucciones del ejercicio**
> Este archivo describe el brief y los criterios de completitud del proyecto.
> La documentación del proyecto resultante (qué se construyó, cómo ejecutarlo) está en [`README.md`](./README.md).

> **Nivel:** 7 — Microservicios con IA 🔴
> **Dificultad:** Avanzado
> **Documentación:** [level-07-microservicios.md](../../../docs/level-07-microservicios.md)

## Descripción

API Gateway + Auth Service + Product Service + Order Service.

## Arquitectura

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

## Pasos

1. Pídele a Copilot: *"Diseña una arquitectura de microservicios para un e-commerce con API Gateway, Auth, Products y Orders. Incluye diagrama, tech stack y justificación"*
2. Implementa cada servicio con Copilot
3. Configura el API Gateway (Express http-proxy o similar)
4. Implementa service discovery (puede ser simple con env vars)
5. Documenta cada decisión en ADRs (Architecture Decision Records)

## Criterios de completitud

- [ ] 3+ microservicios funcionando
- [ ] API Gateway enruta correctamente
- [ ] Cada servicio tiene su propia DB
- [ ] ADRs documentados
- [ ] Docker Compose para levantar todo
