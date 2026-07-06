# Nivel 3 — Workflows estructurados 🟡

> **Objetivo:** Diseñar workflows repetibles. Esto es lo que Trafilea pide explícitamente.
>
> **Dificultad:** Intermedio | **Proyectos:** 2 | **Tiempo estimado:** 4-5 horas

## Skills que ganarás

- [ ] Diseñar workflows paso a paso
- [ ] Documentar procesos como "recipes"
- [ ] Crear prompts como templates reutilizables
- [ ] Spec → prompt → código → test → review

---

## Proyecto 1: Sistema de autenticación completo (JWT)

**Descripción:** Diseña el workflow completo para crear un sistema de auth y documéntalo como un recipe reutilizable.

### Workflow a seguir

```
1. SPEC: Define requisitos en lenguaje natural
2. PROMPT: Convierte spec en prompt estructurado
3. CODE: Genera código con Copilot
4. TEST: Pide tests automáticamente
5. REVIEW: Pide a Copilot que audite su propio código
6. DOC: Genera documentación de la API
```

### Pasos

1. Escribe un spec: "Sistema de auth con registro, login, refresh token, middleware de auth, roles"
2. Convierte el spec en un prompt estructurado
3. Genera el código con Copilot
4. Pide tests con Jest + Supertest
5. Pide a Copilot que revise seguridad del código generado
6. Pide que genere documentación OpenAPI/Swagger
7. **Documenta todo el proceso** en `docs/recipes/auth-system.md`

### Criterios de completitud

- [ ] Sistema de auth funcional con JWT
- [ ] Refresh token implementado
- [ ] Middleware de roles
- [ ] Tests E2E con Supertest
- [ ] Documentación Swagger generada
- [ ] Recipe documentado en `docs/recipes/`

---

## Proyecto 2: CRUD con validación y manejo de errores (template)

**Descripción:** Crea un template de prompt que genere CRUDs consistentes para cualquier entidad.

### Pasos

1. Diseña un prompt template con placeholders: `{{ENTITY_NAME}}`, `{{FIELDS}}`, `{{RELATIONS}}`
2. Úsalo para generar un CRUD de "Products"
3. Úsalo para generar un CRUD de "Users"
4. Verifica que la estructura y calidad sea consistente
5. Guarda el template en `docs/templates/crud-template.md`

### Criterios de completitud

- [ ] Prompt template con placeholders funcionando
- [ ] CRUD de Products generado y funcional
- [ ] CRUD de Users generado y funcional
- [ ] Estructura consistente entre ambos
- [ ] Template guardado y documentado

---

## Self-review

- ¿Puedes replicar el workflow de auth para otro sistema sin empezar de cero?
- ¿Tu template de CRUD produce código consistente?
- ¿Documentaste los workflows de forma que otro engineer podría seguirlos?

→ Si respondiste "sí" a todo, avanza al **Nivel 4**.