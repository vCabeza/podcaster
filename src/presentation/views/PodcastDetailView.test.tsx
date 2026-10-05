import { render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { LoadingProvider } from '../../application/context/LoadingContext'
import type { PodcastRepository } from '../../domain/repositories/PodcastRepository'
import { RootLayout } from '../layouts/RootLayout'
import { HomeView } from './HomeView'
import { podcastDetailFixture } from './fixtures/podcastDetail.fixture'
import { PodcastDetailView } from './PodcastDetailView'

function renderPodcastDetail(
  repository: PodcastRepository,
  options?: {
    initialEntries?: string[]
  },
) {
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
        ],
      },
    ],
    {
      initialEntries: options?.initialEntries ?? ['/podcast/360084272'],
    },
  )

  function Wrapper({ children }: { children: ReactNode }) {
    return <LoadingProvider>{children}</LoadingProvider>
  }

  return render(<RouterProvider router={router} />, { wrapper: Wrapper })
}

describe('PodcastDetailView', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('loads podcast detail and renders sidebar, count and episode rows', async () => {
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn().mockResolvedValue([]),
      getPodcastDetail: vi.fn().mockResolvedValue(podcastDetailFixture),
    }

    renderPodcastDetail(repository)

    await waitFor(() => {
      expect(screen.getByText('Episodes: 2')).toBeInTheDocument()
    })

    expect(repository.getPodcastDetail).toHaveBeenCalledWith('360084272')
    expect(
      screen.getByRole('complementary', { name: 'Podcast details' }),
    ).toBeInTheDocument()
    expect(
      screen.getAllByRole('heading', { name: podcastDetailFixture.title }).length,
    ).toBeGreaterThan(0)
    expect(
      screen.queryByRole('link', {
        name: `Back to ${podcastDetailFixture.title} details`,
      }),
    ).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Episode One' })).toHaveAttribute(
      'href',
      '/podcast/360084272/episode/1001',
    )
    expect(screen.getByRole('link', { name: 'Episode Two' })).toBeInTheDocument()
  })

  it('logs failures, does not show an alert, and redirects to home', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const failure = new Error('Detail unavailable')
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn().mockResolvedValue([]),
      getPodcastDetail: vi.fn().mockRejectedValue(failure),
    }

    renderPodcastDetail(repository)

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(failure)
    })

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByRole('searchbox')).toBeInTheDocument()
    })
  })

  it('redirects to home for malformed podcast ids', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn().mockResolvedValue([]),
      getPodcastDetail: vi.fn(),
    }

    renderPodcastDetail(repository, {
      initialEntries: ['/podcast/not-a-number'],
    })

    await waitFor(() => {
      expect(screen.getByRole('searchbox')).toBeInTheDocument()
    })

    expect(repository.getPodcastDetail).not.toHaveBeenCalled()
    expect(consoleError).toHaveBeenCalled()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('redirects to home for whitespace-only podcast ids', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn().mockResolvedValue([]),
      getPodcastDetail: vi.fn(),
    }

    renderPodcastDetail(repository, {
      initialEntries: ['/podcast/%20'],
    })

    await waitFor(() => {
      expect(screen.getByRole('searchbox')).toBeInTheDocument()
    })

    expect(repository.getPodcastDetail).not.toHaveBeenCalled()
    expect(consoleError).toHaveBeenCalled()
  })
})
