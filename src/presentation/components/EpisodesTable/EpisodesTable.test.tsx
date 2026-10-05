import { render, screen, within } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { podcastDetailFixture } from '../../views/fixtures/podcastDetail.fixture'
import { EpisodesTable } from './EpisodesTable'

describe('EpisodesTable', () => {
  it('renders headers, rows and episode detail links', () => {
    render(
      <MemoryRouter>
        <EpisodesTable
          podcastId={podcastDetailFixture.id}
          episodes={podcastDetailFixture.episodes}
        />
      </MemoryRouter>,
    )

    const table = screen.getByRole('table', { name: 'Podcast episodes' })

    expect(within(table).getByRole('columnheader', { name: 'Title' })).toBeInTheDocument()
    expect(within(table).getByRole('columnheader', { name: 'Date' })).toBeInTheDocument()
    expect(
      within(table).getByRole('columnheader', { name: 'Duration' }),
    ).toBeInTheDocument()

    expect(within(table).getAllByRole('row')).toHaveLength(3)

    expect(
      screen.getByRole('link', { name: 'Episode One' }),
    ).toHaveAttribute(
      'href',
      `/podcast/${podcastDetailFixture.id}/episode/1001`,
    )
    expect(
      screen.getByRole('link', { name: 'Episode Two' }),
    ).toHaveAttribute(
      'href',
      `/podcast/${podcastDetailFixture.id}/episode/1002`,
    )

    expect(screen.getByText('01:02:05')).toBeInTheDocument()
    expect(screen.getByText('14:00')).toBeInTheDocument()
  })
})
