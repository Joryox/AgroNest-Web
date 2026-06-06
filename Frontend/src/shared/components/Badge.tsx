type BadgeVariant =
  | 'PENDIENTE' | 'MINTED' | 'ACTIVE' | 'MATURE'
  | 'LIQUIDATED' | 'DEFAULTED' | 'OPEN' | 'FUNDED' | 'RECLAMADO'
  | string

const variantClasses: Record<string, string> = {
  PENDIENTE:  'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700',
  MINTED:     'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-700',
  ACTIVE:     'bg-primary-100 text-primary-800 border-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-700',
  OPEN:       'bg-primary-100 text-primary-800 border-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-700',
  MATURE:     'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-700',
  FUNDED:     'bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-700',
  LIQUIDATED: 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700',
  RECLAMADO:  'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-300 dark:border-teal-700',
  DEFAULTED:  'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700',
}

const statusLabels: Record<string, string> = {
  PENDIENTE:  'Pendiente',
  MINTED:     'NFT Minteado',
  ACTIVE:     'Activo',
  OPEN:       'Abierto',
  MATURE:     'Maduro',
  FUNDED:     'Financiado',
  LIQUIDATED: 'Liquidado',
  RECLAMADO:  'Reclamado',
  DEFAULTED:  'En Default',
}

interface BadgeProps {
  status: BadgeVariant
  className?: string
}

export function Badge({ status, className = '' }: BadgeProps) {
  const classes = variantClasses[status] ?? 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
  const label = statusLabels[status] ?? status
  return (
    <span
      role="status"
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${classes} ${className}`}
    >
      {label}
    </span>
  )
}
