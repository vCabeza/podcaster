import { render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { LoadingProvider } from '../../application/context/LoadingContext'
import type { PodcastRepository } from '../../domain/repositories/PodcastRepository'
import { RootLayout } from '../layouts/RootLayout'
import { podcastDetailFixture } from './fixtures/podcastDetail.fixture'
import { PodcastDetailView } from './PodcastDetailView'

function renderPodcastDetail(repository: PodcastRepository) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <RootLayout />,
        children: [
          {
            path: 'podcast/:podcastId',
            element: <PodcastDetailView repository={repository} />,
          },
        ],
      },
    ],
    { initialEntries: ['/podcast/360084272'] },
  )

  function Wrapper({ children }: { children: ReactNode }) {
    return <LoadingProvider>{children}</LoadingProvider>
  }

  return render(<RouterProvider router={router} />, { wrapper: Wrapper })
}

describe('PodcastDetailView', () => {
  it('loads podcast detail and renders sidebar, count and episode rows', async () => {
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn(),
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

  it('logs to the console when the detail request fails and does not show an alert', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const failure = new Error('Detail unavailable')
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn(),
      getPodcastDetail: vi.fn().mockRejectedValue(failure),
    }

    renderPodcastDetail(repository)

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(failure)
    })

    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    consoleError.mockRestore()
  })
})
