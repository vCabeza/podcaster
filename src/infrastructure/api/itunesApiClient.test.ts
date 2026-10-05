import { describe, expect, it, vi } from 'vitest'
import {
  buildAllOriginsLookupUrl,
  buildCorsProxyLookupUrl,
  buildDevProxyLookupUrl,
  buildItunesLookupUrl,
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

describe('lookup URL builders', () => {
  it('builds the raw iTunes lookup URL', () => {
    expect(buildItunesLookupUrl('360084272')).toBe(
      'https://itunes.apple.com/lookup?id=360084272&media=podcast&entity=podcastEpisode&limit=20',
    )
  })

  it('builds the Vite development proxy URL', () => {
    expect(buildDevProxyLookupUrl('360084272')).toBe(
      '/api/itunes/lookup?id=360084272&media=podcast&entity=podcastEpisode&limit=20',
    )
  })

  it('wraps the iTunes lookup URL with AllOrigins encoding', () => {
    const expectedItunes = buildItunesLookupUrl('360084272')

    expect(buildAllOriginsLookupUrl('360084272')).toBe(
      `https://api.allorigins.win/get?url=${encodeURIComponent(expectedItunes)}`,
    )
    expect(buildPodcastLookupUrl('360084272')).toBe(
      buildAllOriginsLookupUrl('360084272'),
    )
  })

  it('builds the corsproxy.io fallback URL', () => {
    const expectedItunes = buildItunesLookupUrl('360084272')

    expect(buildCorsProxyLookupUrl('360084272')).toBe(
      `https://corsproxy.io/?url=${encodeURIComponent(expectedItunes)}`,
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
    const client = new ITunesApiClient(fetchFn, 'production')

    const feed = await client.fetchTopPodcasts()

    expect(fetchFn).toHaveBeenCalledWith(TOP_PODCASTS_URL)
    expect(feed).toEqual({ feed: { entry: [] } })
  })

  it('throws when the top podcasts request fails', async () => {
    const fetchFn = vi.fn().mockResolvedValue(createJsonResponse({}, 500))
    const client = new ITunesApiClient(fetchFn, 'production')

    await expect(client.fetchTopPodcasts()).rejects.toThrow(
      'Failed to fetch top podcasts (500)',
    )
  })

  it('throws when the top podcasts payload is invalid', async () => {
    const fetchFn = vi.fn().mockResolvedValue(createJsonResponse({ feed: 1 }))
    const client = new ITunesApiClient(fetchFn, 'production')

    await expect(client.fetchTopPodcasts()).rejects.toThrow(
      'Unexpected iTunes feed response shape',
    )
  })

  it('uses the Vite proxy and accepts direct lookup JSON in development', async () => {
    const fetchFn = vi.fn().mockResolvedValue(
      createJsonResponse({
        resultCount: 0,
        results: [],
      }),
    )
    const client = new ITunesApiClient(fetchFn, 'development')

    const response = await client.fetchPodcastLookup('42')

    expect(fetchFn).toHaveBeenCalledWith(buildDevProxyLookupUrl('42'))
    expect(fetchFn).toHaveBeenCalledTimes(1)
    expect(JSON.parse(response.contents)).toEqual({
      resultCount: 0,
      results: [],
    })
  })

  it('fetches and validates the AllOrigins lookup response in production', async () => {
    const fetchFn = vi.fn().mockResolvedValue(
      createJsonResponse({
        contents: '{"resultCount":0,"results":[]}',
      }),
    )
    const client = new ITunesApiClient(fetchFn, 'production')

    const response = await client.fetchPodcastLookup('42')

    expect(fetchFn).toHaveBeenCalledWith(buildAllOriginsLookupUrl('42'))
    expect(response.contents).toContain('resultCount')
  })

  it('falls back to corsproxy.io when AllOrigins fails in production', async () => {
    const fetchFn = vi
      .fn()
      .mockResolvedValueOnce(createJsonResponse({}, 522))
      .mockResolvedValueOnce(
        createJsonResponse({
          resultCount: 1,
          results: [
            {
              kind: 'podcast',
              collectionId: 42,
              collectionName: 'Show',
              artistName: 'Host',
            },
          ],
        }),
      )
    const client = new ITunesApiClient(fetchFn, 'production')

    const response = await client.fetchPodcastLookup('42')

    expect(fetchFn).toHaveBeenNthCalledWith(1, buildAllOriginsLookupUrl('42'))
    expect(fetchFn).toHaveBeenNthCalledWith(2, buildCorsProxyLookupUrl('42'))
    expect(JSON.parse(response.contents).resultCount).toBe(1)
  })

  it('falls back when AllOrigins throws a network error', async () => {
    const fetchFn = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      .mockResolvedValueOnce(
        createJsonResponse({
          resultCount: 0,
          results: [],
        }),
      )
    const client = new ITunesApiClient(fetchFn, 'production')

    const response = await client.fetchPodcastLookup('42')

    expect(fetchFn).toHaveBeenCalledTimes(2)
    expect(JSON.parse(response.contents)).toEqual({
      resultCount: 0,
      results: [],
    })
  })

  it('throws when every production lookup transport fails', async () => {
    const fetchFn = vi.fn().mockResolvedValue(createJsonResponse({}, 522))
    const client = new ITunesApiClient(fetchFn, 'production')

    await expect(client.fetchPodcastLookup('missing')).rejects.toThrow(
      'Failed to fetch podcast detail for id "missing" (522)',
    )
    expect(fetchFn).toHaveBeenCalledTimes(2)
  })

  it('throws when the development proxy payload is invalid', async () => {
    const fetchFn = vi.fn().mockResolvedValue(createJsonResponse({ contents: 10 }))
    const client = new ITunesApiClient(fetchFn, 'development')

    await expect(client.fetchPodcastLookup('42')).rejects.toThrow(
      'Unexpected iTunes lookup response shape',
    )
  })
})
