# Create React component (TypeScript)

## Cuándo usarlo
Cuando necesitas crear un componente React con TypeScript, props tipadas, estilos y test. Cubre componentes funcionales con hooks.

## Prompt
```
Crea un componente React llamado {{COMPONENT_NAME}}.

Requisitos:
- Usa React + TypeScript con functional component
- Props: {{PROPS_DESCRIPTION}}
- Estado local: {{STATE_DESCRIPTION}}
- Efectos secundarios: {{EFFECTS_DESCRIPTION}}
- Estilado con {{STYLING_METHOD}} (CSS Modules / Tailwind / styled-components)
- Exporta como {{EXPORT_TYPE}} (named / default)
- Incluye test con React Testing Library

Contexto del proyecto:
{{PROJECT_CONTEXT}}
```

## Ejemplo de uso
**Input:**
- `{{COMPONENT_NAME}}` = SearchBar
- `{{PROPS_DESCRIPTION}}` = onSearch: (query: string) => void, placeholder?: string, debounceMs?: number
- `{{STATE_DESCRIPTION}}` = inputValue: string, isFocused: boolean
- `{{EFFECTS_DESCRIPTION}}` = debounce de inputValue ({{DEBOUNCE_MS}}ms) antes de llamar onSearch
- `{{STYLING_METHOD}}` = Tailwind CSS
- `{{EXPORT_TYPE}}` = named
- `{{PROJECT_CONTEXT}}` = Next.js 14 App Router + TypeScript + Tailwind, componentes en src/components/

**Output esperado:**
- `src/components/SearchBar/SearchBar.tsx` — input con icono de lupa, debounce, estados focus/empty
- `src/components/SearchBar/SearchBar.test.tsx` — testea renderizado, callback onSearch, debounce
- `src/components/SearchBar/index.ts` — barrel export
- Props: `onSearch`, `placeholder` (default "Buscar..."), `debounceMs` (default 300)

## Notas
- Si usas Next.js, añade `"use client"` al inicio del archivo si el componente usa hooks o eventos
- Para componentes puramente presentacionales, omite la sección de estado y efectos
- El debounce se implementa con `useEffect` + `setTimeout`; considera usar `useRef` para el timer
