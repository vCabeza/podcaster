import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { PodcastApiClient } from '../api/itunesApiClient'
import {
  CacheService,
  ONE_DAY_MS,
  TOP_PODCASTS_CACHE_KEY,
  buildPodcastDetailCacheKey,
} from '../cache/CacheService'
import { MemoryCacheStorage } from '../cache/MemoryCacheStorage'
import { podcastLookupResponseFixture } from '../mappers/fixtures/podcastLookup.fixture'
import { topPodcastsFeedFixture } from '../mappers/fixtures/topPodcastsFeed.fixture'
import { ApiPodcastRepository } from './ApiPodcastRepository'

function createClientMock(
  overrides: Partial<PodcastApiClient>,
): PodcastApiClient {
  return {
    fetchTopPodcasts: vi.fn(),
    fetchPodcastLookup: vi.fn(),
    ...overrides,
  }
}

describe('ApiPodcastRepository', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-06-01T12:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns mapped podcasts from the top feed', async () => {
    const client = createClientMock({
      fetchTopPodcasts: vi.fn().mockResolvedValue(topPodcastsFeedFixture),
    })
    const cache = new CacheService(new MemoryCacheStorage())
    const repository = new ApiPodcastRepository(client, cache)

    const podcasts = await repository.getTopPodcasts()

    expect(client.fetchTopPodcasts).toHaveBeenCalledOnce()
    expect(podcasts[0]?.id).toBe('360084272')
    expect(podcasts).toHaveLength(2)
  })

  it('returns mapped podcast detail from the lookup endpoint', async () => {
    const client = createClientMock({
      fetchPodcastLookup: vi
        .fn()
        .mockResolvedValue(podcastLookupResponseFixture),
    })
    const cache = new CacheService(new MemoryCacheStorage())
    const repository = new ApiPodcastRepository(client, cache)

    const detail = await repository.getPodcastDetail('360084272')

    expect(client.fetchPodcastLookup).toHaveBeenCalledWith('360084272')
    expect(detail.id).toBe('360084272')
    expect(detail.episodes).toHaveLength(2)
    expect(detail.episodes[1]?.audioUrl).toBe('')
  })

  it('propagates client errors', async () => {
    const client = createClientMock({
      fetchTopPodcasts: vi
        .fn()
        .mockRejectedValue(new Error('Failed to fetch top podcasts (500)')),
    })
    const cache = new CacheService(new MemoryCacheStorage())
    const repository = new ApiPodcastRepository(client, cache)

    await expect(repository.getTopPodcasts()).rejects.toThrow(
      'Failed to fetch top podcasts (500)',
    )
  })

  it('fetches top podcasts once and serves the second call from cache', async () => {
    const fetchTopPodcasts = vi.fn().mockResolvedValue(topPodcastsFeedFixture)
    const client = createClientMock({ fetchTopPodcasts })
    const cache = new CacheService(new MemoryCacheStorage())
    const repository = new ApiPodcastRepository(client, cache)

    const first = await repository.getTopPodcasts()
    const second = await repository.getTopPodcasts()

    expect(fetchTopPodcasts).toHaveBeenCalledTimes(1)
    expect(second).toEqual(first)
    expect(cache.get(TOP_PODCASTS_CACHE_KEY)).toEqual(first)
  })

  it('refetches top podcasts after the 24-hour TTL expires', async () => {
    const fetchTopPodcasts = vi.fn().mockResolvedValue(topPodcastsFeedFixture)
    const client = createClientMock({ fetchTopPodcasts })
    const cache = new CacheService(new MemoryCacheStorage())
    const repository = new ApiPodcastRepository(client, cache)

    await repository.getTopPodcasts()
    vi.setSystemTime(new Date(Date.now() + ONE_DAY_MS + 1))
    await repository.getTopPodcasts()

    expect(fetchTopPodcasts).toHaveBeenCalledTimes(2)
  })

  it('fetches podcast detail once and reuses the cached detail within 24 hours', async () => {
    const fetchPodcastLookup = vi
      .fn()
      .mockResolvedValue(podcastLookupResponseFixture)
    const client = createClientMock({ fetchPodcastLookup })
    const cache = new CacheService(new MemoryCacheStorage())
    const repository = new ApiPodcastRepository(client, cache)

    const first = await repository.getPodcastDetail('360084272')
    const second = await repository.getPodcastDetail('360084272')

    expect(fetchPodcastLookup).toHaveBeenCalledTimes(1)
    expect(second).toEqual(first)
    expect(cache.get(buildPodcastDetailCacheKey('360084272'))).toEqual(first)
  })

  it('refetches podcast detail after the cache expires', async () => {
    const fetchPodcastLookup = vi
      .fn()
      .mockResolvedValue(podcastLookupResponseFixture)
    const client = createClientMock({ fetchPodcastLookup })
    const cache = new CacheService(new MemoryCacheStorage())
    const repository = new ApiPodcastRepository(client, cache)

    await repository.getPodcastDetail('360084272')
    vi.setSystemTime(new Date(Date.now() + ONE_DAY_MS + 1))
    await repository.getPodcastDetail('360084272')

    expect(fetchPodcastLookup).toHaveBeenCalledTimes(2)
  })
})
