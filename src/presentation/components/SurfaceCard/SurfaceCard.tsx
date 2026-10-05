import type { ElementType, HTMLAttributes, ReactNode } from 'react'
import './SurfaceCard.css'

export interface SurfaceCardProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType
  children: ReactNode
}

export function SurfaceCard({
  as: Component = 'div',
  className = '',
  children,
  ...rest
}: SurfaceCardProps) {
  const classes = ['surface-card', className].filter(Boolean).join(' ')

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  )
}
