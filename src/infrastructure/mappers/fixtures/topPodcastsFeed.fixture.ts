import type { ITunesFeedDTO } from '../../dtos/itunesFeed.dto'

export const topPodcastsFeedFixture: ITunesFeedDTO = {
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
            label: 'https://example.com/image-55.jpg',
            attributes: { height: '55' },
          },
          {
            label: 'https://example.com/image-60.jpg',
            attributes: { height: '60' },
          },
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
    ],
  },
}

export const emptyTopPodcastsFeedFixture: ITunesFeedDTO = {
  feed: {},
}

export const singleEntryFeedFixture: ITunesFeedDTO = {
  feed: {
    entry: {
      id: {
        attributes: {
          'im:id': '111',
        },
      },
      'im:name': { label: 'Solo Podcast' },
      'im:artist': { label: 'Solo Author' },
      'im:image': [],
    },
  },
}
