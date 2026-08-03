# Nivel 10 — El sistema completo 🔴

> **Meta:** Juntar TODO lo que aprendiste en un sistema completo y funcional de punta a punta. Es el jefe final.
>
> **Dificultad:** Experto | **Proyectos:** 4 (2 core + 1 profundidad + 1 stretch) | **Tiempo estimado:** 4-5 horas
>
> **Nota:** este nivel es **convergente** (ADR-001). Extiende el sistema de microservicios del Nivel 7/8/9 en el MISMO folder. No creás un proyecto nuevo — terminás de unir las piezas que ya construiste.

---

## 🧠 Teoría — El sistema como suma de gates verificados

### Lo que llevás construido

Nivel tras nivel, fuiste sumando piezas y — más importante — **pruebas de que funcionan**:

| Nivel | Pieza | Gate que la prueba |
|-------|-------|--------------------|
| N3 | Gates del workflow | `gates.test.js` |
| N5 | Auditoría de seguridad | exploit + detector |
| N6 | CI/CD con IA | analyze-pr + gate |
| N7 | Microservicios + event bus | `event-flow.test.js` |
| N8 | Infra como código | fixtures + `validate.test.js` |
| N9 | Estándares de equipo | `standards/validate.test.js` |
| **N10** | **El sistema completo** | **`system.test.js`** |

Cada pieza tiene su gate. El N10 es el **gate final**: que el sistema completo — auth + users + orders + notifications + gateway + CI/CD — funcione de punta a punta.

### El tema llevado al extremo

Desde el N1 repetís **"no confíes, verificá"**. El N10 es la síntesis:

- Un microservicio que funciona aislado no prueba nada — el sistema real es la **suma de las interacciones**.
- El gateway puede estar arriba y un servicio detrás caído sin que te des cuenta.
- Un "sistema completo" que nunca corriste de punta a punta es una colección de piezas, no un sistema.
- El test end-to-end (`system.test.js`) es el contrato final: **si el flujo completo no funciona, no está listo para producción.**

> Un sistema que nunca viste funcionar de punta a punta no es un sistema — es un conjunto de esperanzas.

### Por qué el capstone es convergente

En los primeros niveles construiste piezas sueltas. En N7-N10, el sistema es **uno solo** que crece:

```
N7: auth(3000) + users(3001) + orders(3002) + notifications(event bus) + gateway(8080)
N8: + Dockerfiles + docker-compose + CloudFormation + validador de infra
N9: + standards.json + validador de estándares + dashboard
N10: + orquestador (index.js) + CI/CD (quality.yml) + test end-to-end
```

El orquestador levanta las 5 piezas con un comando. El CI/CD valida los estándares en cada PR. El test end-to-end prueba que todo funciona junto.

---

## 🛠️ Proyecto 1 — El sistema completo (core)

> **Descripción:** El orquestador y el gateway que unen todos los servicios del N7 en un solo sistema operativo con un comando.

### Pasos

1. Creá el **orquestador** `index.js` en la raíz: un script que levante los 5 servicios (auth, users, orders, notifications, gateway) con un solo `node index.js`, imprima los endpoints y maneje el cierre graceful (SIGINT/SIGTERM).

2. Creá el **API Gateway** `gateway/index.js` que unifique el acceso:
   - Enruta `/auth` → auth (3000), `/users` → users (3001), `/orders` → orders (3002)
   - Expone `GET /` con la lista de endpoints del sistema
   - Expone `GET /health` agregado — chequea el estado de TODOS los servicios y devuelve 200 solo si todos están ok, 503 si alguno está caído

3. Probá el sistema completo a mano:
```bash
node index.js
# en otra terminal:
curl http://localhost:8080/health          # todos los servicios ok
curl -X POST http://localhost:8080/auth/register -H 'Content-Type: application/json' -d '{"name":"Ana","email":"ana@x.com","password":"secret123"}'
curl -X POST http://localhost:8080/auth/login -H 'Content-Type: application/json' -d '{"email":"ana@x.com","password":"secret123"}'
curl http://localhost:8080/users
curl http://localhost:8080/orders
```

