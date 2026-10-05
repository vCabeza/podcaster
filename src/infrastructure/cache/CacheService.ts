import { isNumber, isRecord } from '../dtos/typeGuards'
import type { CacheStorage } from './CacheStorage'
import { LocalStorageCacheStorage } from './LocalStorageCacheStorage'

/** 24 hours in milliseconds. */
export const ONE_DAY_MS = 86_400_000

export const TOP_PODCASTS_CACHE_KEY = 'podcasts_top_100'

export function buildPodcastDetailCacheKey(podcastId: string): string {
  return `podcast_detail_${podcastId}`
}

export interface CacheEntry<T> {
  data: T
  timestamp: number
}

function isCacheEntry(value: unknown): value is CacheEntry<unknown> {
  return isRecord(value) && 'data' in value && isNumber(value.timestamp)
}

export class CacheService {
  constructor(
    private readonly storage: CacheStorage = new LocalStorageCacheStorage(),
  ) {}

  get<T>(key: string, ttlMs: number = ONE_DAY_MS): T | null {
    const rawValue = this.storage.getItem(key)

    if (rawValue === null) {
      return null
    }

    let parsed: unknown

    try {
      parsed = JSON.parse(rawValue)
    } catch {
      this.storage.removeItem(key)
      return null
    }

    if (!isCacheEntry(parsed)) {
      this.storage.removeItem(key)
      return null
    }

    const ageMs = Date.now() - parsed.timestamp

    if (ageMs >= ttlMs) {
      this.storage.removeItem(key)
      return null
    }

    return parsed.data as T
  }

  set<T>(key: string, data: T): void {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
    }

    try {
      this.storage.setItem(key, JSON.stringify(entry))
    } catch {
      // Storage adapters may rethrow; never break the request path.
    }
  }

  remove(key: string): void {
    this.storage.removeItem(key)
  }
}
