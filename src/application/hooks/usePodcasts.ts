import { useEffect, useState } from 'react'
import type { Podcast } from '../../domain/models/Podcast'
import type { PodcastRepository } from '../../domain/repositories/PodcastRepository'
import { useLoading } from '../context/LoadingContext'
import { getDefaultPodcastRepository } from '../podcastRepository'

export interface UsePodcastsResult {
  podcasts: Podcast[]
  isLoading: boolean
  error: string | null
  isEmpty: boolean
}

export function usePodcasts(
  repository: PodcastRepository = getDefaultPodcastRepository(),
): UsePodcastsResult {
  const { isLoading, startLoading, stopLoading } = useLoading()
  const [podcasts, setPodcasts] = useState<Podcast[]>([])
  const [error, setError] = useState<string | null>(null)
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    let settled = false

    async function loadPodcasts() {
      startLoading()
      setError(null)

      try {
        const result = await repository.getTopPodcasts()

        if (!cancelled) {
          setPodcasts(result)
          setHasLoaded(true)
        }
      } catch (loadError: unknown) {
        if (!cancelled) {
          const message =
            loadError instanceof Error
              ? loadError.message
              : 'Unable to load podcasts'
          setError(message)
          setPodcasts([])
          setHasLoaded(true)
        }
      } finally {
        settled = true

        if (!cancelled) {
          stopLoading()
        }
      }
    }

    void loadPodcasts()

    return () => {
      cancelled = true

      if (!settled) {
        stopLoading()
      }
    }
  }, [repository, startLoading, stopLoading])

  return {
    podcasts,
    isLoading,
    error,
    isEmpty: hasLoaded && !isLoading && podcasts.length === 0 && error === null,
  }
}
