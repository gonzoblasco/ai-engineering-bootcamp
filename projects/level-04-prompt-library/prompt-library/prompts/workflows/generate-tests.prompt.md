{{include:roles/code-reviewer}}

{{include:rules/markdown-format}}

{{include:rules/no-hallucinations}}

## Tarea específica

Generá tests unitarios con Jest para el siguiente archivo:

**Archivo:** {{fileName}}

```js
{{code}}
```

Los tests deben cubrir:
- Casos felices (happy path)
- Casos borde (edge cases)
- Casos de error
- Mocks de dependencias externas

Usá describe/it/bloque estándar de Jest. No uses librerías de testing adicionales.
