import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { LoadingProvider, useLoading } from './LoadingContext'

describe('LoadingContext', () => {
  it('tracks concurrent loading operations with reference counting', async () => {
    const user = userEvent.setup()

    function Probe() {
      const { isLoading, startLoading, stopLoading } = useLoading()

      return (
        <div>
          <p>{isLoading ? 'busy' : 'idle'}</p>
          <button type="button" onClick={startLoading}>
            Start
          </button>
          <button type="button" onClick={stopLoading}>
            Stop
          </button>
        </div>
      )
    }

    render(
      <LoadingProvider>
        <Probe />
      </LoadingProvider>,
    )

    expect(screen.getByText('idle')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Start' }))
    await user.click(screen.getByRole('button', { name: 'Start' }))
    expect(screen.getByText('busy')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Stop' }))
    expect(screen.getByText('busy')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Stop' }))
    expect(screen.getByText('idle')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Stop' }))
    expect(screen.getByText('idle')).toBeInTheDocument()
  })

  it('throws when useLoading is used outside the provider', () => {
    function Broken() {
      useLoading()
      return null
    }

    expect(() => render(<Broken />)).toThrow(
      'useLoading must be used within a LoadingProvider',
    )
  })
})
