import { useParams } from 'react-router-dom'
import type { PodcastRepository } from '../../domain/repositories/PodcastRepository'
import { usePodcastDetail } from '../../application/hooks/usePodcastDetail'
import { EpisodesTable } from '../components/EpisodesTable/EpisodesTable'
import { PodcastSidebar } from '../components/PodcastSidebar/PodcastSidebar'
import './PodcastDetailView.css'

export interface PodcastDetailViewProps {
  repository?: PodcastRepository
}

export function PodcastDetailView({ repository }: PodcastDetailViewProps) {
  const { podcastId } = useParams()
  const { podcast, isLoading, error } = usePodcastDetail(podcastId, repository)

  if (error !== null) {
    return (
      <p className="podcast-detail-view__error" role="alert">
        {error}
      </p>
    )
  }

  if (isLoading || podcast === null) {
    return null
  }

  return (
    <div className="podcast-detail-view">
      <h1 className="visually-hidden">{podcast.title}</h1>

      <PodcastSidebar
        podcastId={podcast.id}
        title={podcast.title}
        author={podcast.author}
        image={podcast.image}
        description={podcast.description}
      />

      <div className="podcast-detail-view__content">
        <div
          className="podcast-detail-view__count-card"
          aria-live="polite"
        >
          Episodes: {podcast.episodes.length}
        </div>

        <EpisodesTable podcastId={podcast.id} episodes={podcast.episodes} />
      </div>
    </div>
  )
}
