import type { Podcast } from '../models/Podcast'
import type { PodcastDetail } from '../models/PodcastDetail'

export interface PodcastRepository {
  getTopPodcasts(): Promise<Podcast[]>
  getPodcastDetail(podcastId: string): Promise<PodcastDetail>
}
