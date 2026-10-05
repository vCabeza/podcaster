import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { PodcastDetail } from '../../domain/models/PodcastDetail'
import type { PodcastRepository } from '../../domain/repositories/PodcastRepository'
import { LoadingProvider } from '../context/LoadingContext'
import { usePodcastDetail } from './usePodcastDetail'

const podcastDetailFixture: PodcastDetail = {
  id: '360084272',
  title: 'The Joe Rogan Experience',
  author: 'Joe Rogan',
  image: 'https://example.com/jre.jpg',
  episodes: [
    {
      id: '1001',
      title: 'Episode One',
      description: 'First episode',
      releaseDate: '2016-03-01T10:00:00Z',
      duration: '01:02:05',
      audioUrl: 'https://example.com/1.mp3',
    },
    {
      id: '1002',
      title: 'Episode Two',
      description: 'Second episode',
      releaseDate: '2016-02-18T10:00:00Z',
      duration: '14:00',
      audioUrl: '',
    },
  ],
}

function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <LoadingProvider>{children}</LoadingProvider>
  }
}

describe('usePodcastDetail', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('loads podcast detail for a given id', async () => {
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn(),
      getPodcastDetail: vi.fn().mockResolvedValue(podcastDetailFixture),
    }

    const { result } = renderHook(
      () => usePodcastDetail('360084272', repository),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(result.current.podcast?.id).toBe('360084272')
    })

    expect(result.current.hasResolved).toBe(true)
    expect(repository.getPodcastDetail).toHaveBeenCalledWith('360084272')
  })

  it('logs repository errors to the console', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const failure = new Error('Lookup failed')
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn(),
      getPodcastDetail: vi.fn().mockRejectedValue(failure),
    }

    const { result } = renderHook(
      () => usePodcastDetail('360084272', repository),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(result.current.hasResolved).toBe(true)
    })

    expect(result.current.podcast).toBeNull()
    expect(consoleError).toHaveBeenCalledWith(failure)
  })

  it('logs when a podcast id is missing or invalid', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn(),
      getPodcastDetail: vi.fn(),
    }

    const { result } = renderHook(() => usePodcastDetail('abc', repository), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.hasResolved).toBe(true)
    })

    expect(result.current.podcast).toBeNull()
    expect(repository.getPodcastDetail).not.toHaveBeenCalled()
    const logged = consoleError.mock.calls[0]?.[0]
    expect(logged).toBeInstanceOf(Error)
    expect(logged).toMatchObject({ message: 'Podcast id is required' })
  })

  it('logs a wrapped Error for non-Error rejections', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn(),
      getPodcastDetail: vi.fn().mockRejectedValue('nope'),
    }

    const { result } = renderHook(
      () => usePodcastDetail('360084272', repository),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(result.current.hasResolved).toBe(true)
    })

    const logged = consoleError.mock.calls[0]?.[0]
    expect(logged).toBeInstanceOf(Error)
    expect(logged).toMatchObject({ message: 'Unable to load podcast detail' })
  })
})
