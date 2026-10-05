import { useParams } from 'react-router-dom'
import type { PodcastRepository } from '../../domain/repositories/PodcastRepository'
import { useEpisodeDetail } from '../../application/hooks/useEpisodeDetail'
import { EpisodeContent } from '../components/EpisodeContent/EpisodeContent'
import { PodcastSidebar } from '../components/PodcastSidebar/PodcastSidebar'
import './EpisodeDetailView.css'

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
      <p className="episode-detail-view__error" role="alert">
        {error}
      </p>
    )
  }

  if (isLoading || podcast === null || episode === null) {
    return null
  }

  return (
    <div className="episode-detail-view">
      <h1 className="visually-hidden">
        {episode.title} — {podcast.title}
      </h1>

      <PodcastSidebar
        podcastId={podcast.id}
        title={podcast.title}
        author={podcast.author}
        image={podcast.image}
        description={podcast.description}
      />

      <div className="episode-detail-view__content">
        <EpisodeContent episode={episode} />
      </div>
    </div>
  )
}
