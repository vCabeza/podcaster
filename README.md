# Podcaster

Prueba técnica Front-end: aplicación cliente de podcasts con React, TypeScript y Clean Architecture.

## Stack

- React + TypeScript (strict)
- Vite
- react-router-dom
- react-aria-components
- Vitest + Testing Library (cobertura mínima 85%)

## Scripts

```bash
npm run dev
npm run build
npm test
npm run test:coverage
npm run lint
```

## Arquitectura

```
src/
  domain/          # Modelos y contratos de repositorio
  application/     # Hooks / casos de uso
  infrastructure/  # API, cache, DTOs
  presentation/    # Componentes y vistas
```
