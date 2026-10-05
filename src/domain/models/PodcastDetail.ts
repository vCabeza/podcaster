import type { Episode } from './Episode'
import type { Podcast } from './Podcast'

export interface PodcastDetail extends Podcast {
  episodes: Episode[]
}
