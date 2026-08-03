# Form validation

## Cuándo usarlo
Cuando necesitas crear un formulario con validación client-side. Cubre validación en tiempo real, mensajes de error, estados de submit y accesibilidad.

## Prompt
```
Crea un formulario de {{FORM_PURPOSE}} con validación client-side.

Requisitos:
- Usa {{VALIDATION_LIBRARY}} (React Hook Form / Zod / Yup / nativo)
- Campos: {{FIELDS_DESCRIPTION}}
- Validación: {{VALIDATION_RULES}}
- Validación en tiempo real: {{REALTIME_VALIDATION}} (onBlur / onChange / onSubmit)
- Estados: idle, submitting, success, error
- Mensajes de error accesibles con aria-describedby
- Botón de submit deshabilitado mientras el formulario es inválido o está enviando

Contexto del proyecto:
{{PROJECT_CONTEXT}}
```

## Ejemplo de uso
**Input:**
- `{{FORM_PURPOSE}}` = registro de usuario
- `{{VALIDATION_LIBRARY}}` = React Hook Form + Zod
- `{{FIELDS_DESCRIPTION}}` = name (text), email (email), password (password, min 8 chars), confirmPassword (must match password), terms (checkbox, required)
- `{{VALIDATION_RULES}}` = name: min 2 chars, required; email: formato email, required; password: min 8 chars, al menos 1 número y 1 mayúscula; confirmPassword: igual a password; terms: debe estar checked
- `{{REALTIME_VALIDATION}}` = onBlur
- `{{PROJECT_CONTEXT}}` = React + TypeScript + Tailwind, formularios en src/components/forms/

**Output esperado:**
- `src/components/forms/RegisterForm.tsx` — formulario con 5 campos + submit
- Schema Zod con refinements (password match, password strength)
- `useForm` con `resolver: zodResolver(schema)`
- Mensajes de error debajo de cada campo, en rojo, con `role="alert"`
- Submit button con spinner durante envío, deshabilitado si inválido
- Toast o mensaje de éxito tras registro exitoso
- `src/components/forms/RegisterForm.test.tsx` — testea validación, submit, estados

## Notas
- React Hook Form + Zod es la combinación recomendada para forms complejos en React
- Para forms simples (1-2 campos), la validación nativa con `useState` puede ser suficiente
- Siempre valida también en el backend — la validación client-side es UX, no seguridad
- Usa `aria-invalid="true"` en campos con error para lectores de pantalla
