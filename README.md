# Podcaster

Prueba técnica Front-end: aplicación cliente de podcasts con React, TypeScript y Clean Architecture.

## Requisitos previos

| Herramienta | Versión mínima |
|-------------|----------------|
| [Node.js](https://nodejs.org/) | **>= 20** (LTS o superior; verificado con Node 24) |
| npm | **>= 10** (incluido con Node) |

Comprueba tus versiones:

```bash
node -v
npm -v
```

## Instalación

En la raíz del repositorio:

```bash
npm install
```

No hace falta configurar variables de entorno: la app arranca sin fichero `.env`.

## Ejecutar la aplicación

La prueba técnica pide dos modos de ejecución.

### Modo development

Sirve los assets **sin minimizar** con el servidor de Vite (HMR incluido):

```bash
npm run dev
```

Abre la URL que muestre la terminal (por defecto `http://localhost:5173`).

En este modo, el detalle de podcast usa el proxy de Vite (`/api/itunes` → `itunes.apple.com`) para evitar CORS en local.

### Modo production

1. Genera el build (TypeScript + Vite). Los assets quedan **concatenados y minimizados** en `dist/`:

```bash
npm run build
```

2. Sirve el build localmente:

```bash
npm run preview
```

Abre la URL que muestre la terminal (por defecto `http://localhost:4173`).

En producción, el lookup de podcasts pasa por un proxy CORS público (AllOrigins; con fallback a corsproxy.io si falla).

## Scripts disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| Desarrollo | `npm run dev` | Servidor Vite con HMR |
| Build | `npm run build` | Compila TypeScript y genera `dist/` |
| Preview | `npm run preview` | Sirve el build de producción en local |
| Lint | `npm run lint` | ESLint sobre el proyecto |
| Tests | `npm test` | Vitest en modo watch |
| Cobertura | `npm run test:coverage` | Vitest en CI + informe de cobertura |
| E2E | `npm run test:e2e` | Playwright (build + preview + Chromium) |
| E2E UI | `npm run test:e2e:ui` | Playwright en modo UI |

## Tests

- **Unitarios / integración ligera:** [Vitest](https://vitest.dev/) + [Testing Library](https://testing-library.com/). La API de Vitest es compatible en gran medida con Jest (`describe` / `it` / `expect` / mocks).
- **Cobertura:** umbral mínimo del **85%** (líneas, funciones, ramas y statements). Comprueba con:

```bash
npm run test:coverage
```

### Tests e2e

Los e2e usan [Playwright](https://playwright.dev/) contra el build de producción. El propio Playwright ejecuta siempre `npm run build && npm run preview` y mockea iTunes/AllOrigins (sin red real).

La primera vez en una máquina, instala el browser de Chromium:

```bash
npx playwright install chromium
```

Luego:

```bash
npm run test:e2e
```

Modo interactivo (opcional):

```bash
npm run test:e2e:ui
```

## Arquitectura

Capas Clean / hexagonal. El **dominio** define modelos y el puerto del repositorio; no depende de React, HTTP ni localStorage. La **infraestructura** adapta APIs y caché a ese contrato.

```
src/
  domain/           # Modelos y contrato PodcastRepository (puerto)
  application/      # Hooks / casos de uso y utilidades de app
  infrastructure/   # Cliente HTTP, DTOs, mappers, caché, repositorio
  presentation/     # Rutas, layouts, vistas y componentes UI
```

Correspondencia orientativa con las pantallas:

| Pantalla | Ruta | Capas implicadas |
|----------|------|------------------|
| Home (top 100 + filtro) | `/` | `presentation` + `application` + repositorio |
| Detalle de podcast | `/podcast/:podcastId` | igual |
| Detalle de episodio | `/podcast/:podcastId/episode/:episodeId` | igual |

CSS nativo por componente/vista (sin librerías de estilos).

## APIs y red

- **Top 100 podcasts:** feed RSS JSON de iTunes  
  `https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json`
- **Detalle + episodios:** iTunes Lookup  
  `https://itunes.apple.com/lookup?id=...&media=podcast&entity=podcastEpisode&limit=20`

Cómo se llama según el entorno:

| Entorno | Top podcasts | Lookup |
|---------|--------------|--------|
| Development | Directo a iTunes | Proxy Vite `/api/itunes/...` |
| Production | Directo a iTunes | AllOrigins `https://api.allorigins.win/get?url=...` (fallback: corsproxy.io) |

Los fallos de red o de API se registran en la **consola** (`console.error`) y **no** se muestran como errores de red crudos en la UI.

Los resultados se cachean **24 horas** en `localStorage` (lista top y detalle por podcast).
