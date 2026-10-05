import { render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import {
  createMemoryRouter,
  MemoryRouter,
  RouterProvider,
} from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { LoadingProvider } from '../../application/context/LoadingContext'
import { podcastFixtures } from '../../application/hooks/fixtures/podcasts.fixture'
import type { PodcastRepository } from '../../domain/repositories/PodcastRepository'
import { expectNoA11yViolations } from '../../test/a11y'
import { Header } from '../components/Header/Header'
import { RootLayout } from '../layouts/RootLayout'
import { podcastDetailFixture } from '../views/fixtures/podcastDetail.fixture'
import { EpisodeDetailView } from '../views/EpisodeDetailView'
import { HomeView } from '../views/HomeView'
import { PodcastDetailView } from '../views/PodcastDetailView'

function Providers({ children }: { children: ReactNode }) {
  return <LoadingProvider>{children}</LoadingProvider>
}

describe('accessibility audits', () => {
  it('passes axe checks for Header landmarks and brand link', async () => {
    const { container } = render(
      <MemoryRouter>
        <Header isLoading />
      </MemoryRouter>,
    )

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Podcaster' })).toBeInTheDocument()
    await expectNoA11yViolations(container)
  })

  it('passes axe checks for RootLayout skip link and main landmark', async () => {
    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <RootLayout />,
          children: [{ index: true, element: <p>Content</p> }],
        },
      ],
      { initialEntries: ['/'] },
    )

    const { container } = render(<RouterProvider router={router} />, {
      wrapper: Providers,
    })

    expect(
      screen.getByRole('link', { name: 'Skip to main content' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    await expectNoA11yViolations(container)
  })

  it('passes axe checks for HomeView filter, badge and podcast grid', async () => {
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn().mockResolvedValue(podcastFixtures),
      getPodcastDetail: vi.fn(),
    }

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
          ],
        },
      ],
      { initialEntries: ['/'] },
    )

    const { container } = render(<RouterProvider router={router} />, {
      wrapper: Providers,
    })

    expect(await screen.findAllByRole('article')).toHaveLength(3)
    expect(screen.getByTestId('podcast-count-badge')).toHaveAttribute(
      'aria-live',
      'polite',
    )
    await expectNoA11yViolations(container)
  })

  it('passes axe checks for PodcastDetailView sidebar and episodes table', async () => {
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn(),
      getPodcastDetail: vi.fn().mockResolvedValue(podcastDetailFixture),
    }

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

    const { container } = render(<RouterProvider router={router} />, {
      wrapper: Providers,
    })

    expect(await screen.findByText('Episodes: 2')).toBeInTheDocument()
    expect(
      screen.getByRole('complementary', { name: 'Podcast details' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('table', { name: 'Podcast episodes' }),
    ).toBeInTheDocument()
    await expectNoA11yViolations(container)
  })

  it('passes axe checks for EpisodeDetailView content and audio player', async () => {
    const repository: PodcastRepository = {
      getTopPodcasts: vi.fn(),
      getPodcastDetail: vi.fn().mockResolvedValue(podcastDetailFixture),
    }

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
      { initialEntries: ['/podcast/360084272/episode/1001'] },
    )

    const { container } = render(<RouterProvider router={router} />, {
      wrapper: Providers,
    })

    expect(
      await screen.findByRole('heading', { name: 'Episode One' }),
    ).toBeInTheDocument()
    expect(container.querySelector('audio')).toHaveAttribute(
      'src',
      'https://example.com/1.mp3',
    )
    await expectNoA11yViolations(container)
  })
})
