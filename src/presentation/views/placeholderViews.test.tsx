import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { EpisodeDetailView } from './EpisodeDetailView'
import { PodcastDetailView } from './PodcastDetailView'

describe('detail placeholder views', () => {
  it('renders the podcast detail placeholder with the route id', () => {
    render(
      <MemoryRouter initialEntries={['/podcast/123']}>
        <Routes>
          <Route path="/podcast/:podcastId" element={<PodcastDetailView />} />
        </Routes>
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: 'Podcast detail' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Details for podcast 123 will appear here.'),
    ).toBeInTheDocument()
  })

  it('renders the episode detail placeholder with route ids', () => {
    render(
      <MemoryRouter initialEntries={['/podcast/123/episode/456']}>
        <Routes>
          <Route
            path="/podcast/:podcastId/episode/:episodeId"
            element={<EpisodeDetailView />}
          />
        </Routes>
      </MemoryRouter>,
    )

    expect(
      screen.getByRole('heading', { name: 'Episode detail' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        'Details for episode 456 from podcast 123 will appear here.',
      ),
    ).toBeInTheDocument()
  })
})
