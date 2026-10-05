import { Link } from 'react-router-dom'
import './Header.css'

export interface HeaderProps {
  isLoading?: boolean
}

export function Header({ isLoading = false }: HeaderProps) {
  return (
    <header className="app-header" role="banner">
      <div className="app-header__inner">
        <Link to="/" className="app-header__brand">
          Podcaster
        </Link>

        {isLoading ? (
          <div
            className="app-header__loading"
            aria-hidden="true"
            data-testid="navigation-loading-indicator"
          />
        ) : null}
      </div>
    </header>
  )
}
