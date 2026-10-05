import { createBrowserRouter } from 'react-router-dom'
import { RootLayout } from '../layouts/RootLayout'
import { EpisodeDetailView } from '../views/EpisodeDetailView'
import { HomeView } from '../views/HomeView'
import { PodcastDetailView } from '../views/PodcastDetailView'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomeView />,
      },
      {
        path: 'podcast/:podcastId',
        element: <PodcastDetailView />,
      },
      {
        path: 'podcast/:podcastId/episode/:episodeId',
        element: <EpisodeDetailView />,
      },
    ],
  },
])
