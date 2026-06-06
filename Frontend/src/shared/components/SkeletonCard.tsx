export function CosechaCardSkeleton() {
  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 space-y-3">
      <div className="flex items-start justify-between">
        <div className="h-5 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-5 w-16 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="h-3 w-1/2 animate-pulse rounded bg-gray-100 dark:bg-gray-700/60" />
      <div className="space-y-1.5">
        <div className="h-3 w-full animate-pulse rounded bg-gray-100 dark:bg-gray-700/60" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-gray-100 dark:bg-gray-700/60" />
      </div>
      <div className="h-2 w-full animate-pulse rounded-full bg-gray-100 dark:bg-gray-700/60" />
    </div>
  )
}

export function InversionCardSkeleton() {
  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 space-y-3">
      <div className="flex items-start justify-between">
        <div className="h-5 w-1/4 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-5 w-20 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="h-7 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-3 w-2/3 animate-pulse rounded bg-gray-100 dark:bg-gray-700/60" />
      <div className="h-8 w-24 animate-pulse rounded-md bg-gray-100 dark:bg-gray-700/60" />
    </div>
  )
}

export function StatCardSkeleton() {
  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 space-y-2">
      <div className="h-3 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-7 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      <div className="h-2.5 w-1/3 animate-pulse rounded bg-gray-100 dark:bg-gray-700/60" />
    </div>
  )
}
