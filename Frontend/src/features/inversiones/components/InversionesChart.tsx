import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { Inversion } from '../types'

interface InversionesChartProps {
  inversiones: Inversion[]
  isLoading?: boolean
}

export function InversionesChart({ inversiones, isLoading }: InversionesChartProps) {
  if (isLoading) {
    return <div className="h-64 animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />
  }

  if (inversiones.length < 1) {
    return (
      <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-400 dark:text-gray-500">Sin inversiones para mostrar</p>
      </div>
    )
  }

  const data = inversiones.map((inv, i) => ({
    name: `#${i + 1}`,
    usdc: Number(inv.montoUsdc),
    bcrop: Number(inv.bcropRecibido),
  }))

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="gradUsdc" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#16a34a" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#16a34a" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-100 dark:stroke-gray-700" />
        <XAxis dataKey="name" tick={{ fontSize: 11 }} className="fill-gray-500 dark:fill-gray-400" />
        <YAxis tick={{ fontSize: 11 }} className="fill-gray-500 dark:fill-gray-400" />
        <Tooltip
          contentStyle={{
            backgroundColor: 'var(--color-surface-raised)',
            border: '1px solid var(--color-border)',
            borderRadius: '8px',
            fontSize: 12,
          }}
          formatter={(value) => [`$${Number(value ?? 0).toFixed(2)} USDC`]}
        />
        <Area
          type="monotone"
          dataKey="usdc"
          name="Invertido"
          stroke="#16a34a"
          strokeWidth={2}
          fill="url(#gradUsdc)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
