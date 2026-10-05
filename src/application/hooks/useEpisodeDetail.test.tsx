import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { PodcastRepository } from '../../domain/repositories/PodcastRepository'
import { LoadingProvider } from '../context/LoadingContext'
import { podcastDetailFixture } from '../../presentation/views/fixtures/podcastDetail.fixture'
import { useEpisodeDetail } from './useEpisodeDetail'

function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <LoadingProvider>{children}</LoadingProvider>
  }
}

describe('useEpisodeDetail', () => {
  it('resolves the episode from podcast detail', async () => {
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn(),
      getPodcastDetail: vi.fn().mockResolvedValue(podcastDetailFixture),
    }

    const { result } = renderHook(
      () => useEpisodeDetail('360084272', '1001', repository),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(result.current.episode?.id).toBe('1001')
    })

    expect(result.current.podcast?.id).toBe('360084272')
    expect(result.current.error).toBeNull()
  })

  it('returns not found when the episode id does not exist', async () => {
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn(),
      getPodcastDetail: vi.fn().mockResolvedValue(podcastDetailFixture),
    }

    const { result } = renderHook(
      () => useEpisodeDetail('360084272', 'missing', repository),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(result.current.error).toBe('Episode not found')
    })
  })

  it('requires an episode id', async () => {
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn(),
      getPodcastDetail: vi.fn().mockResolvedValue(podcastDetailFixture),
    }

    const { result } = renderHook(
      () => useEpisodeDetail('360084272', undefined, repository),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(result.current.error).toBe('Episode id is required')
    })
  })

  it('propagates podcast lookup errors', async () => {
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn(),
      getPodcastDetail: vi.fn().mockRejectedValue(new Error('Lookup failed')),
    }

    const { result } = renderHook(
      () => useEpisodeDetail('360084272', '1001', repository),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(result.current.error).toBe('Lookup failed')
    })
  })
})
