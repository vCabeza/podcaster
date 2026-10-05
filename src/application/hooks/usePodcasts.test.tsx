import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
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
  afterEach(() => {
    vi.restoreAllMocks()
  })

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

    expect(result.current.isEmpty).toBe(false)
    expect(result.current.isLoading).toBe(false)
  })

  it('logs repository failures to the console and clears the list', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const failure = new Error('Network down')
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn().mockRejectedValue(failure),
      getPodcastDetail: vi.fn(),
    }

    const { result } = renderHook(() => usePodcasts(repository), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(result.current.podcasts).toEqual([])
    expect(consoleError).toHaveBeenCalledWith(failure)
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

  it('logs a wrapped Error for non-Error rejections', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn().mockRejectedValue('boom'),
      getPodcastDetail: vi.fn(),
    }

    const { result } = renderHook(() => usePodcasts(repository), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false)
    })

    expect(consoleError).toHaveBeenCalledTimes(1)
    const logged = consoleError.mock.calls[0]?.[0]
    expect(logged).toBeInstanceOf(Error)
    expect(logged).toMatchObject({ message: 'Unable to load podcasts' })
  })
})
