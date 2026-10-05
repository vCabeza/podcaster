import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { usePodcastsFilter } from './usePodcastsFilter'
import { podcastFixtures } from './fixtures/podcasts.fixture'

describe('usePodcastsFilter', () => {
  it('returns the full list when the query is empty', () => {
    const { result } = renderHook(() => usePodcastsFilter(podcastFixtures))

    expect(result.current.filteredPodcasts).toHaveLength(3)
    expect(result.current.visibleCount).toBe(3)
  })

  it('filters by title in a case-insensitive way', () => {
    const { result } = renderHook(() => usePodcastsFilter(podcastFixtures))

    act(() => {
      result.current.setQuery('daily')
    })

    expect(result.current.filteredPodcasts).toEqual([podcastFixtures[1]])
    expect(result.current.visibleCount).toBe(1)
  })

  it('filters by author and ignores diacritics', () => {
    const { result } = renderHook(() => usePodcastsFilter(podcastFixtures))

    act(() => {
      result.current.setQuery('maria lopez')
    })

    expect(result.current.filteredPodcasts).toEqual([podcastFixtures[2]])
  })

  it('matches accented queries against normalized titles', () => {
    const { result } = renderHook(() => usePodcastsFilter(podcastFixtures))

    act(() => {
      result.current.setQuery('cafe')
    })

    expect(result.current.filteredPodcasts.map((podcast) => podcast.id)).toEqual([
      '999',
    ])
  })
})
