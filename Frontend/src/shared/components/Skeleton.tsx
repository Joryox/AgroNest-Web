interface SkeletonProps {
  className?: string
  lines?: number
}

export function Skeleton({ className = '', lines }: SkeletonProps) {
  if (lines) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={`h-4 animate-pulse rounded bg-gray-200 dark:bg-gray-700
              ${i === lines - 1 ? 'w-2/3' : 'w-full'} ${className}`}
          />
        ))}
      </div>
    )
  }
  return (
    <div
      className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`}
    />
  )
}
