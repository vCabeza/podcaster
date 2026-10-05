import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { podcastFixtures } from '../../../application/hooks/fixtures/podcasts.fixture'
import { PodcastCard } from './PodcastCard'

describe('PodcastCard', () => {
  it('renders title, author and a link to the podcast detail route', () => {
    const podcast = podcastFixtures[0]

    if (podcast === undefined) {
      throw new Error('Expected podcast fixture')
    }

    render(
      <MemoryRouter>
        <PodcastCard podcast={podcast} />
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: podcast.title }),
    ).toBeInTheDocument()
    expect(screen.getByText(`Author: ${podcast.author}`)).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: `${podcast.title} cover` }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('link', {
        name: `${podcast.title} cover ${podcast.title} Author: ${podcast.author}`,
      }),
    ).toHaveAttribute('href', `/podcast/${podcast.id}`)
  })
})
