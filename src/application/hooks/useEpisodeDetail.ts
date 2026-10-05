import { useEffect, useMemo } from 'react'
import type { Episode } from '../../domain/models/Episode'
import type { PodcastDetail } from '../../domain/models/PodcastDetail'
import type { PodcastRepository } from '../../domain/repositories/PodcastRepository'
import { getDefaultPodcastRepository } from '../podcastRepository'
import { logError } from '../utils/logError'
import { isValidRouteId, normalizeRouteId } from '../utils/routeIds'
import { usePodcastDetail } from './usePodcastDetail'

export interface UseEpisodeDetailResult {
  podcast: PodcastDetail | null
  episode: Episode | null
  isLoading: boolean
  hasResolved: boolean
}

export function useEpisodeDetail(
  podcastId: string | undefined,
  episodeId: string | undefined,
  repository: PodcastRepository = getDefaultPodcastRepository(),
): UseEpisodeDetailResult {
  const {
    podcast,
    isLoading,
    hasResolved: podcastResolved,
  } = usePodcastDetail(podcastId, repository)

  const episodeIdValid = isValidRouteId(episodeId)

  const episode = useMemo(() => {
    if (podcast === null || !episodeIdValid || episodeId === undefined) {
      return null
    }

    const normalizedEpisodeId = normalizeRouteId(episodeId)
    return (
      podcast.episodes.find((item) => item.id === normalizedEpisodeId) ?? null
    )
  }, [podcast, episodeId, episodeIdValid])

  const hasResolved = podcastResolved && !isLoading

  useEffect(() => {
    if (!hasResolved) {
      return
    }

    if (!episodeIdValid) {
      logError(new Error('Episode id is required'), 'Episode id is required')
      return
    }

    if (podcast !== null && episode === null) {
      logError(new Error('Episode not found'), 'Episode not found')
    }
  }, [hasResolved, podcast, episode, episodeIdValid])

  return {
    podcast,
    episode,
    isLoading,
    hasResolved,
  }
}
