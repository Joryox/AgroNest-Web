import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  header?: ReactNode
}

export function Card({ children, className = '', header }: CardProps) {
  return (
    <div className={`rounded-xl bg-white shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700 ${className}`}>
      {header && (
        <div className="border-b border-gray-100 px-6 py-4 dark:border-gray-700">{header}</div>
      )}
      <div className="px-6 py-5">{children}</div>
    </div>
  )
}
