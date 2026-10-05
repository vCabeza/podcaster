import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { podcastDetailFixture } from '../../views/fixtures/podcastDetail.fixture'
import { PodcastSidebar } from './PodcastSidebar'

const detailPath = `/podcast/${podcastDetailFixture.id}`
const episodePath = `${detailPath}/episode/1001`
const backLinkName = `Back to ${podcastDetailFixture.title} details`

function renderSidebar(initialPath: string) {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <PodcastSidebar
        podcastId={podcastDetailFixture.id}
        title={podcastDetailFixture.title}
        author={podcastDetailFixture.author}
        image={podcastDetailFixture.image}
      />
    </MemoryRouter>,
  )
}

describe('PodcastSidebar', () => {
  it('renders artwork, title and author as static content on podcast detail', () => {
    renderSidebar(detailPath)

    expect(
      screen.getByRole('complementary', { name: 'Podcast details' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: `${podcastDetailFixture.title} cover` }),
    ).toHaveAttribute('src', podcastDetailFixture.image)
    expect(
      screen.getByRole('heading', { name: podcastDetailFixture.title }),
    ).toBeInTheDocument()
    expect(screen.getByText(`by ${podcastDetailFixture.author}`)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: backLinkName })).not.toBeInTheDocument()
  })

  it('renders a single detail link when on an episode route', () => {
    renderSidebar(episodePath)

    expect(screen.getByRole('link', { name: backLinkName })).toHaveAttribute(
      'href',
      detailPath,
    )
    expect(screen.getAllByRole('link')).toHaveLength(1)
  })
})
