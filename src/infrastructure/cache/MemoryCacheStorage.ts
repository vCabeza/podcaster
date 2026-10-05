import type { CacheStorage } from './CacheStorage'

/** In-memory CacheStorage for deterministic unit and repository tests. */
export class MemoryCacheStorage implements CacheStorage {
  private readonly store = new Map<string, string>()

  getItem(key: string): string | null {
    return this.store.get(key) ?? null
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value)
  }

  removeItem(key: string): void {
    this.store.delete(key)
  }
}
