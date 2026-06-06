import type { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

/**
 * Wrapper con fade-in al montar la página.
 * La clase .reduce-motion del accessibilityStore desactiva la animación automáticamente.
 */
export function PageTransition({ children, className = '' }: PageTransitionProps) {
  return (
    <div className={`animate-fade-in ${className}`}>
      {children}
    </div>
  )
}
