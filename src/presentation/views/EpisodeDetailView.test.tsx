import { render, screen, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { LoadingProvider } from '../../application/context/LoadingContext'
import type { PodcastRepository } from '../../domain/repositories/PodcastRepository'
import { RootLayout } from '../layouts/RootLayout'
import { podcastDetailFixture } from './fixtures/podcastDetail.fixture'
import { EpisodeDetailView } from './EpisodeDetailView'

function renderEpisodeDetail(
  repository: PodcastRepository,
  path = '/podcast/360084272/episode/1001',
) {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <RootLayout />,
        children: [
          {
            path: 'podcast/:podcastId/episode/:episodeId',
            element: <EpisodeDetailView repository={repository} />,
          },
        ],
      },
    ],
    { initialEntries: [path] },
  )

  function Wrapper({ children }: { children: ReactNode }) {
    return <LoadingProvider>{children}</LoadingProvider>
  }

  return render(<RouterProvider router={router} />, { wrapper: Wrapper })
}

describe('EpisodeDetailView', () => {
  it('renders sidebar links, sanitized description and audio source', async () => {
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn(),
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

    const titleLinks = screen.getAllByRole('link', {
      name: new RegExp(podcastDetailFixture.title),
    })
    expect(titleLinks.length).toBeGreaterThan(0)
    titleLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/podcast/360084272')
    })
    expect(
      screen.getByRole('link', { name: `by ${podcastDetailFixture.author}` }),
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

  it('shows an accessible not-found alert for unknown episodes', async () => {
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn(),
      getPodcastDetail: vi.fn().mockResolvedValue(podcastDetailFixture),
    }

    renderEpisodeDetail(repository, '/podcast/360084272/episode/missing')

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Episode not found',
    )
  })
})
