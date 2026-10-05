import { useEffect, useMemo } from 'react'
import type { Episode } from '../../domain/models/Episode'
import type { PodcastDetail } from '../../domain/models/PodcastDetail'
import type { PodcastRepository } from '../../domain/repositories/PodcastRepository'
import { getDefaultPodcastRepository } from '../podcastRepository'
import { logError } from '../utils/logError'
import { usePodcastDetail } from './usePodcastDetail'

export interface UseEpisodeDetailResult {
  podcast: PodcastDetail | null
  episode: Episode | null
  isLoading: boolean
}

export function useEpisodeDetail(
  podcastId: string | undefined,
  episodeId: string | undefined,
  repository: PodcastRepository = getDefaultPodcastRepository(),
): UseEpisodeDetailResult {
  const { podcast, isLoading } = usePodcastDetail(podcastId, repository)

  const episode = useMemo(() => {
    if (podcast === null || episodeId === undefined || episodeId.trim() === '') {
      return null
    }

    return podcast.episodes.find((item) => item.id === episodeId) ?? null
  }, [podcast, episodeId])

  useEffect(() => {
    if (isLoading) {
      return
    }

    if (episodeId === undefined || episodeId.trim() === '') {
      logError(new Error('Episode id is required'), 'Episode id is required')
      return
    }

    if (podcast !== null && episode === null) {
      logError(new Error('Episode not found'), 'Episode not found')
    }
  }, [isLoading, podcast, episode, episodeId])

  return {
    podcast,
    episode,
    isLoading,
  }
}
