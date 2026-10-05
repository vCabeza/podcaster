import { Link } from 'react-router-dom'
import type { Podcast } from '../../../domain/models/Podcast'
import './PodcastCard.css'

export interface PodcastCardProps {
  podcast: Podcast
}

export function PodcastCard({ podcast }: PodcastCardProps) {
  return (
    <article className="podcast-card">
      <Link
        to={`/podcast/${podcast.id}`}
        className="podcast-card__link"
        aria-label={`${podcast.title}. Author: ${podcast.author}`}
      >
        <div className="podcast-card__avatar-wrap">
          <img
            className="podcast-card__avatar"
            src={podcast.image}
            alt=""
            width={120}
            height={120}
            loading="lazy"
          />
        </div>

        <div className="podcast-card__body">
          <h2 className="podcast-card__title">{podcast.title}</h2>
          <p className="podcast-card__author">Author: {podcast.author}</p>
        </div>
      </Link>
    </article>
  )
}
