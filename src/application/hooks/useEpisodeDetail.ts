import { useMemo } from 'react'
import type { Episode } from '../../domain/models/Episode'
import type { PodcastDetail } from '../../domain/models/PodcastDetail'
import type { PodcastRepository } from '../../domain/repositories/PodcastRepository'
import { getDefaultPodcastRepository } from '../podcastRepository'
import { usePodcastDetail } from './usePodcastDetail'

export interface UseEpisodeDetailResult {
  podcast: PodcastDetail | null
  episode: Episode | null
  isLoading: boolean
  error: string | null
}

export function useEpisodeDetail(
  podcastId: string | undefined,
  episodeId: string | undefined,
  repository: PodcastRepository = getDefaultPodcastRepository(),
): UseEpisodeDetailResult {
  const { podcast, isLoading, error } = usePodcastDetail(podcastId, repository)

  const episode = useMemo(() => {
    if (podcast === null || episodeId === undefined || episodeId.trim() === '') {
      return null
    }

    return (
      podcast.episodes.find((item) => item.id === episodeId) ?? null
    )
  }, [podcast, episodeId])

  const resolvedError = resolveEpisodeError({
    podcastError: error,
    isLoading,
    podcast,
    episode,
    episodeId,
  })

  return {
    podcast,
    episode,
    isLoading,
    error: resolvedError,
  }
}

function resolveEpisodeError({
  podcastError,
  isLoading,
  podcast,
  episode,
  episodeId,
}: {
  podcastError: string | null
  isLoading: boolean
  podcast: PodcastDetail | null
  episode: Episode | null
  episodeId: string | undefined
}): string | null {
  if (podcastError !== null) {
    return podcastError
  }

  if (isLoading) {
    return null
  }

  if (episodeId === undefined || episodeId.trim() === '') {
    return 'Episode id is required'
  }

  if (podcast !== null && episode === null) {
    return 'Episode not found'
  }

  return null
}
