import { useEffect, useState } from 'react'
import type { Podcast } from '../../domain/models/Podcast'
import type { PodcastRepository } from '../../domain/repositories/PodcastRepository'
import { useLoading } from '../context/LoadingContext'
import { getDefaultPodcastRepository } from '../podcastRepository'
import { logError } from '../utils/logError'

export interface UsePodcastsResult {
  podcasts: Podcast[]
  isLoading: boolean
  isEmpty: boolean
}

export function usePodcasts(
  repository: PodcastRepository = getDefaultPodcastRepository(),
): UsePodcastsResult {
  const { isLoading, startLoading, stopLoading } = useLoading()
  const [podcasts, setPodcasts] = useState<Podcast[]>([])
  const [hasLoaded, setHasLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false
    let settled = false

    async function loadPodcasts() {
      startLoading()

      try {
        const result = await repository.getTopPodcasts()

        if (!cancelled) {
          setPodcasts(result)
          setHasLoaded(true)
        }
      } catch (loadError: unknown) {
        if (!cancelled) {
          logError(loadError, 'Unable to load podcasts')
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
    isEmpty: hasLoaded && !isLoading && podcasts.length === 0,
  }
}
