export const e2eTopPodcastsFeed = {
  feed: {
    entry: [
      {
        id: {
          label:
            'https://podcasts.apple.com/us/podcast/the-joe-rogan-experience/id360084272',
          attributes: {
            'im:id': '360084272',
          },
        },
        'im:name': { label: 'The Joe Rogan Experience' },
        'im:image': [
          {
            label: 'https://example.com/image-170.jpg',
            attributes: { height: '170' },
          },
        ],
        'im:artist': { label: 'Joe Rogan' },
        summary: {
          label: 'The Joe Rogan Experience podcast conversations.',
        },
      },
      {
        id: {
          attributes: {
            'im:id': '1535809341',
          },
        },
        'im:name': { label: 'The Daily' },
        'im:image': [
          {
            label: 'https://example.com/daily-55.jpg',
            attributes: { height: '55' },
          },
        ],
        'im:artist': { label: 'The New York Times' },
      },
      {
        id: {
          attributes: {
            'im:id': '1327668444',
          },
        },
        'im:name': { label: 'Crime Junkie' },
        'im:image': [
          {
            label: 'https://example.com/crime-170.jpg',
            attributes: { height: '170' },
          },
        ],
        'im:artist': { label: 'audiochuck' },
      },
    ],
  },
}

export const e2eLookupByPodcastId: Record<
  string,
  {
    resultCount: number
    results: Array<Record<string, string | number | undefined>>
  }
> = {
  '360084272': {
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
  },
  '1535809341': {
    resultCount: 2,
    results: [
      {
        kind: 'podcast',
        collectionId: 1535809341,
        collectionName: 'The Daily',
        artistName: 'The New York Times',
        artworkUrl600: 'https://example.com/daily-600.jpg',
      },
      {
        kind: 'podcast-episode',
        collectionId: 1535809341,
        trackId: 2001,
        trackName: 'Daily episode one',
        description: 'News summary',
        releaseDate: '2024-06-01T08:00:00Z',
        trackTimeMillis: 1_200_000,
        episodeUrl: 'https://example.com/daily-1.mp3',
      },
    ],
  },
  '1327668444': {
    resultCount: 2,
    results: [
      {
        kind: 'podcast',
        collectionId: 1327668444,
        collectionName: 'Crime Junkie',
        artistName: 'audiochuck',
        artworkUrl600: 'https://example.com/crime-600.jpg',
      },
      {
        kind: 'podcast-episode',
        collectionId: 1327668444,
        trackId: 3001,
        trackName: 'MURDERED: Case File',
        description: 'True crime episode',
        releaseDate: '2024-04-10T12:00:00Z',
        trackTimeMillis: 2_400_000,
        episodeUrl: 'https://example.com/crime-1.mp3',
      },
    ],
  },
}

export const DEFAULT_E2E_PODCAST_ID = '360084272'
export const DEFAULT_E2E_EPISODE_ID = '1000600123456'
export const DEFAULT_E2E_PODCAST_TITLE = 'The Joe Rogan Experience'
export const DEFAULT_E2E_EPISODE_TITLE = 'Episode with audio'
