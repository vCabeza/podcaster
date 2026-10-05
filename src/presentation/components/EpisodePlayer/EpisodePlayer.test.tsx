import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EpisodePlayer } from './EpisodePlayer'

describe('EpisodePlayer', () => {
  it('renders a native audio element with controls and the expected source', () => {
    const { container } = render(
      <EpisodePlayer
        audioUrl="https://example.com/audio.mp3"
        title="Episode One"
      />,
    )

    const audio = container.querySelector('audio')

    expect(audio).not.toBeNull()
    expect(audio).toHaveAttribute('controls')
    expect(audio).toHaveAttribute('preload', 'metadata')
    expect(audio).toHaveAttribute('src', 'https://example.com/audio.mp3')
    expect(audio).toHaveAttribute(
      'aria-label',
      'Audio player for Episode One',
    )
    expect(audio?.textContent).toContain(
      'Your browser does not support the audio element.',
    )
  })
})
