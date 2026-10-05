import type { CacheStorage } from './CacheStorage'

/**
 * localStorage-backed cache adapter with graceful degradation when storage
 * is unavailable or quota is exceeded.
 */
export class LocalStorageCacheStorage implements CacheStorage {
  getItem(key: string): string | null {
    try {
      return globalThis.localStorage.getItem(key)
    } catch {
      return null
    }
  }

  setItem(key: string, value: string): void {
    try {
      globalThis.localStorage.setItem(key, value)
    } catch {
      // QuotaExceededError / SecurityError / disabled storage
    }
  }

  removeItem(key: string): void {
    try {
      globalThis.localStorage.removeItem(key)
    } catch {
      // Ignore cleanup failures when storage is unavailable.
    }
  }
}
