import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import type { PodcastDetail } from '../../domain/models/PodcastDetail'
import type { PodcastRepository } from '../../domain/repositories/PodcastRepository'
import { LoadingProvider } from '../context/LoadingContext'
import { usePodcastDetail } from './usePodcastDetail'

const podcastDetailFixture: PodcastDetail = {
  id: '360084272',
  title: 'The Joe Rogan Experience',
  author: 'Joe Rogan',
  image: 'https://example.com/jre.jpg',
  description: 'Long-form conversations.',
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

    expect(result.current.error).toBeNull()
    expect(repository.getPodcastDetail).toHaveBeenCalledWith('360084272')
  })

  it('exposes repository errors', async () => {
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn(),
      getPodcastDetail: vi.fn().mockRejectedValue(new Error('Lookup failed')),
    }

    const { result } = renderHook(
      () => usePodcastDetail('360084272', repository),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(result.current.error).toBe('Lookup failed')
    })
  })

  it('requires a podcast id', async () => {
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn(),
      getPodcastDetail: vi.fn(),
    }

    const { result } = renderHook(() => usePodcastDetail(undefined, repository), {
      wrapper: createWrapper(),
    })

    await waitFor(() => {
      expect(result.current.error).toBe('Podcast id is required')
    })

    expect(repository.getPodcastDetail).not.toHaveBeenCalled()
  })

  it('normalizes non-Error rejections', async () => {
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn(),
      getPodcastDetail: vi.fn().mockRejectedValue('nope'),
    }

    const { result } = renderHook(
      () => usePodcastDetail('360084272', repository),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(result.current.error).toBe('Unable to load podcast detail')
    })
  })
})
