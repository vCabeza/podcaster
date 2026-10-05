import { useEffect, useState } from 'react'
import type { PodcastDetail } from '../../domain/models/PodcastDetail'
import type { PodcastRepository } from '../../domain/repositories/PodcastRepository'
import { useLoading } from '../context/LoadingContext'
import { getDefaultPodcastRepository } from '../podcastRepository'

export interface UsePodcastDetailResult {
  podcast: PodcastDetail | null
  isLoading: boolean
  error: string | null
}

export function usePodcastDetail(
  podcastId: string | undefined,
  repository: PodcastRepository = getDefaultPodcastRepository(),
): UsePodcastDetailResult {
  const { isLoading, startLoading, stopLoading } = useLoading()
  const [podcast, setPodcast] = useState<PodcastDetail | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (podcastId === undefined || podcastId.trim().length === 0) {
      setPodcast(null)
      setError('Podcast id is required')
      return
    }

    const resolvedPodcastId = podcastId
    let cancelled = false
    let settled = false

    async function loadPodcastDetail() {
      startLoading()
      setError(null)

      try {
        const result = await repository.getPodcastDetail(resolvedPodcastId)

        if (!cancelled) {
          setPodcast(result)
        }
      } catch (loadError: unknown) {
        if (!cancelled) {
          const message =
            loadError instanceof Error
              ? loadError.message
              : 'Unable to load podcast detail'
          setError(message)
          setPodcast(null)
        }
      } finally {
        settled = true

        if (!cancelled) {
          stopLoading()
        }
      }
    }

    void loadPodcastDetail()

    return () => {
      cancelled = true

      if (!settled) {
        stopLoading()
      }
    }
  }, [podcastId, repository, startLoading, stopLoading])

  return {
    podcast,
    isLoading,
    error,
  }
}
