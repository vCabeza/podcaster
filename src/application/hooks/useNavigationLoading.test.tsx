import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { LoadingProvider, useLoading } from '../context/LoadingContext'
import { useNavigationLoading } from './useNavigationLoading'

type NavigationState = 'idle' | 'loading' | 'submitting'

const useNavigationMock = vi.fn(() => ({
  state: 'idle' as NavigationState,
}))

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  )

  return {
    ...actual,
    useNavigation: () => useNavigationMock(),
  }
})

describe('useNavigationLoading', () => {
  beforeEach(() => {
    useNavigationMock.mockReturnValue({ state: 'idle' })
  })

  it('is true when React Router reports a loading navigation', () => {
    useNavigationMock.mockReturnValue({ state: 'loading' })

    function Probe() {
      const isLoading = useNavigationLoading()
      return <p>{isLoading ? 'loading' : 'ready'}</p>
    }

    render(
      <LoadingProvider>
        <MemoryRouter>
          <Probe />
        </MemoryRouter>
      </LoadingProvider>,
    )

    expect(screen.getByText('loading')).toBeInTheDocument()
  })

  it('is true when programmatic async loading is active', async () => {
    const user = userEvent.setup()

    function Probe() {
      const isLoading = useNavigationLoading()
      const { startLoading } = useLoading()

      return (
        <div>
          <p>{isLoading ? 'loading' : 'ready'}</p>
          <button type="button" onClick={startLoading}>
            Start
          </button>
        </div>
      )
    }

    render(
      <LoadingProvider>
        <MemoryRouter>
          <Probe />
        </MemoryRouter>
      </LoadingProvider>,
    )

    expect(screen.getByText('ready')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Start' }))
    expect(screen.getByText('loading')).toBeInTheDocument()
  })
})
