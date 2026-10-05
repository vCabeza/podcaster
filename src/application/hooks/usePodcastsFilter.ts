import { useMemo, useState } from 'react'
import type { Podcast } from '../../domain/models/Podcast'
import { normalizeSearchText } from '../utils/normalizeSearchText'

export interface UsePodcastsFilterResult {
  query: string
  setQuery: (value: string) => void
  filteredPodcasts: Podcast[]
  visibleCount: number
}

export function usePodcastsFilter(
  podcasts: Podcast[],
): UsePodcastsFilterResult {
  const [query, setQuery] = useState('')

  const filteredPodcasts = useMemo(() => {
    const normalizedQuery = normalizeSearchText(query)

    if (normalizedQuery.length === 0) {
      return podcasts
    }

    return podcasts.filter((podcast) => {
      const matchesTitle = normalizeSearchText(podcast.title).includes(
        normalizedQuery,
      )
      const matchesAuthor = normalizeSearchText(podcast.author).includes(
        normalizedQuery,
      )

      return matchesTitle || matchesAuthor
    })
  }, [podcasts, query])

  return {
    query,
    setQuery,
    filteredPodcasts,
    visibleCount: filteredPodcasts.length,
  }
}
