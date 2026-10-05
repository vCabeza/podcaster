import type { Episode } from '../../../domain/models/Episode'
import { sanitizeHtml } from '../../../application/utils/sanitizeHtml'
import { EpisodePlayer } from '../EpisodePlayer/EpisodePlayer'
import './EpisodeContent.css'

export interface EpisodeContentProps {
  episode: Episode
}

export function EpisodeContent({ episode }: EpisodeContentProps) {
  const sanitizedDescription = sanitizeHtml(episode.description)

  return (
    <article className="episode-content" aria-labelledby="episode-title">
      <h2 id="episode-title" className="episode-content__title">
        {episode.title}
      </h2>

      <div
        className="episode-content__description"
        dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
      />

      <hr className="episode-content__separator" />

      <EpisodePlayer audioUrl={episode.audioUrl} title={episode.title} />
    </article>
  )
}
