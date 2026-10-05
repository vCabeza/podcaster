import { useParams } from 'react-router-dom'

export function PodcastDetailView() {
  const { podcastId } = useParams()

  return (
    <section
      className="placeholder-view"
      aria-labelledby="podcast-detail-heading"
    >
      <h1 id="podcast-detail-heading">Podcast detail</h1>
      <p>Details for podcast {podcastId} will appear here.</p>
    </section>
  )
}
