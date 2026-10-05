import type { PodcastDetail } from '../../../domain/models/PodcastDetail'

export const podcastDetailFixture: PodcastDetail = {
  id: '360084272',
  title: 'The Joe Rogan Experience',
  author: 'Joe Rogan',
  image: 'https://example.com/jre.jpg',
  description: 'Long-form conversations with interesting people.',
  episodes: [
    {
      id: '1001',
      title: 'Episode One',
      description:
        '<p>First episode with a <a href="https://example.com">link</a> and <strong>emphasis</strong>.</p><script>alert("xss")</script>',
      releaseDate: '2016-03-01T10:00:00Z',
      duration: '01:02:05',
      audioUrl: 'https://example.com/1.mp3',
    },
    {
      id: '1002',
      title: 'Episode Two',
      description: 'Second episode',
      releaseDate: '2016-02-18T10:00:00Z',
      duration: '14:00',
      audioUrl: '',
    },
  ],
}
