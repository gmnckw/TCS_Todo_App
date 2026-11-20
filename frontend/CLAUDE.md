# Frontend Guidelines

## Stack
React JS (Vite), React Router, Axios, Tailwind CSS. Plain JavaScript (JSX).

## Folder structure
src/ components/ pages/ layouts/ hooks/ services/ context/ utils/

## Rules
- Functional components and hooks only; keep components small and reusable.
- All API calls live in src/services/ using Axios. Never call APIs inside components.
- State: React Context and custom hooks; keep state local where possible.
- Style with Tailwind utility classes. No inline styles, no hardcoded colors.
- Protect authenticated routes. Group routes by feature.
- Every form has validation, a loading state, error handling, and a success message.
- Every data view has loading, empty, and error states.
- Accessibility: labels, keyboard navigation, ARIA attributes, explicit button types.
- Desktop-first, mobile responsive.

## Commands
- npm run dev     start the dev server
- npm run build   production build
- npm test        run Jest + React Testing Library tests