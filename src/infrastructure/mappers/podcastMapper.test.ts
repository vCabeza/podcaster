import { describe, expect, it } from 'vitest'
import {
  formatDuration,
  mapITunesFeedToPodcasts,
  mapITunesLookupToPodcastDetail,
} from './podcastMapper'
import {
  podcastLookupInvalidJsonFixture,
  podcastLookupResponseFixture,
  podcastLookupShortDurationFixture,
  podcastLookupWithoutPodcastFixture,
} from './fixtures/podcastLookup.fixture'
import {
  emptyTopPodcastsFeedFixture,
  singleEntryFeedFixture,
  topPodcastsFeedFixture,
} from './fixtures/topPodcastsFeed.fixture'

describe('formatDuration', () => {
  it('formats durations longer than one hour as HH:MM:SS', () => {
    expect(formatDuration(3_725_000)).toBe('01:02:05')
  })

  it('formats durations under one hour as MM:SS', () => {
    expect(formatDuration(95_000)).toBe('01:35')
  })

  it('returns an empty string for missing or invalid values', () => {
    expect(formatDuration(undefined)).toBe('')
    expect(formatDuration(Number.NaN)).toBe('')
    expect(formatDuration(-10)).toBe('')
  })
})

describe('mapITunesFeedToPodcasts', () => {
  it('maps feed entries to podcast entities using the largest image', () => {
    const podcasts = mapITunesFeedToPodcasts(topPodcastsFeedFixture)

    expect(podcasts).toHaveLength(2)
    expect(podcasts[0]).toEqual({
      id: '360084272',
      title: 'The Joe Rogan Experience',
      author: 'Joe Rogan',
      image: 'https://example.com/image-170.jpg',
    })
    expect(podcasts[1]).toEqual({
      id: '1535809341',
      title: 'The Daily',
      author: 'The New York Times',
      image: 'https://example.com/daily-55.jpg',
    })
  })

  it('returns an empty list when the feed has no entries', () => {
    expect(mapITunesFeedToPodcasts(emptyTopPodcastsFeedFixture)).toEqual([])
  })

  it('normalizes a single entry object into a one-item list', () => {
    const podcasts = mapITunesFeedToPodcasts(singleEntryFeedFixture)

    expect(podcasts).toEqual([
      {
        id: '111',
        title: 'Solo Podcast',
        author: 'Solo Author',
        image: '',
      },
    ])
  })

  it('defaults missing labels to empty strings', () => {
    const podcasts = mapITunesFeedToPodcasts({
      feed: {
        entry: {
          id: {
            attributes: {
              'im:id': '9',
            },
          },
        },
      },
    })

    expect(podcasts).toEqual([
      {
        id: '9',
        title: '',
        author: '',
        image: '',
      },
    ])
  })
})

describe('mapITunesLookupToPodcastDetail', () => {
  it('maps podcast metadata and episodes from an AllOrigins payload', () => {
    const detail = mapITunesLookupToPodcastDetail(podcastLookupResponseFixture)

    expect(detail).toEqual({
      id: '360084272',
      title: 'The Joe Rogan Experience',
      author: 'Joe Rogan',
      image: 'https://example.com/jre-600.jpg',
      episodes: [
        {
          id: '1000600123456',
          title: 'Episode with audio',
          description: 'A complete episode',
          releaseDate: '2024-05-01T10:00:00Z',
          duration: '01:02:05',
          audioUrl: 'https://example.com/audio-1.mp3',
        },
        {
          id: '1000600123457',
          title: 'Episode without audio',
          description: '',
          releaseDate: '2024-05-02T10:00:00Z',
          duration: '01:35',
          audioUrl: '',
        },
      ],
    })
  })

  it('falls back to previewUrl and short MM:SS durations', () => {
    const detail = mapITunesLookupToPodcastDetail(
      podcastLookupShortDurationFixture,
    )

    expect(detail.image).toBe('')
    expect(detail.episodes).toEqual([
      {
        id: '7',
        title: 'Short episode',
        description: '',
        releaseDate: '',
        duration: '00:45',
        audioUrl: 'https://example.com/preview.mp3',
      },
    ])
  })

  it('falls back to artworkUrl100 when artworkUrl600 is missing', () => {
    const detail = mapITunesLookupToPodcastDetail({
      contents: JSON.stringify({
        resultCount: 1,
        results: [
          {
            kind: 'podcast',
            collectionId: 8,
            collectionName: 'Only 100',
            artistName: 'Host',
            artworkUrl100: 'https://example.com/only-100.jpg',
          },
        ],
      }),
    })

    expect(detail.image).toBe('https://example.com/only-100.jpg')
    expect(detail.episodes).toEqual([])
  })

  it('throws when podcast metadata is missing', () => {
    expect(() =>
      mapITunesLookupToPodcastDetail(podcastLookupWithoutPodcastFixture),
    ).toThrow('Podcast metadata not found in iTunes lookup response')
  })

  it('throws when contents is not valid JSON', () => {
    expect(() =>
      mapITunesLookupToPodcastDetail(podcastLookupInvalidJsonFixture),
    ).toThrow('Invalid JSON payload inside AllOrigins contents')
  })
})
