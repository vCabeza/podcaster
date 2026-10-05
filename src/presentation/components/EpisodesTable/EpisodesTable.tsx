import { Link } from 'react-router-dom'
import type { Episode } from '../../../domain/models/Episode'
import { formatDate, formatDuration } from '../../../application/utils/formatters'
import './EpisodesTable.css'

export interface EpisodesTableProps {
  podcastId: string
  episodes: Episode[]
}

export function EpisodesTable({ podcastId, episodes }: EpisodesTableProps) {
  return (
    <div className="episodes-table-card">
      <table className="episodes-table">
        <caption className="visually-hidden">Podcast episodes</caption>
        <thead>
          <tr>
            <th scope="col">Title</th>
            <th scope="col">Date</th>
            <th scope="col">Duration</th>
          </tr>
        </thead>
        <tbody>
          {episodes.map((episode) => (
            <tr key={episode.id}>
              <td>
                <Link
                  className="episodes-table__title-link"
                  to={`/podcast/${podcastId}/episode/${episode.id}`}
                >
                  {episode.title}
                </Link>
              </td>
              <td>{formatDate(episode.releaseDate)}</td>
              <td className="episodes-table__duration">
                {formatDuration(episode.duration)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
