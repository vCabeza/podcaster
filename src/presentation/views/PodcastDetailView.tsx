import { useParams } from 'react-router-dom'
import type { PodcastRepository } from '../../domain/repositories/PodcastRepository'
import { usePodcastDetail } from '../../application/hooks/usePodcastDetail'
import { DetailPageLayout } from '../components/DetailPageLayout/DetailPageLayout'
import { EpisodesTable } from '../components/EpisodesTable/EpisodesTable'
import { PodcastSidebar } from '../components/PodcastSidebar/PodcastSidebar'
import { SurfaceCard } from '../components/SurfaceCard/SurfaceCard'
import './PodcastDetailView.css'

export interface PodcastDetailViewProps {
  repository?: PodcastRepository
}

export function PodcastDetailView({ repository }: PodcastDetailViewProps) {
  const { podcastId } = useParams()
  const { podcast, isLoading, error } = usePodcastDetail(podcastId, repository)

  if (error !== null) {
    return (
      <p className="detail-page-layout__error" role="alert">
        {error}
      </p>
    )
  }

  if (isLoading || podcast === null) {
    return null
  }

  return (
    <DetailPageLayout
      pageTitle={podcast.title}
      sidebar={
        <PodcastSidebar
          podcastId={podcast.id}
          title={podcast.title}
          author={podcast.author}
          image={podcast.image}
        />
      }
    >
      <SurfaceCard
        className="podcast-detail-view__count-card"
        aria-live="polite"
      >
        Episodes: {podcast.episodes.length}
      </SurfaceCard>

      <EpisodesTable podcastId={podcast.id} episodes={podcast.episodes} />
    </DetailPageLayout>
  )
}
