# Proyecto 8.2 — Optimización de performance

> **Nivel:** 8 — Escalabilidad, performance, seguridad 🔴
> **Dificultad:** Avanzado
> **Documentación:** [level-08-produccion.md](../../../docs/level-08-produccion.md)

## Descripción

Identifica y resuelve bottlenecks de performance.

## Pasos

1. Pídele a Copilot: *"Analiza este código y identifica bottlenecks de performance. Sugiere optimizaciones con justificación"*
2. Implementa: caching (Redis), connection pooling, query optimization
3. Crea un script de benchmarking antes/después
4. Documenta las mejoras con métricas

## Criterios de completitud

- [ ] Bottlenecks identificados
- [ ] Caching implementado (Redis)
- [ ] Connection pooling configurado
- [ ] Benchmark antes/después documentado
- [ ] Mejora medible (>30% en algún endpoint)