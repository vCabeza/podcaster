import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
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
  afterEach(() => {
    vi.restoreAllMocks()
  })

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
    expect(result.current.hasResolved).toBe(true)
  })

  it('logs when the episode id does not exist', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn(),
      getPodcastDetail: vi.fn().mockResolvedValue(podcastDetailFixture),
    }

    const { result } = renderHook(
      () => useEpisodeDetail('360084272', '999999', repository),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(result.current.hasResolved).toBe(true)
      expect(result.current.episode).toBeNull()
    })

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalled()
    })

    const logged = consoleError.mock.calls.find(
      (call) => call[0] instanceof Error && call[0].message === 'Episode not found',
    )
    expect(logged?.[0]).toMatchObject({ message: 'Episode not found' })
  })

  it('logs when an episode id is invalid', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn(),
      getPodcastDetail: vi.fn().mockResolvedValue(podcastDetailFixture),
    }

    const { result } = renderHook(
      () => useEpisodeDetail('360084272', 'invalid', repository),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(result.current.hasResolved).toBe(true)
    })

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalled()
    })

    const logged = consoleError.mock.calls.find(
      (call) =>
        call[0] instanceof Error && call[0].message === 'Episode id is required',
    )
    expect(logged?.[0]).toMatchObject({ message: 'Episode id is required' })
  })

  it('logs podcast lookup failures via usePodcastDetail', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const failure = new Error('Lookup failed')
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn(),
      getPodcastDetail: vi.fn().mockRejectedValue(failure),
    }

    const { result } = renderHook(
      () => useEpisodeDetail('360084272', '1001', repository),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(result.current.hasResolved).toBe(true)
    })

    expect(result.current.podcast).toBeNull()
    expect(result.current.episode).toBeNull()
    expect(consoleError).toHaveBeenCalledWith(failure)
  })
})
