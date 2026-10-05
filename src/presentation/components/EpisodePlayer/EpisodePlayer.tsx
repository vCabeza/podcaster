import './EpisodePlayer.css'

export interface EpisodePlayerProps {
  audioUrl: string
  title: string
}

export function EpisodePlayer({ audioUrl, title }: EpisodePlayerProps) {
  return (
    <div className="episode-player">
      {/* Native podcast playback has no caption track available from the API. */}
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio
        className="episode-player__audio"
        controls
        preload="metadata"
        src={audioUrl}
        aria-label={`Audio player for ${title}`}
      >
        Your browser does not support the audio element.
      </audio>
    </div>
  )
}
