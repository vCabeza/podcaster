import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { podcastFixtures } from '../../../application/hooks/fixtures/podcasts.fixture'
import { PodcastGrid } from './PodcastGrid'

describe('PodcastGrid', () => {
  it('renders a card for each podcast', () => {
    render(
      <MemoryRouter>
        <PodcastGrid podcasts={podcastFixtures} />
      </MemoryRouter>,
    )

    expect(screen.getAllByRole('article')).toHaveLength(3)
  })

  it('shows an accessible empty message when there are no podcasts', () => {
    render(
      <MemoryRouter>
        <PodcastGrid podcasts={[]} />
      </MemoryRouter>,
    )

    expect(screen.getByRole('status')).toHaveTextContent('No podcasts found')
  })
})
