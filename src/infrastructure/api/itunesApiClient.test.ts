import { describe, expect, it, vi } from 'vitest'
import {
  buildPodcastLookupUrl,
  ITunesApiClient,
  TOP_PODCASTS_URL,
} from './itunesApiClient'

function createJsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

describe('buildPodcastLookupUrl', () => {
  it('wraps the iTunes lookup URL with AllOrigins encoding', () => {
    const url = buildPodcastLookupUrl('360084272')
    const expectedItunes =
      'https://itunes.apple.com/lookup?id=360084272&media=podcast&entity=podcastEpisode&limit=20'

    expect(url).toBe(
      `https://api.allorigins.win/get?url=${encodeURIComponent(expectedItunes)}`,
    )
  })
})

describe('ITunesApiClient', () => {
  it('fetches and validates the top podcasts feed', async () => {
    const fetchFn = vi.fn().mockResolvedValue(
      createJsonResponse({
        feed: {
          entry: [],
        },
      }),
    )
    const client = new ITunesApiClient(fetchFn)

    const feed = await client.fetchTopPodcasts()

    expect(fetchFn).toHaveBeenCalledWith(TOP_PODCASTS_URL)
    expect(feed).toEqual({ feed: { entry: [] } })
  })

  it('throws when the top podcasts request fails', async () => {
    const fetchFn = vi.fn().mockResolvedValue(createJsonResponse({}, 500))
    const client = new ITunesApiClient(fetchFn)

    await expect(client.fetchTopPodcasts()).rejects.toThrow(
      'Failed to fetch top podcasts (500)',
    )
  })

  it('throws when the top podcasts payload is invalid', async () => {
    const fetchFn = vi.fn().mockResolvedValue(createJsonResponse({ feed: 1 }))
    const client = new ITunesApiClient(fetchFn)

    await expect(client.fetchTopPodcasts()).rejects.toThrow(
      'Unexpected iTunes feed response shape',
    )
  })

  it('fetches and validates the AllOrigins lookup response', async () => {
    const fetchFn = vi.fn().mockResolvedValue(
      createJsonResponse({
        contents: '{"resultCount":0,"results":[]}',
      }),
    )
    const client = new ITunesApiClient(fetchFn)

    const response = await client.fetchPodcastLookup('42')

    expect(fetchFn).toHaveBeenCalledWith(buildPodcastLookupUrl('42'))
    expect(response.contents).toContain('resultCount')
  })

  it('throws when the lookup request fails', async () => {
    const fetchFn = vi.fn().mockResolvedValue(createJsonResponse({}, 404))
    const client = new ITunesApiClient(fetchFn)

    await expect(client.fetchPodcastLookup('missing')).rejects.toThrow(
      'Failed to fetch podcast detail for id "missing" (404)',
    )
  })

  it('throws when the AllOrigins payload is invalid', async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValue(createJsonResponse({ contents: 10 }))
    const client = new ITunesApiClient(fetchFn)

    await expect(client.fetchPodcastLookup('42')).rejects.toThrow(
      'Unexpected AllOrigins lookup response shape',
    )
  })
})
