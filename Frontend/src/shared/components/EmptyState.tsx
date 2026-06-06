import { useId, type ReactNode } from 'react'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className = '' }: EmptyStateProps) {
  const titleId = useId()

  return (
    <div
      role="region"
      aria-labelledby={titleId}
      className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed
        border-gray-200 dark:border-gray-700 py-16 px-8 text-center ${className}`}
    >
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500">
        {icon}
      </div>
      <p id={titleId} className="text-base font-semibold text-gray-700 dark:text-gray-300">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
