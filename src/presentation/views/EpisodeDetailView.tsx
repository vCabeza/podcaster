import { useParams } from 'react-router-dom'
import type { PodcastRepository } from '../../domain/repositories/PodcastRepository'
import { useEpisodeDetail } from '../../application/hooks/useEpisodeDetail'
import { DetailPageLayout } from '../components/DetailPageLayout/DetailPageLayout'
import { EpisodeContent } from '../components/EpisodeContent/EpisodeContent'
import { PodcastSidebar } from '../components/PodcastSidebar/PodcastSidebar'

export interface EpisodeDetailViewProps {
  repository?: PodcastRepository
}

export function EpisodeDetailView({ repository }: EpisodeDetailViewProps) {
  const { podcastId, episodeId } = useParams()
  const { podcast, episode, isLoading, error } = useEpisodeDetail(
    podcastId,
    episodeId,
    repository,
  )

  if (error !== null) {
    return (
      <p className="detail-page-layout__error" role="alert">
        {error}
      </p>
    )
  }

  if (isLoading || podcast === null || episode === null) {
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
          description={podcast.description}
        />
      }
    >
      <EpisodeContent episode={episode} />
    </DetailPageLayout>
  )
}
