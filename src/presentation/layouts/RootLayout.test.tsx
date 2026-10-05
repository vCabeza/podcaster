import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import {
  LoadingProvider,
  useLoading,
} from '../../application/context/LoadingContext'
import { RootLayout } from './RootLayout'

function renderRootLayout() {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <RootLayout />,
        children: [
          {
            index: true,
            element: <p>Outlet content</p>,
          },
        ],
      },
    ],
    { initialEntries: ['/'] },
  )

  return render(
    <LoadingProvider>
      <RouterProvider router={router} />
    </LoadingProvider>,
  )
}

describe('RootLayout', () => {
  it('renders the header, skip link, and outlet content', () => {
    renderRootLayout()

    expect(
      screen.getByRole('link', { name: 'Skip to main content' }),
    ).toBeInTheDocument()
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Podcaster' })).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.getByText('Outlet content')).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveAttribute('aria-busy', 'false')
    expect(
      screen.queryByTestId('navigation-loading-indicator'),
    ).not.toBeInTheDocument()
  })

  it('moves focus to main content when the skip link is activated', async () => {
    const user = userEvent.setup()
    renderRootLayout()

    const skipLink = screen.getByRole('link', { name: 'Skip to main content' })
    const main = screen.getByRole('main')

    await user.click(skipLink)

    expect(main).toHaveFocus()
  })

  it('exposes busy state and a live region while loading', async () => {
    const user = userEvent.setup()

    function LoadingTrigger() {
      const { startLoading } = useLoading()

      return (
        <button type="button" onClick={startLoading}>
          Trigger loading
        </button>
      )
    }

    const router = createMemoryRouter(
      [
        {
          path: '/',
          element: <RootLayout />,
          children: [
            {
              index: true,
              element: <LoadingTrigger />,
            },
          ],
        },
      ],
      { initialEntries: ['/'] },
    )

    render(
      <LoadingProvider>
        <RouterProvider router={router} />
      </LoadingProvider>,
    )

    await user.click(screen.getByRole('button', { name: 'Trigger loading' }))

    expect(screen.getByRole('main')).toHaveAttribute('aria-busy', 'true')
    expect(screen.getByRole('status')).toHaveTextContent('Loading content...')
    expect(
      screen.getByTestId('navigation-loading-indicator'),
    ).toBeInTheDocument()
  })
})
