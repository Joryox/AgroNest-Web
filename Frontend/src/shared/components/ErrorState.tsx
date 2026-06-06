import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark, faArrowsRotate } from '@fortawesome/free-solid-svg-icons'

interface ErrorStateProps {
  title?: string
  description?: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = 'Algo salió mal',
  description = 'No se pudo cargar la información. Verifica tu conexión e inténtalo de nuevo.',
  onRetry,
  className = '',
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={`flex flex-col items-center justify-center rounded-xl border border-red-200 bg-red-50
        dark:border-red-800/40 dark:bg-red-900/10 py-10 px-6 text-center ${className}`}
    >
      <FontAwesomeIcon
        icon={faCircleXmark}
        className="h-10 w-10 text-red-400 dark:text-red-500"
        aria-hidden="true"
      />
      <p className="mt-3 text-base font-semibold text-red-700 dark:text-red-400">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-red-600/80 dark:text-red-400/70">{description}</p>
      )}
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 inline-flex items-center gap-2 rounded-md border border-red-300 bg-white px-4 py-2
            text-sm font-medium text-red-700 transition-colors hover:bg-red-50
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2
            dark:border-red-700 dark:bg-transparent dark:text-red-400 dark:hover:bg-red-900/20"
        >
          <FontAwesomeIcon icon={faArrowsRotate} className="h-3.5 w-3.5" aria-hidden="true" />
          Reintentar
        </button>
      )}
    </div>
  )
}
