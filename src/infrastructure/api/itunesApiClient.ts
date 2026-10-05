import {
  assertITunesFeedDTO,
  type ITunesFeedDTO,
} from '../dtos/itunesFeed.dto'
import {
  normalizeLookupPayload,
  type ITunesLookupResponseDTO,
} from '../dtos/itunesLookup.dto'

export const TOP_PODCASTS_URL =
  'https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json'

export type FetchFn = typeof fetch

export type LookupTransportMode = 'development' | 'production'

export interface PodcastApiClient {
  fetchTopPodcasts(): Promise<ITunesFeedDTO>
  fetchPodcastLookup(podcastId: string): Promise<ITunesLookupResponseDTO>
}

export function buildItunesLookupUrl(podcastId: string): string {
  return `https://itunes.apple.com/lookup?id=${encodeURIComponent(podcastId)}&media=podcast&entity=podcastEpisode&limit=20`
}

export function buildDevProxyLookupUrl(podcastId: string): string {
  return `/api/itunes/lookup?id=${encodeURIComponent(podcastId)}&media=podcast&entity=podcastEpisode&limit=20`
}

export function buildAllOriginsLookupUrl(podcastId: string): string {
  return `https://api.allorigins.win/get?url=${encodeURIComponent(buildItunesLookupUrl(podcastId))}`
}

export function buildCorsProxyLookupUrl(podcastId: string): string {
  return `https://corsproxy.io/?url=${encodeURIComponent(buildItunesLookupUrl(podcastId))}`
}

/** @deprecated Prefer mode-specific builders. Kept for production AllOrigins URL. */
export function buildPodcastLookupUrl(podcastId: string): string {
  return buildAllOriginsLookupUrl(podcastId)
}

function resolveDefaultLookupMode(): LookupTransportMode {
  return import.meta.env.DEV ? 'development' : 'production'
}

export class ITunesApiClient implements PodcastApiClient {
  constructor(
    private readonly fetchFn: FetchFn = fetch.bind(globalThis),
    private readonly lookupMode: LookupTransportMode = resolveDefaultLookupMode(),
  ) {}

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
    if (this.lookupMode === 'development') {
      return this.fetchLookupFromUrl(
        buildDevProxyLookupUrl(podcastId),
        podcastId,
      )
    }

    return this.fetchLookupWithProductionFallbacks(podcastId)
  }

  private async fetchLookupWithProductionFallbacks(
    podcastId: string,
  ): Promise<ITunesLookupResponseDTO> {
    const lookupUrls = [
      buildAllOriginsLookupUrl(podcastId),
      buildCorsProxyLookupUrl(podcastId),
    ]

    let lastError: Error | undefined

    for (const lookupUrl of lookupUrls) {
      try {
        return await this.fetchLookupFromUrl(lookupUrl, podcastId)
      } catch (error: unknown) {
        lastError =
          error instanceof Error
            ? error
            : new Error(
                `Failed to fetch podcast detail for id "${podcastId}"`,
              )
      }
    }

    throw (
      lastError ??
      new Error(`Failed to fetch podcast detail for id "${podcastId}"`)
    )
  }

  private async fetchLookupFromUrl(
    lookupUrl: string,
    podcastId: string,
  ): Promise<ITunesLookupResponseDTO> {
    let response: Response

    try {
      response = await this.fetchFn(lookupUrl)
    } catch {
      throw new Error(
        `Failed to fetch podcast detail for id "${podcastId}" (network error)`,
      )
    }

    if (!response.ok) {
      throw new Error(
        `Failed to fetch podcast detail for id "${podcastId}" (${response.status})`,
      )
    }

    const payload: unknown = await response.json()
    return normalizeLookupPayload(payload)
  }
}
