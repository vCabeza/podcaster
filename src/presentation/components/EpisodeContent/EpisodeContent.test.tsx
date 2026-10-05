import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EpisodeContent } from './EpisodeContent'

describe('EpisodeContent', () => {
  it('renders the title, sanitized description and audio player', () => {
    const { container } = render(
      <EpisodeContent
        episode={{
          id: '1001',
          title: 'Episode One',
          description:
            '<p>Safe <strong>copy</strong></p><script>alert(1)</script>',
          releaseDate: '2016-03-01T10:00:00Z',
          duration: '01:02:05',
          audioUrl: 'https://example.com/1.mp3',
        }}
      />,
    )

    expect(
      screen.getByRole('heading', { name: 'Episode One' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Safe')).toBeInTheDocument()
    expect(screen.getByText('copy')).toBeInTheDocument()
    expect(container.innerHTML).not.toContain('<script')
    expect(container.querySelector('audio')).toHaveAttribute(
      'src',
      'https://example.com/1.mp3',
    )
  })
})
