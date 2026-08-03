# Nivel 5 — Seguridad y auditoría con IA

## Proyecto: Security Audit CLI

CLI que analiza proyectos Node.js en busca de vulnerabilidades comunes, combinando reglas locales con análisis de IA.

### Archivos

- `security-cli/detectors/secrets.js` — detector de secrets hardcodeados
- `security-cli/detectors/injection.js` — detector de SQL injection y XSS
- `security-cli/detectors/dependencies.js` — detector de dependencias con CVEs
- `security-cli/ai-analyzer.js` — análisis contextual con IA (simulado)
- `security-cli/security-audit.js` — CLI principal
- `security-cli/package.json` — dependencias y bin

### Cómo empezar

1. Leé la guía en `docs/level-05-security-audit.md`
2. Construí los detectores uno por uno
3. Conectalos con el analizador de IA
4. Probá contra los proyectos de niveles anteriores
5. Revisá los falsos positivos y ajustá reglas
