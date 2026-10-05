import type { ITunesLookupResponseDTO } from '../../dtos/itunesLookup.dto'

const lookupPayload = {
  resultCount: 3,
  results: [
    {
      wrapperType: 'track',
      kind: 'podcast',
      collectionId: 360084272,
      collectionName: 'The Joe Rogan Experience',
      artistName: 'Joe Rogan',
      artworkUrl600: 'https://example.com/jre-600.jpg',
      artworkUrl100: 'https://example.com/jre-100.jpg',
      trackId: 360084272,
      trackName: 'The Joe Rogan Experience',
    },
    {
      wrapperType: 'podcastEpisode',
      kind: 'podcast-episode',
      collectionId: 360084272,
      trackId: 1000600123456,
      trackName: 'Episode with audio',
      description: 'A complete episode',
      releaseDate: '2024-05-01T10:00:00Z',
      trackTimeMillis: 3_725_000,
      episodeUrl: 'https://example.com/audio-1.mp3',
    },
    {
      wrapperType: 'podcastEpisode',
      kind: 'podcast-episode',
      collectionId: 360084272,
      trackId: 1000600123457,
      trackName: 'Episode without audio',
      description: '',
      releaseDate: '2024-05-02T10:00:00Z',
      trackTimeMillis: 95_000,
    },
  ],
}

export const podcastLookupResponseFixture: ITunesLookupResponseDTO = {
  contents: JSON.stringify(lookupPayload),
  status: {
    http_code: 200,
    content_type: 'application/json',
  },
}

export const podcastLookupWithoutPodcastFixture: ITunesLookupResponseDTO = {
  contents: JSON.stringify({
    resultCount: 1,
    results: [
      {
        wrapperType: 'podcastEpisode',
        kind: 'podcast-episode',
        trackId: 1,
        trackName: 'Orphan episode',
      },
    ],
  }),
}

export const podcastLookupInvalidJsonFixture: ITunesLookupResponseDTO = {
  contents: '{not-json',
}

export const podcastLookupShortDurationFixture: ITunesLookupResponseDTO = {
  contents: JSON.stringify({
    resultCount: 2,
    results: [
      {
        kind: 'podcast',
        collectionId: 42,
        collectionName: 'Short Show',
        artistName: 'Host',
      },
      {
        kind: 'podcast-episode',
        trackId: 7,
        trackName: 'Short episode',
        trackTimeMillis: 45_000,
        previewUrl: 'https://example.com/preview.mp3',
      },
    ],
  }),
}
