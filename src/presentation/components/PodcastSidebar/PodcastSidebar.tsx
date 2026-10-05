import { Link, useLocation } from 'react-router-dom'
import { PODCAST_SIDEBAR_LANDMARK_LABEL } from '../../constants/a11y'
import { SurfaceCard } from '../SurfaceCard/SurfaceCard'
import './PodcastSidebar.css'

export interface PodcastSidebarProps {
  podcastId: string
  title: string
  author: string
  image: string
}

export function PodcastSidebar({
  podcastId,
  title,
  author,
  image,
}: PodcastSidebarProps) {
  const location = useLocation()
  const detailPath = `/podcast/${podcastId}`
  const isLinkActive = location.pathname !== detailPath
  const coverAltText = `${title} cover`

  const content = (
    <>
      <div className="podcast-sidebar__artwork-frame">
        <img
          className="podcast-sidebar__artwork"
          src={image}
          alt={coverAltText}
          width={220}
          height={220}
        />
      </div>

      <hr className="podcast-sidebar__divider" />

      <div className="podcast-sidebar__identity">
        <h2 className="podcast-sidebar__title">{title}</h2>
        <p className="podcast-sidebar__author">by {author}</p>
      </div>
    </>
  )

  return (
    <aside className="podcast-sidebar" aria-label={PODCAST_SIDEBAR_LANDMARK_LABEL}>
      <SurfaceCard className="podcast-sidebar__card">
        {isLinkActive ? (
          <Link
            to={detailPath}
            className="podcast-sidebar__full-link"
            aria-label={`Back to ${title} details`}
          >
            {content}
          </Link>
        ) : (
          <div className="podcast-sidebar__content-static">{content}</div>
        )}
      </SurfaceCard>
    </aside>
  )
}
