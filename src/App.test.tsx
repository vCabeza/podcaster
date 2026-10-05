import { render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'
import { TOP_PODCASTS_URL } from './infrastructure/api/itunesApiClient'
import { topPodcastsFeedFixture } from './infrastructure/mappers/fixtures/topPodcastsFeed.fixture'
import App from './App'

const server = setupServer(
  http.get(TOP_PODCASTS_URL, () => HttpResponse.json(topPodcastsFeedFixture)),
)

describe('App', () => {
  beforeAll(() => {
    server.listen()
  })

  afterEach(() => {
    server.resetHandlers()
  })

  afterAll(() => {
    server.close()
  })

  it('mounts the router with the Podcaster header and home view', async () => {
    render(<App />)

    expect(screen.getByRole('link', { name: 'Podcaster' })).toHaveAttribute(
      'href',
      '/',
    )
    expect(
      screen.getByRole('heading', { name: 'Podcasts' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getAllByRole('article').length).toBeGreaterThan(0)
    })
  })
})
