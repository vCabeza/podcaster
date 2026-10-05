import type { Podcast } from '../../../domain/models/Podcast'

export const podcastFixtures: Podcast[] = [
  {
    id: '360084272',
    title: 'The Joe Rogan Experience',
    author: 'Joe Rogan',
    image: 'https://example.com/jre.jpg',
    description: 'Conversations',
  },
  {
    id: '1535809341',
    title: 'The Daily',
    author: 'The New York Times',
    image: 'https://example.com/daily.jpg',
    description: 'News',
  },
  {
    id: '999',
    title: 'Café con José',
    author: 'María López',
    image: 'https://example.com/cafe.jpg',
    description: 'Spanish talk',
  },
]
