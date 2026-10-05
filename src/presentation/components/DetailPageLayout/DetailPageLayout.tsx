import type { CSSProperties, ReactNode } from 'react'
import {
  SIDEBAR_MAX_WIDTH,
  SURFACE_BORDER_RADIUS,
  SURFACE_BOX_SHADOW,
} from '../../constants/layout'
import './DetailPageLayout.css'

export interface DetailPageLayoutProps {
  pageTitle: string
  sidebar: ReactNode
  children: ReactNode
}

export function DetailPageLayout({
  pageTitle,
  sidebar,
  children,
}: DetailPageLayoutProps) {
  const layoutTokens = {
    '--sidebar-max-width': SIDEBAR_MAX_WIDTH,
    '--radius-surface': SURFACE_BORDER_RADIUS,
    '--shadow-surface': SURFACE_BOX_SHADOW,
  } as CSSProperties

  return (
    <div className="detail-page-layout" style={layoutTokens}>
      <h1 className="visually-hidden">{pageTitle}</h1>
      {sidebar}
      <div className="detail-page-layout__main">{children}</div>
    </div>
  )
}
