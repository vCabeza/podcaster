import { Navigate, useParams } from 'react-router-dom'
import type { PodcastRepository } from '../../domain/repositories/PodcastRepository'
import { useEpisodeDetail } from '../../application/hooks/useEpisodeDetail'
import { isValidRouteId, normalizeRouteId } from '../../application/utils/routeIds'
import { DetailPageLayout } from '../components/DetailPageLayout/DetailPageLayout'
import { EpisodeContent } from '../components/EpisodeContent/EpisodeContent'
import { PodcastSidebar } from '../components/PodcastSidebar/PodcastSidebar'

export interface EpisodeDetailViewProps {
  repository?: PodcastRepository
}

export function EpisodeDetailView({ repository }: EpisodeDetailViewProps) {
  const { podcastId, episodeId } = useParams()
  const { podcast, episode, isLoading, hasResolved } = useEpisodeDetail(
    podcastId,
    episodeId,
    repository,
  )

  const podcastIdValid = isValidRouteId(podcastId)

  if (hasResolved && !podcastIdValid) {
    return <Navigate to="/" replace />
  }

  if (hasResolved && podcast === null) {
    return <Navigate to="/" replace />
  }

  if (
    hasResolved &&
    podcastIdValid &&
    (episode === null || !isValidRouteId(episodeId))
  ) {
    return (
      <Navigate to={`/podcast/${normalizeRouteId(podcastId)}`} replace />
    )
  }

  if (!hasResolved || isLoading || podcast === null || episode === null) {
    return null
  }

  return (
    <DetailPageLayout
      pageTitle={`${episode.title} — ${podcast.title}`}
      sidebar={
        <PodcastSidebar
          podcastId={podcast.id}
          title={podcast.title}
          author={podcast.author}
          image={podcast.image}
        />
      }
    >
      <EpisodeContent episode={episode} />
    </DetailPageLayout>
  )
}
