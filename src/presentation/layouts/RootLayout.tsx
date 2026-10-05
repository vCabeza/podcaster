import type { MouseEvent } from 'react'
import { Outlet } from 'react-router-dom'
import { useNavigationLoading } from '../../application/hooks/useNavigationLoading'
import { Header } from '../components/Header/Header'
import './RootLayout.css'

export function RootLayout() {
  const isLoading = useNavigationLoading()

  const handleSkipToMain = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const mainContent = document.getElementById('main-content')

    if (mainContent instanceof HTMLElement) {
      mainContent.focus()
    }
  }

  return (
    <div className="root-layout">
      <a
        href="#main-content"
        className="skip-link"
        onClick={handleSkipToMain}
      >
        Skip to main content
      </a>

      <Header isLoading={isLoading} />

      <main
        id="main-content"
        className="root-layout__main"
        role="main"
        tabIndex={-1}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <div className="visually-hidden" role="status" aria-live="polite">
            Loading content...
          </div>
        ) : null}

        <div className="root-layout__content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
