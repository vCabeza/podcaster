import './EpisodePlayer.css'

export interface EpisodePlayerProps {
  audioUrl: string
  title: string
}

export function EpisodePlayer({ audioUrl, title }: EpisodePlayerProps) {
  return (
    <div className="episode-player">
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
