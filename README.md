# Podcaster

Prueba técnica Front-end: aplicación cliente de podcasts con React, TypeScript y Clean Architecture.

## Requisitos previos

- Node.js (versión LTS recomendada)
- npm

```bash
npm install
```

## Ejecutar la aplicación

La aplicación incluye dos modos de ejecución, tal como pide la prueba técnica.

### Modo development

Sirve los assets **sin minimizar** a través del servidor de desarrollo de Vite (hot reload incluido):

```bash
npm run dev
```

Abre la URL que muestre la terminal (por defecto `http://localhost:5173`).

### Modo production

1. Genera el build de producción (TypeScript + Vite). Los assets quedan **concatenados y minimizados** en la carpeta `dist/`:

```bash
npm run build
```

2. Sirve el build localmente para verificarlo:

```bash
npm run preview
```

Abre la URL que muestre la terminal (por defecto `http://localhost:4173`).

## Otros scripts

```bash
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
