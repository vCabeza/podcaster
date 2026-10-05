import { render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { LoadingProvider } from '../../application/context/LoadingContext'
import { TOP_PODCASTS_URL } from '../../infrastructure/api/itunesApiClient'
import { topPodcastsFeedFixture } from '../../infrastructure/mappers/fixtures/topPodcastsFeed.fixture'
import { appRoutes } from './router'

const server = setupServer(
  http.get(TOP_PODCASTS_URL, () => HttpResponse.json(topPodcastsFeedFixture)),
)

function renderUnknownRoute(path: string) {
  const router = createMemoryRouter(appRoutes, {
    initialEntries: [path],
  })

  render(
    <LoadingProvider>
      <RouterProvider router={router} />
    </LoadingProvider>,
  )

  return router
}

describe('appRoutes unknown path fallback', () => {
  beforeAll(() => {
    server.listen()
  })

  afterEach(() => {
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })

  it('redirects unrecognized routes to the home page', async () => {
    const router = renderUnknownRoute('/unknown-route-12345')

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/')
    })

    expect(screen.getByRole('heading', { name: 'Podcasts' })).toBeInTheDocument()
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
  })

  it('redirects incomplete podcast paths to the home page', async () => {
    const router = renderUnknownRoute('/podcast')

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/')
    })

    expect(screen.getByRole('heading', { name: 'Podcasts' })).toBeInTheDocument()
  })
})
