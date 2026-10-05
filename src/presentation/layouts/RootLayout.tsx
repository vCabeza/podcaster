import type { CSSProperties, MouseEvent } from 'react'
import { Outlet } from 'react-router-dom'
import { useNavigationLoading } from '../../application/hooks/useNavigationLoading'
import {
  LOADING_STATUS_MESSAGE,
  MAIN_CONTENT_ID,
  SKIP_TO_MAIN_CONTENT_LABEL,
} from '../constants/a11y'
import { CONTENT_MAX_WIDTH } from '../constants/layout'
import { Header } from '../components/Header/Header'
import './RootLayout.css'

export function RootLayout() {
  const isLoading = useNavigationLoading()

  const handleSkipToMain = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    const mainContent = document.getElementById(MAIN_CONTENT_ID)

    if (mainContent instanceof HTMLElement) {
      mainContent.focus()
    }
  }

  const contentTokens = {
    '--content-max-width': CONTENT_MAX_WIDTH,
  } as CSSProperties

  return (
    <div className="root-layout" style={contentTokens}>
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="skip-link"
        onClick={handleSkipToMain}
      >
        {SKIP_TO_MAIN_CONTENT_LABEL}
      </a>

      <Header isLoading={isLoading} />

      <main
        id={MAIN_CONTENT_ID}
        className="root-layout__main"
        role="main"
        tabIndex={-1}
        aria-busy={isLoading}
      >
        {isLoading ? (
          <div className="visually-hidden" role="status" aria-live="polite">
            {LOADING_STATUS_MESSAGE}
          </div>
        ) : null}

        <div className="root-layout__content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
