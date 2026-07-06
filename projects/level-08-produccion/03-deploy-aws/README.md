# Proyecto 8.3 — Deploy en AWS

> **Nivel:** 8 — Escalabilidad, performance, seguridad 🔴
> **Dificultad:** Avanzado
> **Documentación:** [level-08-produccion.md](../../../docs/level-08-produccion.md)

## Descripción

Despliega un servicio en AWS usando Infrastructure as Code generado con IA.

## Pasos

1. Pídele a Copilot: *"Genera un template de Terraform para desplegar un servicio Node.js en AWS ECS Fargate con ALB, RDS PostgreSQL, y Redis ElastiCache"*
2. Revisa y ajusta el template
3. Despliega (o simula el deploy con `terraform plan`)
4. Configura CI/CD para auto-deploy
5. Documenta la infraestructura

## Criterios de completitud

- [ ] Terraform template generado y revisado
- [ ] `terraform plan` funciona sin errores
- [ ] Diagrama de infraestructura documentado
- [ ] CI/CD para deploy configurado
- [ ] Variables y secrets management en AWS