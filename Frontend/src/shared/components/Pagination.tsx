import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  isLoading?: boolean
}

export function Pagination({ currentPage, totalPages, onPageChange, isLoading }: PaginationProps) {
  if (totalPages <= 1) return null

  function getPages(): (number | 'ellipsis')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | 'ellipsis')[] = [1]
    if (currentPage > 3) pages.push('ellipsis')
    const start = Math.max(2, currentPage - 1)
    const end = Math.min(totalPages - 1, currentPage + 1)
    for (let i = start; i <= end; i++) pages.push(i)
    if (currentPage < totalPages - 2) pages.push('ellipsis')
    pages.push(totalPages)
    return pages
  }

  const pages = getPages()

  return (
    <nav
      aria-label="Paginación"
      className="flex items-center justify-center gap-1 pt-4"
    >
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isLoading}
        aria-label="Página anterior"
        className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 dark:border-gray-700
                   text-gray-500 dark:text-gray-400 transition-colors
                   hover:border-primary-300 hover:text-primary-600 dark:hover:border-primary-600 dark:hover:text-primary-400
                   disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((page, i) =>
        page === 'ellipsis' ? (
          <span key={`e-${i}`} className="flex h-8 w-8 items-center justify-center text-gray-400 dark:text-gray-500 text-sm">
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            disabled={isLoading}
            aria-label={`Página ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
            className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors
              ${page === currentPage
                ? 'bg-primary-600 text-white shadow-sm'
                : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-primary-300 hover:text-primary-600 dark:hover:border-primary-600 dark:hover:text-primary-400'
              } disabled:pointer-events-none disabled:opacity-60`}
          >
            {page}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isLoading}
        aria-label="Página siguiente"
        className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 dark:border-gray-700
                   text-gray-500 dark:text-gray-400 transition-colors
                   hover:border-primary-300 hover:text-primary-600 dark:hover:border-primary-600 dark:hover:text-primary-400
                   disabled:pointer-events-none disabled:opacity-40"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}
