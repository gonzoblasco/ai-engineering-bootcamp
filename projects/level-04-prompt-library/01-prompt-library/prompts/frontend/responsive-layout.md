# Responsive layout

## Cuándo usarlo
Cuando necesitas crear un layout responsive con CSS Grid o Flexbox. Cubre breakpoints, mobile-first y componentes de layout reutilizables.

## Prompt
```
Crea un layout responsive para {{LAYOUT_TYPE}}.

Requisitos:
- Usa {{CSS_METHOD}} (CSS Grid / Flexbox / Tailwind)
- Enfoque mobile-first
- Breakpoints: {{BREAKPOINTS}}
- Estructura: {{LAYOUT_STRUCTURE}}
- Comportamiento responsive: {{RESPONSIVE_BEHAVIOR}}
- Accesibilidad: {{A11Y_REQUIREMENTS}}

Contexto del proyecto:
{{PROJECT_CONTEXT}}
```

## Ejemplo de uso
**Input:**
- `{{LAYOUT_TYPE}}` = dashboard con sidebar + header + contenido principal
- `{{CSS_METHOD}}` = CSS Grid
- `{{BREAKPOINTS}}` = mobile < 768px, tablet 768-1024px, desktop > 1024px
- `{{LAYOUT_STRUCTURE}}` = header (fixed top, full width), sidebar (left, collapsible), main content (scrollable), footer (bottom)
- `{{RESPONSIVE_BEHAVIOR}}` = mobile: sidebar se oculta, se muestra con hamburger menu; tablet: sidebar colapsado (solo iconos); desktop: sidebar expandido
- `{{A11Y_REQUIREMENTS}}` = skip-to-content link, roles ARIA para nav y main, focus trap en sidebar móvil
- `{{PROJECT_CONTEXT}}` = React + Tailwind CSS, componentes en src/layouts/

**Output esperado:**
- `src/layouts/DashboardLayout.tsx` — grid container con áreas: header, sidebar, main, footer
- CSS Grid: `grid-template-areas` que cambia con media queries
- Sidebar con estado `isOpen` / `isCollapsed`, toggle con animación
- Header con hamburger button visible solo en mobile
- Skip-to-content link como primer elemento focusable

## Notas
- Para layouts complejos, CSS Grid es preferible a Flexbox (grid-template-areas da claridad)
- Si usas Tailwind, los breakpoints son `md:` (768px) y `lg:` (1024px) por defecto
- El sidebar colapsado puede usar tooltips en los iconos para usabilidad
