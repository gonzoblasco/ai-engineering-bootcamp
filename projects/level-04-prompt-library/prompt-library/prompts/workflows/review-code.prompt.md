{{include:roles/code-reviewer}}

{{include:rules/markdown-format}}

{{include:rules/no-hallucinations}}

## Reglas del proyecto

Aplicá estas convenciones específicas del proyecto al revisar (si alguna no aplica, ignorala):

{{rules}}

## Tarea específica

Analizá el siguiente archivo y generá un code review:

**Archivo:** {{fileName}}

```js
{{code}}
```

Enfocate en las 5 dimensiones:
1. **Correctness** — bugs, lógica incorrecta, edge cases
2. **Security** — secrets, injection, permisos, input sin validar
3. **Conventions** — estilo, patrones del stack, consistencia con {{rules}}
4. **Performance** — cuellos de botella, complejidad innecesaria
5. **Test coverage** — qué falta testear, qué es crítico de cubrir

## Formato de hallazgos

Para cada hallazgo, usá esta estructura con severidad:

```
[SEVERIDAD] Archivo:línea — título del hallazgo
Motivo: por qué es un problema
Fix: cómo corregirlo
```

Severidades:
- **BLOCKING** — debe corregirse antes de merge (bug, vuln de seguridad, data loss)
- **WARNING** — debería corregirse, pero no bloquea (deuda, edge case, rendimiento)
- **SUGGESTION** — mejora opcional (estilo, naming, refactor menor)
