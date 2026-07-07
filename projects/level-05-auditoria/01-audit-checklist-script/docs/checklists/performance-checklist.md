# Checklist de performance

Revisión enfocada en eficiencia, escalabilidad y uso responsable de recursos. Usar antes de releases importantes o cuando se detecten degradaciones.

## Base de datos

- [ ] No hay queries N+1; se usan joins, includes o data loaders.
- [ ] Las consultas más frecuentes están respaldadas por índices.
- [ ] Se usan transacciones solo donde se necesitan atomicidad o consistencia.
- [ ] Se limita el número de resultados devueltos (paginación).
- [ ] Se evitan `SELECT *` implícitos; se seleccionan solo las columnas necesarias.
- [ ] Las migraciones incluyen análisis de índices y no bloquean tablas grandes sin estrategia.

## Event loop y async

- [ ] No hay operaciones bloqueantes en handlers de Express (`fs.readFileSync`, bucles pesados, etc.).
- [ ] Se usan `async/await` y los errores async se propagan correctamente.
- [ ] Se evitan callbacks anidados profundos.
- [ ] Las promesas no quedan flotantes sin `await` ni `.catch`.

## Payloads y red

- [ ] Se limita el tamaño del body JSON (`express.json({ limit: '10kb' })`).
- [ ] Se comprimen respuestas grandes cuando tiene sentido.
- [ ] Se evitan devolver arrays enormes sin paginación o streaming.
- [ ] Las imágenes y assets estáticos usan caché apropiada.

## Memoria

- [ ] No se acumulan listeners de eventos sin remover (`EventEmitter`, `socket.on`).
- [ ] No se mantienen grandes estructuras en memoria entre requests.
- [ ] Se limpian timeouts e intervals cuando ya no son necesarios.
- [ ] Se evitan closures que retienen objetos grandes de forma innecesaria.

## Caché

- [ ] Datos de lectura frecuente y poco cambiantes usan caché.
- [ ] La invalidación de caché tiene estrategia definida.
- [ ] No se almacena información sensible en caché compartida.

## Logging

- [ ] Los logs no bloquean el event loop (logger async o con buffer).
- [ ] No se loggea en cada request con `console.log` en producción.
- [ ] Se controla el nivel de log por entorno.

## Tests y entorno

- [ ] Los tests no recrean la base de datos innecesariamente.
- [ ] Se usan mocks para servicios externos lentos o con coste.
- [ ] Las variables de entorno no fuerzan reinicios constantes del proceso.

## Checklist rápida para APIs Express

| Item | Estado |
|---|---|
| Body parser con límite de tamaño | [ ] |
| Paginación en listados | [ ] |
| Sin queries N+1 | [ ] |
| Índices definidos en schema | [ ] |
| Sin `console.log` en producción | [ ] |
| Sin bloqueos síncronos en handlers | [ ] |
| Promesas con `await` o `.catch` | [ ] |
| Caché en datos de lectura frecuente | [ ] |
