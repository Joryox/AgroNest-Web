interface ProgressBarProps {
  /** Si true, muestra animación indeterminada (ideal para operaciones blockchain) */
  indeterminate?: boolean
  /** Valor entre 0 y 100 cuando no es indeterminado */
  value?: number
  className?: string
}

export function ProgressBar({ indeterminate = true, value = 0, className = '' }: ProgressBarProps) {
  return (
    <div
      className={`h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700 ${className}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={indeterminate ? undefined : value}
      aria-label="Progreso de operación"
    >
      <div
        className={`h-full rounded-full bg-primary-500 ${
          indeterminate ? 'animate-progress-indeterminate' : 'transition-all duration-300'
        }`}
        style={indeterminate ? undefined : { width: `${value}%` }}
      />
    </div>
  )
}
