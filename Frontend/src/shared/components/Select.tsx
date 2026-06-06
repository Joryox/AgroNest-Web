import { type SelectHTMLAttributes, useId } from 'react'

interface SelectOption {
  value: string
  label: string
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  helperText?: string
  options: SelectOption[]
}

export function Select({ label, error, helperText, options, className = '', required, ...props }: SelectProps) {
  const id = useId()

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span aria-hidden="true" className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      <select
        id={id}
        required={required}
        aria-required={required}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        className={`rounded-md border px-3 py-2 text-sm text-gray-900
          bg-white outline-none transition-colors
          dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100
          focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
          disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500
          dark:disabled:bg-gray-900 dark:disabled:text-gray-600
          ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'}
          ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={`${id}-helper`} className="text-xs text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  )
}
