import { useEffect, useState } from 'react'
import type { PodcastDetail } from '../../domain/models/PodcastDetail'
import type { PodcastRepository } from '../../domain/repositories/PodcastRepository'
import { useLoading } from '../context/LoadingContext'
import { getDefaultPodcastRepository } from '../podcastRepository'
import { logError } from '../utils/logError'
import { isValidRouteId, normalizeRouteId } from '../utils/routeIds'

export interface UsePodcastDetailResult {
  podcast: PodcastDetail | null
  isLoading: boolean
  hasResolved: boolean
}

export function usePodcastDetail(
  podcastId: string | undefined,
  repository: PodcastRepository = getDefaultPodcastRepository(),
): UsePodcastDetailResult {
  const { isLoading, startLoading, stopLoading } = useLoading()
  const [podcast, setPodcast] = useState<PodcastDetail | null>(null)
  const [hasResolved, setHasResolved] = useState(false)

  useEffect(() => {
    if (!isValidRouteId(podcastId)) {
      setPodcast(null)
      setHasResolved(true)
      logError(new Error('Podcast id is required'), 'Podcast id is required')
      return
    }

    const resolvedPodcastId = normalizeRouteId(podcastId)
    let cancelled = false
    let settled = false

    setHasResolved(false)

    async function loadPodcastDetail() {
      startLoading()

      try {
        const result = await repository.getPodcastDetail(resolvedPodcastId)

        if (!cancelled) {
          setPodcast(result)
        }
      } catch (loadError: unknown) {
        if (!cancelled) {
          logError(loadError, 'Unable to load podcast detail')
          setPodcast(null)
        }
      } finally {
        settled = true

        if (!cancelled) {
          setHasResolved(true)
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
    hasResolved,
  }
}
