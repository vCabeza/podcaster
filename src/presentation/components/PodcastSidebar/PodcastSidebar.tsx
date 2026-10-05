import { Link } from 'react-router-dom'
import { PODCAST_SIDEBAR_LANDMARK_LABEL } from '../../constants/a11y'
import { SurfaceCard } from '../SurfaceCard/SurfaceCard'
import './PodcastSidebar.css'

export interface PodcastSidebarProps {
  podcastId: string
  title: string
  author: string
  image: string
  description: string
}

export function PodcastSidebar({
  podcastId,
  title,
  author,
  image,
  description,
}: PodcastSidebarProps) {
  const detailPath = `/podcast/${podcastId}`
  const coverAltText = `${title} cover`
  const descriptionHeadingId = `podcast-description-${podcastId}`

  return (
    <aside className="podcast-sidebar" aria-label={PODCAST_SIDEBAR_LANDMARK_LABEL}>
      <SurfaceCard className="podcast-sidebar__card">
        <Link to={detailPath} className="podcast-sidebar__artwork-link">
          <img
            className="podcast-sidebar__artwork"
            src={image}
            alt={coverAltText}
            width={220}
            height={220}
          />
        </Link>

        <hr className="podcast-sidebar__divider" />

        <div className="podcast-sidebar__identity">
          <h2 className="podcast-sidebar__title">
            <Link to={detailPath} className="podcast-sidebar__title-link">
              {title}
            </Link>
          </h2>
          <p className="podcast-sidebar__author">
            <Link to={detailPath} className="podcast-sidebar__author-link">
              by {author}
            </Link>
          </p>
        </div>

        <hr className="podcast-sidebar__divider" />

        <section
          className="podcast-sidebar__description"
          aria-labelledby={descriptionHeadingId}
        >
          <h3
            id={descriptionHeadingId}
            className="podcast-sidebar__description-heading"
          >
            Description:
          </h3>
          <p className="podcast-sidebar__description-body">{description}</p>
        </section>
      </SurfaceCard>
    </aside>
  )
}
