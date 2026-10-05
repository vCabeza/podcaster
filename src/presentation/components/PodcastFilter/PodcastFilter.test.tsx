import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import { PodcastFilter } from './PodcastFilter'

describe('PodcastFilter', () => {
  it('updates the query and live counter badge while typing', async () => {
    const user = userEvent.setup()

    function Harness() {
      const [query, setQuery] = useState('')
      const visibleCount = query.trim().length === 0 ? 100 : 2

      return (
        <PodcastFilter
          query={query}
          onQueryChange={setQuery}
          visibleCount={visibleCount}
        />
      )
    }

    render(<Harness />)

    expect(screen.getByTestId('podcast-count-badge')).toHaveTextContent('100')
    expect(screen.getByTestId('podcast-count-badge')).toHaveAttribute(
      'aria-live',
      'polite',
    )

    await user.type(
      screen.getByRole('searchbox', { name: 'Filter podcasts' }),
      'daily',
    )

    expect(screen.getByRole('searchbox', { name: 'Filter podcasts' })).toHaveValue(
      'daily',
    )
    expect(screen.getByTestId('podcast-count-badge')).toHaveTextContent('2')
  })
})
