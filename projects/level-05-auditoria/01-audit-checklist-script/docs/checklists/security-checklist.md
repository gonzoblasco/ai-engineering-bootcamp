# Checklist de seguridad

Revisión enfocada en vulnerabilidades comunes y configuraciones de seguridad. Usar en cada ronda de code review y antes de desplegar a producción.

## Validación de input

- [ ] Todos los inputs de usuario pasan por validación estructural (Zod, express-validator, Joi, etc.).
- [ ] Se sanitizan datos antes de usarlos en queries, logs o respuestas.
- [ ] Se rechazan tipos incorrectos, campos inesperados y payloads demasiado grandes.
- [ ] Se validan IDs, emails, fechas y enumerados con reglas estrictas.

## Autenticación y autorización

- [ ] Las contraseñas se hashean con bcrypt/Argon2 con salt adecuado.
- [ ] No se devuelven contraseñas ni hashes en respuestas JSON.
- [ ] El JWT usa secret fuerte, no hardcodeado, y tiene expiración corta.
- [ ] Los refresh tokens son opacos, rotan al usarse y se pueden revocar.
- [ ] Las rutas protegidas verifican el token antes de ejecutar lógica de negocio.
- [ ] La autorización por roles comprueba el recurso al que se accede (RBAC + ownership).

## Inyección y ejecución remota

- [ ] No se usa `eval()`, `new Function()` ni `setTimeout`/`setInterval` con strings.
- [ ] No se concatenan strings para construir queries SQL.
- [ ] No se inyectan datos de usuario en `innerHTML`, `document.write` ni similares.
- [ ] Los templates renderizan variables escapadas por defecto.

## Manejo de secrets

- [ ] No hay secrets en el repositorio (`.env`, claves API, certificados).
- [ ] Las variables de entorno sensibles no tienen defaults débiles.
- [ ] Se valida la presencia de variables críticas al arrancar la app.
- [ ] `.env` y archivos de secrets están en `.gitignore`.

## Configuración de red y headers

- [ ] Se usa `helmet` u otro middleware de headers de seguridad.
- [ ] CORS está configurado de forma restrictiva, no con `*` en producción.
- [ ] Rate limiting protege endpoints de autenticación y mutación.
- [ ] Cookies de sesión usan `HttpOnly`, `Secure` y `SameSite`.
- [ ] Se deshabilitan headers que filtran stack tecnológico cuando es posible.

## Errores y logging

- [ ] Los mensajes de error al cliente no exponen stack traces ni queries internas.
- [ ] Los errores se registran con contexto pero sin datos sensibles.
- [ ] Se distingue entre errores operacionales y errores de programación.

## Dependencias

- [ ] Se revisan dependencias con `npm audit` o herramientas equivalentes.
- [ ] Se mantienen actualizadas las librerías críticas (auth, parsing, DB).
- [ ] Se evitan dependencias abandonadas o con licencias incompatibles.

## CSRF y XSS

- [ ] Las mutaciones con cookies usan protección CSRF donde aplica.
- [ ] El output HTML escapa correctamente datos dinámicos.
- [ ] Se validan y sanitizan URLs redirigidas o descargadas.

## Checklist rápida para proyectos Express

| Item | Estado |
|---|---|
| `helmet` instalado y configurado | [ ] |
| `cors` restringido | [ ] |
| `express-rate-limit` en auth | [ ] |
| `express-validator` o Zod en rutas | [ ] |
| Variables de entorno validadas | [ ] |
| Passwords hasheadas con bcrypt | [ ] |
| JWT con secret fuerte y expiración | [ ] |
| No `eval` / `innerHTML` / SQL concat | [ ] |
| Middleware `notFound` + `errorHandler` | [ ] |
| Health check expuesto | [ ] |
