import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { createMemoryRouter, RouterProvider, useParams } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { LoadingProvider } from '../../application/context/LoadingContext'
import { podcastFixtures } from '../../application/hooks/fixtures/podcasts.fixture'
import type { PodcastRepository } from '../../domain/repositories/PodcastRepository'
import { RootLayout } from '../layouts/RootLayout'
import { HomeView } from './HomeView'

function PodcastDetailStub() {
  const { podcastId } = useParams()

  return (
    <section>
      <h1>Podcast detail</h1>
      <p>Details for podcast {podcastId} will appear here.</p>
    </section>
  )
}

function renderHome(repository: PodcastRepository) {
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
            element: <PodcastDetailStub />,
          },
        ],
      },
    ],
    { initialEntries: ['/'] },
  )

  function Wrapper({ children }: { children: ReactNode }) {
    return <LoadingProvider>{children}</LoadingProvider>
  }

  return {
    user: userEvent.setup(),
    ...render(<RouterProvider router={router} />, { wrapper: Wrapper }),
  }
}

describe('HomeView', () => {
  it('renders podcasts from the repository and filters them reactively', async () => {
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn().mockResolvedValue(podcastFixtures),
      getPodcastDetail: vi.fn(),
    }

    const { user } = renderHome(repository)

    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(3)
    })

    expect(screen.getByTestId('podcast-count-badge')).toHaveTextContent('3')

    await user.type(
      screen.getByRole('searchbox', { name: 'Filter podcasts' }),
      'daily',
    )

    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(1)
    })

    expect(screen.getByTestId('podcast-count-badge')).toHaveTextContent('1')
    expect(
      screen.getByRole('heading', { name: 'The Daily' }),
    ).toBeInTheDocument()
  })

  it('navigates to the podcast detail route when a card is activated', async () => {
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn().mockResolvedValue(podcastFixtures),
      getPodcastDetail: vi.fn(),
    }

    const { user } = renderHome(repository)

    const cardLink = await screen.findByRole('link', {
      name: 'The Daily. Author: The New York Times',
    })

    await user.click(cardLink)

    expect(
      await screen.findByRole('heading', { name: 'Podcast detail' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Details for podcast 1535809341 will appear here.'),
    ).toBeInTheDocument()
  })

  it('supports keyboard activation of a podcast card', async () => {
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn().mockResolvedValue(podcastFixtures),
      getPodcastDetail: vi.fn(),
    }

    const { user } = renderHome(repository)

    const cardLink = await screen.findByRole('link', {
      name: 'The Joe Rogan Experience. Author: Joe Rogan',
    })

    cardLink.focus()
    expect(cardLink).toHaveFocus()
    await user.keyboard('{Enter}')

    expect(
      await screen.findByRole('heading', { name: 'Podcast detail' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Details for podcast 360084272 will appear here.'),
    ).toBeInTheDocument()
  })

  it('shows an error alert when loading fails', async () => {
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn().mockRejectedValue(new Error('Upstream failure')),
      getPodcastDetail: vi.fn(),
    }

    renderHome(repository)

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Upstream failure',
    )
  })
})
