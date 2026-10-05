import type { Podcast } from '../../domain/models/Podcast'
import type { PodcastDetail } from '../../domain/models/PodcastDetail'
import type { PodcastRepository } from '../../domain/repositories/PodcastRepository'
import {
  ITunesApiClient,
  type PodcastApiClient,
} from '../api/itunesApiClient'
import {
  mapITunesFeedToPodcasts,
  mapITunesLookupToPodcastDetail,
} from '../mappers/podcastMapper'

export class ApiPodcastRepository implements PodcastRepository {
  constructor(
    private readonly client: PodcastApiClient = new ITunesApiClient(),
  ) {}

  async getTopPodcasts(): Promise<Podcast[]> {
    const feed = await this.client.fetchTopPodcasts()
    return mapITunesFeedToPodcasts(feed)
  }

  async getPodcastDetail(podcastId: string): Promise<PodcastDetail> {
    const lookupResponse = await this.client.fetchPodcastLookup(podcastId)
    return mapITunesLookupToPodcastDetail(lookupResponse)
  }
}
