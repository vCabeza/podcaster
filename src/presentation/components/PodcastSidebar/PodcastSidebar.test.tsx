import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { podcastDetailFixture } from '../../views/fixtures/podcastDetail.fixture'
import { PodcastSidebar } from './PodcastSidebar'

describe('PodcastSidebar', () => {
  it('renders artwork, title, author, description and detail links', () => {
    render(
      <MemoryRouter>
        <PodcastSidebar
          podcastId={podcastDetailFixture.id}
          title={podcastDetailFixture.title}
          author={podcastDetailFixture.author}
          image={podcastDetailFixture.image}
          description={podcastDetailFixture.description}
        />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('complementary', { name: 'Podcast details' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: `${podcastDetailFixture.title} cover` }),
    ).toHaveAttribute('src', podcastDetailFixture.image)
    expect(
      screen.getByRole('heading', { name: podcastDetailFixture.title }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('link', {
        name: `${podcastDetailFixture.title} cover`,
      }),
    ).toHaveAttribute('href', `/podcast/${podcastDetailFixture.id}`)
    expect(
      screen.getByRole('link', { name: podcastDetailFixture.title }),
    ).toHaveAttribute('href', `/podcast/${podcastDetailFixture.id}`)
    expect(
      screen.getByRole('link', { name: `by ${podcastDetailFixture.author}` }),
    ).toHaveAttribute('href', `/podcast/${podcastDetailFixture.id}`)
    expect(screen.getByText('Description:')).toBeInTheDocument()
    expect(
      screen.getByText(podcastDetailFixture.description),
    ).toBeInTheDocument()
  })
})
