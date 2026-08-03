# Nivel 8 — Escalabilidad, performance, seguridad 🔴

> **Objetivo:** Llevar el código a estándares production-grade. Requisito clave del puesto.
>
> **Dificultad:** Avanzado | **Proyectos:** 3 | **Tiempo estimado:** 8-10 horas

## Skills que ganarás

- [ ] Security hardening con IA
- [ ] Performance optimization y profiling
- [ ] AWS deployment (ECS/Lambda/EC2)
- [ ] Infrastructure as Code con IA
- [ ] Cloud-native patterns

---

## Proyecto 1: Audit de seguridad con IA

**Descripción:** Toma un servicio del Nivel 7 y haz un security audit completo.

### Pasos

1. Selecciona el Auth Service
2. Pídele a Copilot: *"Haz un security audit completo de este servicio. Revisa: OWASP Top 10, secrets management, JWT implementation, input validation, SQL injection, rate limiting, CORS"*
3. Documenta todas las vulnerabilidades encontradas
4. Pide a Copilot que las corrija una por una
5. Verifica las correcciones con tests

### Criterios de completitud

- [ ] Audit documentado con todas las vulnerabilidades
- [ ] Vulnerabilidades críticas corregidas
- [ ] Tests de seguridad (ej: supertest con payloads maliciosos)
- [ ] Rate limiting implementado
- [ ] Secrets management con variables de entorno

---

## Proyecto 2: Optimización de performance

**Descripción:** Identifica y resuelve bottlenecks de performance.

### Pasos

1. Pídele a Copilot: *"Analiza este código y identifica bottlenecks de performance. Sugiere optimizaciones con justificación"*
2. Implementa: caching (Redis), connection pooling, query optimization
3. Crea un script de benchmarking antes/después
4. Documenta las mejoras con métricas

### Criterios de completitud

- [ ] Bottlenecks identificados
- [ ] Caching implementado (Redis)
- [ ] Connection pooling configurado
- [ ] Benchmark antes/después documentado
- [ ] Mejora medible (>30% en algún endpoint)

---

## Proyecto 3: Deploy en AWS

**Descripción:** Despliega un servicio en AWS usando Infrastructure as Code generado con IA.

### Pasos

1. Pídele a Copilot: *"Genera un template de Terraform para desplegar un servicio Node.js en AWS ECS Fargate con ALB, RDS PostgreSQL, y Redis ElastiCache"*
2. Revisa y ajusta el template
3. Despliega (o simula el deploy con `terraform plan`)
4. Configura CI/CD para auto-deploy
5. Documenta la infraestructura

### Criterios de completitud

- [ ] Terraform template generado y revisado
- [ ] `terraform plan` funciona sin errores
- [ ] Diagrama de infraestructura documentado
- [ ] CI/CD para deploy configurado
- [ ] Variables y secrets management en AWS

---

## Self-review

- ¿Puedes auditar seguridad de código IA de forma sistemática?
- ¿Sabes identificar y resolver bottlenecks de performance?
- ¿Puedes generar y entender Infrastructure as Code con IA?

→ Si respondiste "sí" a todo, avanza al **Nivel 9**.