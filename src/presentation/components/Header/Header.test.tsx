import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import {
  LoadingProvider,
  useLoading,
} from '../../../application/context/LoadingContext'
import { Header } from './Header'

describe('Header', () => {
  it('renders an accessible brand link to the home route', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    )

    const brandLink = screen.getByRole('link', { name: 'Podcaster' })

    expect(brandLink).toHaveAttribute('href', '/')
    expect(screen.getByRole('banner')).toContainElement(brandLink)
  })

  it('hides the loading indicator when idle', () => {
    render(
      <MemoryRouter>
        <Header isLoading={false} />
      </MemoryRouter>,
    )

    expect(
      screen.queryByTestId('navigation-loading-indicator'),
    ).not.toBeInTheDocument()
  })

  it('shows the loading indicator when loading is active', () => {
    render(
      <MemoryRouter>
        <Header isLoading />
      </MemoryRouter>,
    )

    expect(
      screen.getByTestId('navigation-loading-indicator'),
    ).toBeInTheDocument()
  })

  it('reflects programmatic LoadingContext state when wired by the parent', async () => {
    const user = userEvent.setup()

    function Probe() {
      const { isLoading, startLoading, stopLoading } = useLoading()

      return (
        <>
          <button type="button" onClick={startLoading}>
            Start
          </button>
          <button type="button" onClick={stopLoading}>
            Stop
          </button>
          <Header isLoading={isLoading} />
        </>
      )
    }

    render(
      <LoadingProvider>
        <MemoryRouter>
          <Probe />
        </MemoryRouter>
      </LoadingProvider>,
    )

    expect(
      screen.queryByTestId('navigation-loading-indicator'),
    ).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Start' }))
    expect(
      screen.getByTestId('navigation-loading-indicator'),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Stop' }))
    expect(
      screen.queryByTestId('navigation-loading-indicator'),
    ).not.toBeInTheDocument()
  })
})
