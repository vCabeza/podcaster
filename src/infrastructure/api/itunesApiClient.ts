import {
  assertITunesFeedDTO,
  type ITunesFeedDTO,
} from '../dtos/itunesFeed.dto'
import {
  assertITunesLookupResponseDTO,
  type ITunesLookupResponseDTO,
} from '../dtos/itunesLookup.dto'

export const TOP_PODCASTS_URL =
  'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json'

export type FetchFn = typeof fetch

export interface PodcastApiClient {
  fetchTopPodcasts(): Promise<ITunesFeedDTO>
  fetchPodcastLookup(podcastId: string): Promise<ITunesLookupResponseDTO>
}

export function buildPodcastLookupUrl(podcastId: string): string {
  const itunesLookupUrl = `https://itunes.apple.com/lookup?id=${encodeURIComponent(podcastId)}&media=podcast&entity=podcastEpisode&limit=20`
  return `https://api.allorigins.win/get?url=${encodeURIComponent(itunesLookupUrl)}`
}

export class ITunesApiClient implements PodcastApiClient {
  constructor(private readonly fetchFn: FetchFn = fetch.bind(globalThis)) {}

  async fetchTopPodcasts(): Promise<ITunesFeedDTO> {
    const response = await this.fetchFn(TOP_PODCASTS_URL)

    if (!response.ok) {
      throw new Error(`Failed to fetch top podcasts (${response.status})`)
    }

    const payload: unknown = await response.json()
    return assertITunesFeedDTO(payload)
  }

  async fetchPodcastLookup(
    podcastId: string,
  ): Promise<ITunesLookupResponseDTO> {
    const response = await this.fetchFn(buildPodcastLookupUrl(podcastId))

    if (!response.ok) {
      throw new Error(
        `Failed to fetch podcast detail for id "${podcastId}" (${response.status})`,
      )
    }

    const payload: unknown = await response.json()
    return assertITunesLookupResponseDTO(payload)
  }
}
