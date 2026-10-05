import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { PodcastRepository } from '../../domain/repositories/PodcastRepository'
import { LoadingProvider } from '../context/LoadingContext'
import { podcastFixtures } from './fixtures/podcasts.fixture'
import { usePodcasts } from './usePodcasts'

function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <LoadingProvider>{children}</LoadingProvider>
  }
}

describe('usePodcasts', () => {
  it('loads podcasts and toggles the shared loading state', async () => {
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn().mockResolvedValue(podcastFixtures),
      getPodcastDetail: vi.fn(),
    }

    const { result } = renderHook(() => usePodcasts(repository), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.podcasts).toHaveLength(3)
    })

    expect(result.current.error).toBeNull()
    expect(result.current.isEmpty).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })

  it('exposes an error message when the repository fails', async () => {
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn().mockRejectedValue(new Error('Network down')),
      getPodcastDetail: vi.fn(),
    }

    const { result } = renderHook(() => usePodcasts(repository), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.error).toBe('Network down')
    })

    expect(result.current.podcasts).toEqual([])
  })

  it('marks the list as empty after a successful empty response', async () => {
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn().mockResolvedValue([]),
      getPodcastDetail: vi.fn(),
    }

    const { result } = renderHook(() => usePodcasts(repository), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isEmpty).toBe(true)
    })
  })

  it('normalizes non-Error rejections to a fallback message', async () => {
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn().mockRejectedValue('boom'),
      getPodcastDetail: vi.fn(),
    }

    const { result } = renderHook(() => usePodcasts(repository), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.error).toBe('Unable to load podcasts')
    })
  })
})
