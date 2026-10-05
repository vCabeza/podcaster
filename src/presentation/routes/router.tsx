import { Navigate, createBrowserRouter } from 'react-router-dom'
import type { RouteObject } from 'react-router-dom'
import { RootLayout } from '../layouts/RootLayout'
import { EpisodeDetailView } from '../views/EpisodeDetailView'
import { HomeView } from '../views/HomeView'
import { PodcastDetailView } from '../views/PodcastDetailView'

export const appRoutes: RouteObject[] = [
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
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]

export const router = createBrowserRouter(appRoutes)
