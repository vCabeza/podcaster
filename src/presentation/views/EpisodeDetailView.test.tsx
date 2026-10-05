import { render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LoadingProvider } from '../../application/context/LoadingContext'
import type { PodcastRepository } from '../../domain/repositories/PodcastRepository'
import { RootLayout } from '../layouts/RootLayout'
import { HomeView } from './HomeView'
import { podcastDetailFixture } from './fixtures/podcastDetail.fixture'
import { EpisodeDetailView } from './EpisodeDetailView'
import { PodcastDetailView } from './PodcastDetailView'

function renderEpisodeDetail(
  repository: PodcastRepository,
  options?: {
    path?: string
    initialEntries?: string[]
  },
) {
  const path = options?.path ?? '/podcast/360084272/episode/1001'
  const initialEntries = options?.initialEntries ?? [path]

  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <RootLayout />,
        children: [
          {
            index: true,
            element: <HomeView repository={repository} />,
          },
          {
            path: 'podcast/:podcastId',
            element: <PodcastDetailView repository={repository} />,
          },
          {
            path: 'podcast/:podcastId/episode/:episodeId',
            element: <EpisodeDetailView repository={repository} />,
          },
        ],
      },
    ],
    {
      initialEntries,
      initialIndex: initialEntries.length - 1,
    },
  )

  function Wrapper({ children }: { children: ReactNode }) {
    return <LoadingProvider>{children}</LoadingProvider>
  }

  return render(<RouterProvider router={router} />, { wrapper: Wrapper })
}

describe('EpisodeDetailView', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders sidebar links, sanitized description and audio source', async () => {
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn().mockResolvedValue([]),
      getPodcastDetail: vi.fn().mockResolvedValue(podcastDetailFixture),
    }

    const { container } = renderEpisodeDetail(repository)

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: 'Episode One' }),
      ).toBeInTheDocument()
    })

    expect(repository.getPodcastDetail).toHaveBeenCalledWith('360084272')
    expect(
      screen.getByRole('complementary', { name: 'Podcast details' }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('link', {
        name: `Back to ${podcastDetailFixture.title} details`,
      }),
    ).toHaveAttribute('href', '/podcast/360084272')

    expect(screen.getByRole('link', { name: 'link' })).toHaveAttribute(
      'href',
      'https://example.com',
    )
    expect(container.innerHTML).not.toContain('<script')
    expect(container.querySelector('audio')).toHaveAttribute(
      'src',
      'https://example.com/1.mp3',
    )
  })

  it('redirects to home when podcastId is invalid', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn().mockResolvedValue([]),
      getPodcastDetail: vi.fn(),
    }

    renderEpisodeDetail(repository, {
      path: '/podcast/not-valid/episode/1001',
    })

    await waitFor(() => {
      expect(screen.getByRole('searchbox')).toBeInTheDocument()
    })

    expect(repository.getPodcastDetail).not.toHaveBeenCalled()
    expect(consoleError).toHaveBeenCalled()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('redirects to the podcast detail when episodeId is malformed', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn().mockResolvedValue([]),
      getPodcastDetail: vi.fn().mockResolvedValue(podcastDetailFixture),
    }

    renderEpisodeDetail(repository, {
      path: '/podcast/360084272/episode/invalid',
    })

    await waitFor(() => {
      expect(screen.getByText('Episodes: 2')).toBeInTheDocument()
    })

    expect(consoleError).toHaveBeenCalled()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(
      screen.queryByRole('heading', { name: 'Episode One' }),
    ).not.toBeInTheDocument()
  })

  it('logs unknown episodes and redirects to the podcast detail', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn().mockResolvedValue([]),
      getPodcastDetail: vi.fn().mockResolvedValue(podcastDetailFixture),
    }

    renderEpisodeDetail(repository, {
      path: '/podcast/360084272/episode/999999',
    })

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalled()
    })

    const logged = consoleError.mock.calls.find(
      (call) => call[0] instanceof Error && call[0].message === 'Episode not found',
    )
    expect(logged?.[0]).toMatchObject({ message: 'Episode not found' })
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('Episodes: 2')).toBeInTheDocument()
    })
  })

  it('redirects to the podcast detail when episodeId is whitespace-only', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn().mockResolvedValue([]),
      getPodcastDetail: vi.fn().mockResolvedValue(podcastDetailFixture),
    }

    renderEpisodeDetail(repository, {
      path: '/podcast/360084272/episode/%20',
    })

    await waitFor(() => {
      expect(screen.getByText('Episodes: 2')).toBeInTheDocument()
    })

    expect(consoleError).toHaveBeenCalled()
  })
})
