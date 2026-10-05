import { useParams } from 'react-router-dom'

export function EpisodeDetailView() {
  const { podcastId, episodeId } = useParams()

  return (
    <section
      className="placeholder-view"
      aria-labelledby="episode-detail-heading"
    >
      <h1 id="episode-detail-heading">Episode detail</h1>
      <p>
        Details for episode {episodeId} from podcast {podcastId} will appear
        here.
      </p>
    </section>
  )
}
