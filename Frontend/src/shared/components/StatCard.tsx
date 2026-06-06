import type { ReactNode } from 'react'
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter'

interface StatCardProps {
  label: string
  value: string | number
  /** Valor numérico raw para animar el contador. Si se provee, sobreescribe `value` en la UI. */
  rawValue?: number
  sub?: string
  icon?: ReactNode
  className?: string
}

function AnimatedValue({ raw }: { raw: number }) {
  const display = useAnimatedCounter(raw)
  return <>{display}</>
}

export function StatCard({ label, value, rawValue, sub, icon, className = '' }: StatCardProps) {
  return (
    <div className={`rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200 dark:bg-gray-800 dark:ring-gray-700 ${className}`}>
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
        {rawValue !== undefined ? <AnimatedValue raw={rawValue} /> : value}
      </p>
      {sub && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{sub}</p>}
    </div>
  )
}