### Criterios de completitud

- [ ] `node index.js` levanta los 5 servicios con un comando
- [ ] El gateway enruta `/auth`, `/users` y `/orders`
- [ ] `GET /health` del gateway reporta todos los servicios
- [ ] Registrás, logueás y listás usuarios y órdenes a través del gateway
- [ ] El cierre graceful apaga todos los servicios (Ctrl+C)

---

## 🛠️ Proyecto 2 — CI/CD del sistema (core)

> **Description:** Hacer que el sistema se auto-verifique en cada PR con un workflow de GitHub Actions.

### Pasos

1. Creá `.github/workflows/quality.yml` que corra en cada PR:
   - Checkout + setup Node 20 + `npm install`
   - Corra `node standards/validate.js` (del N9) contra el sistema
   - Calcule el score y lo **publique como comentario en el PR** (github-script)
   - **Bloquee el merge si el score < 80** (exit 1)

2. Entendé el flujo: el estándar de equipo (N9) ahora es un **gate de CI** — nadie puede mergear código que degrade la calidad sin que el bot lo marque.

### Criterios de completitud

- [ ] El workflow corre `standards/validate.js` en cada PR
- [ ] Postea el score como comentario en el PR
- [ ] Falla el build si el score < 80
- [ ] Entendés cómo el estándar de equipo se convirtió en un gate automático

---

## 🛠️ Proyecto 3 — Prove the full system 🔴 core (el corazón del nivel)

> **Description:** Demostrá que el sistema completo funciona de punta a punta. Un sistema que nunca viste correr entero no es un sistema — es una colección de esperanzas.

Los proyectos 1-2 arman el sistema y su CI. Acá lo **sometés a la prueba final**: el test end-to-end que verifica que auth + users + orders + notifications + gateway funcionan juntos.

### Pasos

1. **Escribí `system.test.js`** con `node --test`, que:
   - **Arranque el sistema completo** en el `before` (auth, users, orders, notifications, gateway)
   - Verifique que el **gateway enruta** correctamente (registrar, loguear, listar users/orders a través del gateway)
   - Verifique el **health agregado** — que `GET /health` reporte todos los servicios ok
   - Verifique el **flujo real de un usuario**: register → login → crear orden → listar órdenes
   - Verifique los **casos de error**: credenciales inválidas (401), email duplicado (409), ruta desconocida (404)
   - **Apague el sistema** en el `after`

2. **Probalo**:
```bash
node --test system.test.js
```
Si una pieza no responde, encontraste un bug real en la integración — antes de que lo encontrara un usuario en producción.

3. **Rompi algo a propósito.** Pará un servicio (o comentá su `start()` en el orquestador) y confirmá que el test lo detecta. El health agregado debería bajar y el flujo completo debería fallar. Ese es tu gate funcionando.

### Criterios de completitud

- [ ] `system.test.js` arranca el sistema completo y lo apaga
- [ ] Verifica auth (register, login, credenciales inválidas, email duplicado)
- [ ] Verifica que el gateway enruta users y orders
- [ ] Verifica el health agregado y el flujo completo de usuario
- [ ] Rompiste una pieza a propósito y el test la detectó
- [ ] Entendés por qué un sistema sin test end-to-end no es confiable

> 💡 **La conclusión:** el test end-to-end es el contrato final del sistema. Cada pieza tiene su unit test (N7, N8, N9), pero solo el `system.test.js` prueba que **todas juntas** funcionan. Un bug de integración es invisible para los tests unitarios — y letal en producción.

---

## 🛠️ Proyecto 4 — La retrospectiva 🟠 stretch

> **Description:** Documentá todo lo que aprendiste a lo largo del curso. Es el cierre — y tu portfolio de lo que construiste.

### Pasos

