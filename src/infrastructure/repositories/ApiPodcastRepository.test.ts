import { describe, expect, it, vi } from 'vitest'
import type { PodcastApiClient } from '../api/itunesApiClient'
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
  it('returns mapped podcasts from the top feed', async () => {
    const client = createClientMock({
      fetchTopPodcasts: vi.fn().mockResolvedValue(topPodcastsFeedFixture),
    })

    const repository = new ApiPodcastRepository(client)
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

    const repository = new ApiPodcastRepository(client)
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

    const repository = new ApiPodcastRepository(client)

    await expect(repository.getTopPodcasts()).rejects.toThrow(
      'Failed to fetch top podcasts (500)',
    )
  })
})
