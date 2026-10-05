import type { Podcast } from '../../domain/models/Podcast'
import type { PodcastDetail } from '../../domain/models/PodcastDetail'
import type { PodcastRepository } from '../../domain/repositories/PodcastRepository'
import {
  ITunesApiClient,
  type PodcastApiClient,
} from '../api/itunesApiClient'
import {
  buildPodcastDetailCacheKey,
  CacheService,
  TOP_PODCASTS_CACHE_KEY,
} from '../cache/CacheService'
import {
  mapITunesFeedToPodcasts,
  mapITunesLookupToPodcastDetail,
} from '../mappers/podcastMapper'

export class ApiPodcastRepository implements PodcastRepository {
  constructor(
    private readonly client: PodcastApiClient = new ITunesApiClient(),
    private readonly cache: CacheService = new CacheService(),
  ) {}

  async getTopPodcasts(): Promise<Podcast[]> {
    const cachedPodcasts = this.cache.get<Podcast[]>(TOP_PODCASTS_CACHE_KEY)

    if (cachedPodcasts !== null) {
      return cachedPodcasts
    }

    const feed = await this.client.fetchTopPodcasts()
    const podcasts = mapITunesFeedToPodcasts(feed)
    this.cache.set(TOP_PODCASTS_CACHE_KEY, podcasts)
    return podcasts
  }

  async getPodcastDetail(podcastId: string): Promise<PodcastDetail> {
    const cacheKey = buildPodcastDetailCacheKey(podcastId)
    const cachedDetail = this.cache.get<PodcastDetail>(cacheKey)

    if (cachedDetail !== null) {
      return cachedDetail
    }

    const lookupResponse = await this.client.fetchPodcastLookup(podcastId)
    const podcastDetail = mapITunesLookupToPodcastDetail(lookupResponse)
    this.cache.set(cacheKey, podcastDetail)
    return podcastDetail
  }
}
