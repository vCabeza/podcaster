import type { Podcast } from '../../../domain/models/Podcast'
import { PodcastCard } from '../PodcastCard/PodcastCard'
import './PodcastGrid.css'

export interface PodcastGridProps {
  podcasts: Podcast[]
}

export function PodcastGrid({ podcasts }: PodcastGridProps) {
  if (podcasts.length === 0) {
    return (
      <p className="podcast-grid__empty" role="status">
        No podcasts found
      </p>
    )
  }

  return (
    <ul className="podcast-grid">
      {podcasts.map((podcast) => (
        <li key={podcast.id} className="podcast-grid__item">
          <PodcastCard podcast={podcast} />
        </li>
      ))}
    </ul>
  )
}
