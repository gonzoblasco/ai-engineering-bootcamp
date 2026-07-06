# Proyecto 6.2 — Pre-commit hooks con IA

> **Nivel:** 6 — CI/CD con IA 🟠
> **Dificultad:** Avanzado
> **Documentación:** [level-06-cicd.md](../../../docs/level-06-cicd.md)

## Descripción

Hook que valide código antes de cada commit usando IA.

## Pasos

1. Configura `husky` + `lint-staged`
2. Crea un script que use Copilot CLI o un endpoint de IA para validar archivos staged
3. El hook debe: revisar seguridad, detectar bugs obvios, verificar convenciones
4. Si hay problemas críticos, bloquea el commit

## Criterios de completitud

- [ ] Pre-commit hook instalado y funcionando
- [ ] Valida código con IA antes de commit
- [ ] Bloquea commits con problemas críticos
- [ ] Documentación de cómo funciona