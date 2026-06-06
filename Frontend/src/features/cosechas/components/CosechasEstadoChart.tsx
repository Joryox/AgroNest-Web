import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import type { Cosecha } from '../types'

interface CosechasEstadoChartProps {
  cosechas: Cosecha[]
  isLoading?: boolean
}

const ESTADO_COLORS: Record<string, string> = {
  PENDIENTE:  '#eab308',
  MINTED:     '#6366f1',
  ACTIVE:     '#16a34a',
  MATURE:     '#f97316',
  FUNDED:     '#3b82f6',
  LIQUIDATED: '#14b8a6',
  DEFAULTED:  '#ef4444',
}

const ESTADO_LABELS: Record<string, string> = {
  PENDIENTE:  'Pendiente',
  MINTED:     'Minteado',
  ACTIVE:     'Activo',
  MATURE:     'Maduro',
  FUNDED:     'Financiado',
  LIQUIDATED: 'Liquidado',
  DEFAULTED:  'Default',
}

export function CosechasEstadoChart({ cosechas, isLoading }: CosechasEstadoChartProps) {
  if (isLoading) {
    return <div className="h-56 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
  }

  // Group by estado
  const counts: Record<string, number> = {}
  cosechas.forEach((c) => {
    counts[c.estado] = (counts[c.estado] ?? 0) + 1
  })

  const data = Object.entries(counts).map(([key, value]) => ({
    name: ESTADO_LABELS[key] ?? key,
    value,
    color: ESTADO_COLORS[key] ?? '#9ca3af',
  }))

  if (data.length === 0) {
    return (
      <div className="flex h-56 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-400 dark:text-gray-500">Sin cosechas para mostrar</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--color-surface-raised)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            fontSize: 12,
          }}
          formatter={(value, name) => [value ?? 0, name ?? '']}
        />
        <Legend
          iconType="circle"
          iconSize={8}
          wrapperStyle={{ fontSize: 11 }}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
