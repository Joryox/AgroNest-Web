import type { ReactNode } from 'react'

interface PageHeaderProps {
  icon: ReactNode
  iconBg?: string
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function PageHeader({ icon, iconBg, title, description, action, className = '' }: PageHeaderProps) {
  return (
    <div className={`flex items-start justify-between gap-4 ${className}`}>
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl
            ${iconBg ?? 'bg-primary-100 dark:bg-primary-900/40'}`}
        >
          {icon}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
