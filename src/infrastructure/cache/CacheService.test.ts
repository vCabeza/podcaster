import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  CacheService,
  ONE_DAY_MS,
  type CacheEntry,
} from './CacheService'
import type { CacheStorage } from './CacheStorage'
import { LocalStorageCacheStorage } from './LocalStorageCacheStorage'
import { MemoryCacheStorage } from './MemoryCacheStorage'

describe('CacheService', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T00:00:00.000Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns cached data while it remains within the 24-hour window', () => {
    const storage = new MemoryCacheStorage()
    const cache = new CacheService(storage)

    cache.set('podcasts_top_100', [{ id: '1', title: 'Show' }])

    vi.setSystemTime(new Date('2024-01-01T23:59:59.999Z'))

    expect(cache.get<Array<{ id: string; title: string }>>('podcasts_top_100')).toEqual([
      { id: '1', title: 'Show' },
    ])
  })

  it('returns null once the entry is older than 24 hours by 1ms', () => {
    const storage = new MemoryCacheStorage()
    const cache = new CacheService(storage)

    cache.set('podcasts_top_100', ['fresh'])

    vi.setSystemTime(new Date(Date.now() + ONE_DAY_MS + 1))

    expect(cache.get<string[]>('podcasts_top_100')).toBeNull()
    expect(storage.getItem('podcasts_top_100')).toBeNull()
  })

  it('returns null for malformed JSON without throwing', () => {
    const storage = new MemoryCacheStorage()
    storage.setItem('broken', '{not-json')
    const cache = new CacheService(storage)

    expect(cache.get<unknown>('broken')).toBeNull()
    expect(storage.getItem('broken')).toBeNull()
  })

  it('returns null for malformed cache entry payloads', () => {
    const storage = new MemoryCacheStorage()
    storage.setItem('broken-shape', JSON.stringify({ value: 1 }))
    const cache = new CacheService(storage)

    expect(cache.get<unknown>('broken-shape')).toBeNull()
  })

  it('handles storage write failures gracefully', () => {
    const storage: CacheStorage = {
      getItem: vi.fn(() => null),
      setItem: vi.fn(() => {
        throw new DOMException('The quota has been exceeded.', 'QuotaExceededError')
      }),
      removeItem: vi.fn(),
    }
    const cache = new CacheService(storage)

    expect(() => cache.set('podcasts_top_100', { ok: true })).not.toThrow()
  })

  it('removes entries explicitly', () => {
    const storage = new MemoryCacheStorage()
    const cache = new CacheService(storage)

    cache.set('podcast_detail_1', { id: '1' })
    cache.remove('podcast_detail_1')

    expect(cache.get<{ id: string }>('podcast_detail_1')).toBeNull()
  })

  it('supports custom TTL overrides', () => {
    const storage = new MemoryCacheStorage()
    const cache = new CacheService(storage)
    const entry: CacheEntry<string> = {
      data: 'short-lived',
      timestamp: Date.now(),
    }

    storage.setItem('short', JSON.stringify(entry))
    vi.setSystemTime(new Date(Date.now() + 1_000))

    expect(cache.get<string>('short', 500)).toBeNull()
  })
})

describe('LocalStorageCacheStorage', () => {
  it('reads and writes values through localStorage', () => {
    const storage = new LocalStorageCacheStorage()

    storage.setItem('k', 'v')
    expect(storage.getItem('k')).toBe('v')

    storage.removeItem('k')
    expect(storage.getItem('k')).toBeNull()
  })

  it('swallows QuotaExceededError on write', () => {
    const storage = new LocalStorageCacheStorage()
    const setItemSpy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new DOMException('The quota has been exceeded.', 'QuotaExceededError')
      })

    expect(() => storage.setItem('k', 'v')).not.toThrow()
    setItemSpy.mockRestore()
  })

  it('returns null when localStorage getItem throws', () => {
    const storage = new LocalStorageCacheStorage()
    const getItemSpy = vi
      .spyOn(Storage.prototype, 'getItem')
      .mockImplementation(() => {
        throw new Error('disabled')
      })

    expect(storage.getItem('k')).toBeNull()
    getItemSpy.mockRestore()
  })

  it('swallows removeItem failures', () => {
    const storage = new LocalStorageCacheStorage()
    const removeItemSpy = vi
      .spyOn(Storage.prototype, 'removeItem')
      .mockImplementation(() => {
        throw new Error('disabled')
      })

    expect(() => storage.removeItem('k')).not.toThrow()
    removeItemSpy.mockRestore()
  })
})
