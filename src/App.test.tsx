import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders the Podcaster brand and supporting copy', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { name: 'Podcaster' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Discover and listen to your favorite podcasts.'),
    ).toBeInTheDocument()
  })
})
