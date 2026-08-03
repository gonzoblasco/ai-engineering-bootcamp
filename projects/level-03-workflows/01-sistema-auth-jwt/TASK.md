# Proyecto 3.1 — Sistema de autenticación completo (JWT)

> 📋 **Instrucciones del ejercicio**
> Este archivo describe el brief y los criterios de completitud del proyecto.
> La documentación del proyecto resultante (qué se construyó, cómo ejecutarlo) está en [`README.md`](./README.md).

> **Nivel:** 3 — Workflows estructurados 🟡
> **Dificultad:** Intermedio
> **Documentación:** [level-03-workflows.md](../../../docs/level-03-workflows.md)

## Descripción

Diseña el workflow completo para crear un sistema de auth y documéntalo como un recipe reutilizable.

## Workflow a seguir

```
1. SPEC: Define requisitos en lenguaje natural
2. PROMPT: Convierte spec en prompt estructurado
3. CODE: Genera código con Copilot
4. TEST: Pide tests automáticamente
5. REVIEW: Pide a Copilot que audite su propio código
6. DOC: Genera documentación de la API
```

## Pasos

1. Escribe un spec: "Sistema de auth con registro, login, refresh token, middleware de auth, roles"
2. Convierte el spec en un prompt estructurado
3. Genera el código con Copilot
4. Pide tests con Jest + Supertest
5. Pide a Copilot que revise seguridad del código generado
6. Pide que genere documentación OpenAPI/Swagger
7. **Documenta todo el proceso** en `docs/recipes/auth-system.md`

## Criterios de completitud

- [ ] Sistema de auth funcional con JWT
- [ ] Refresh token implementado
- [ ] Middleware de roles
- [ ] Tests E2E con Supertest
- [ ] Documentación Swagger generada
- [ ] Recipe documentado en `docs/recipes/`
