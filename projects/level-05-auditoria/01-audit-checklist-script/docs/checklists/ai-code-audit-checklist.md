# Checklist de auditoría de código con IA

Guía general para revisar código fuente asistido por inteligencia artificial. Aplica antes de mergear cambios significativos o como revisión periódica de salud del repositorio.

## Cómo usar esta guía

1. Elige el scope: PR completo, módulo crítico o archivo individual.
2. Pasa la checklist a un asistente de IA con contexto del código (`@workspace`, `codebase`, o copiando snippets).
3. Documenta hallazgos con severidad y acción recomendada.
4. Marca los items como revisados solo tras verificar manualmente los cambios propuestos por la IA.

## 1. Seguridad

- [ ] Todos los inputs de usuario están validados y sanitizados (no solo parseados).
- [ ] No se usan `eval()`, `new Function()` ni ejecución dinámica de código.
- [ ] No hay secrets, tokens, passwords ni API keys hardcodeados en el código.
- [ ] Las contraseñas se hashean con algoritmo robusto (bcrypt, Argon2, scrypt).
- [ ] Las queries a base de datos usan parámetros o un ORM; no hay concatenación de strings.
- [ ] Los endpoints sensibles tienen autenticación y autorización correcta.
- [ ] Se implementa rate limiting en login, registro y endpoints críticos.
- [ ] Se configuran headers de seguridad (`helmet`, CORS restringido, CSP).
- [ ] No se usa `innerHTML` ni `.html()` con datos no confiables en frontend.
- [ ] Tokens y sesiones expiran, se pueden revocar y no contienen datos sensibles.

## 2. Performance

- [ ] No hay queries N+1; se usan joins, includes o data loaders.
- [ ] Las consultas frecuentes tienen índices de base de datos.
- [ ] No hay llamadas bloqueantes dentro de handlers async.
- [ ] Se limita el tamaño de payloads (`express.json({ limit: ... })`).
- [ ] Se usa caché para datos de lectura frecuente cuando tiene sentido.
- [ ] No se acumulan listeners ni referencias que provoquen memory leaks.
- [ ] Los logs son asíncronos o no bloquean el event loop.

## 3. Edge cases

- [ ] Se manejan `null`, `undefined`, strings vacíos y arrays vacíos.
- [ ] Los errores async no quedan silenciados ni rompen el proceso.
- [ ] Se controlan IDs inexistentes, duplicados y conflictos de concurrencia.
- [ ] Rate limiting y throttling están presentes en endpoints expuestos.
- [ ] Los formatos de fechas, moneda y localización se manejan de forma consistente.

## 4. Calidad de código

- [ ] Los nombres de funciones, variables y archivos son descriptivos y consistentes.
- [ ] No hay duplicación significativa (DRY).
- [ ] Las funciones y clases respetan responsabilidad única (SOLID).
- [ ] El manejo de errores es centralizado y no devuelve información interna al cliente.
- [ ] El logging incluye contexto suficiente para debugging sin exponer datos sensibles.
- [ ] Los imports están ordenados y sin dependencias circulares.

## 5. Tests

- [ ] La cobertura de tests supera el umbral definido (mínimo 80%).
- [ ] Se testean casos de éxito, error y límites (happy path + edge cases).
- [ ] Los mocks son apropiados y no ocultan comportamiento crítico.
- [ ] Los tests de integración no dependen de estado compartido entre ejecuciones.
- [ ] Los tests fallan por motivos claros y los mensajes de error son legibles.

## Formato sugerido de reporte por hallazgo

| Campo | Valor |
|---|---|
| Archivo | `src/middleware/auth.js` |
| Línea | 42 |
| Categoría | Seguridad |
| Severidad | Alta |
| Hallazgo | Token secreto leído de `process.env` con fallback hardcodeado |
| Recomendación | Requerir la variable de entorno y fallar al arrancar si falta |

## Notas

- Esta checklist es un punto de partida, no un sustituto de auditorías especializadas.
- Para items específicos consulta [security-checklist.md](./security-checklist.md) y [performance-checklist.md](./performance-checklist.md).