1. Escribí `project-10-retrospective.md` respondiendo:

   - **Qué salió bien** — ¿qué niveles fluyeron? ¿Qué gates encontraste bugs reales?
   - **Qué fue desafiante** — ¿qué concepto te costó? ¿Qué bug de integración te sorprendió?
   - **Qué harías distinto** — ¿qué habrías probado antes? ¿Qué hubieras automatizado?
   - **Métricas** — ¿cuántos prompts usaste por nivel? ¿Cuántos bugs encontraron tus tests vs los tuyos en review?
   - **Patrones que funcionaron** — ¿qué prompts repetiste? ¿Qué estructura de test te sirvió?
   - **Recomendaciones** — para otro dev que haga el curso

2. Reflexioná sobre el arco completo: empezaste generando un password generator (N1) y terminás con un sistema de microservicios con auth, gateway, CI/CD y estándares — todo probado.

### Criterios de completitud

- [ ] Escribiste `project-10-retrospective.md`
- [ ] Cubre qué salió bien, qué fue desafiante y qué harías distinto
- [ ] Documentás los patrones de prompts que funcionaron
- [ ] Las recomendaciones son accionables

> 💡 **La conclusión:** la retrospectiva es tu prueba de que no solo construiste un sistema — construiste una **metodología repetible**. Eso es lo que te diferencia de "usar IA como chat": sabés cómo usar la IA como infraestructura de trabajo.

---

## 📣 LinkedIn — Post para publicar

---

**Construí un sistema completo de microservicios con IA — y lo probé 🏆**

Nivel 10 (final) del AI Engineering Bootcamp: el sistema completo.

Junté todo lo aprendido:
- Auth + users + orders + notifications + gateway en un solo sistema
- CI/CD que valida estándares en cada PR y bloquea si la calidad baja
- Un test end-to-end que prueba el flujo completo de usuario

Lo que aprendí:
- Un sistema que nunca viste correr de punta a punta no es un sistema
- Los bugs de integración son invisibles para los unit tests — el test e2e los encuentra
- El estándar de equipo se convierte en gate automático con CI
- Cada pieza tiene su prueba; el sistema completo tiene la prueba final

Completé los 10 niveles. No usé IA como chat — la usé como infraestructura de trabajo: sesiones por proyecto, gates verificados, estándares como código.

#AIEngineering #Microservices #NodeJS #CI/CD #SystemDesign

---

## Self-review (final)

Antes de cerrar, respondé:

- [ ] ¿El sistema completo funciona de punta a punta (orquestador + gateway)?
- [ ] ¿El CI/CD valida estándares y bloquea si la calidad baja?
- [ ] ¿Probaste que el sistema completo funciona end-to-end (no solo cada pieza)?
- [ ] ¿Rompiste una pieza a propósito y tu test la detectó?
- [ ] ¿Escribiste tu retrospectiva del curso?
- [ ] ¿Tenés una metodología repetible de IA-asistida que podés aplicar a cualquier proyecto?

→ Si respondiste "sí" a todo: **estás listo para producción.** 🏁

---

## Verificación (auto-check)

Corré el checklist final para confirmar que completaste el nivel:

```bash
cd projects/level-07-microservices
node verify.js
```

`verify.js` chequea: el sistema completo (auth, gateway, orquestador — Proyectos 1-2), el CI/CD (Proyecto 2), el test end-to-end del sistema (Proyecto 3, core) y la retrospectiva (Proyecto 4, stretch). Confirma *esfuerzo*, no *calidad* — la calidad la juzgás vos contra el self-review de arriba.

> Mismo template que los niveles 1-9. Confirma esfuerzo + rúbrica que guía el juicio.

---

## 🏆 ¡Felicitaciones!

Completaste el AI Engineering Bootcamp. Ahora tenés:

- Una metodología estructurada para desarrollo asistido por IA
- Una librería de templates de prompts reutilizables
- CI/CD con review de IA
- Skills de auditoría de seguridad
- Estándares de equipo como código
- Un sistema completo probado de punta a punta
- La capacidad de mentorear a otros

**Siguientes pasos:**
- Compartí tu retrospectiva con la comunidad
- Aportá al bootcamp (abrí un PR con mejoras)
- Aplicá la metodología a tus proyectos reales
- Mentoreá a otro dev a través del curso
