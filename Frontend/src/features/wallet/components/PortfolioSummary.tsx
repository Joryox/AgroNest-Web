import { StatCard } from '@/shared/components'

interface Investment {
  montoUsdc: number
  bcropRecibido: number
  reclamado: boolean
  montoReclamado: number
}

interface PortfolioSummaryProps {
  investments: Investment[]
  isLoading?: boolean
}

export function PortfolioSummary({ investments, isLoading }: PortfolioSummaryProps) {
  const totalInvested = investments.reduce((s, i) => s + i.montoUsdc, 0)
  const totalBcrop = investments.reduce((s, i) => s + i.bcropRecibido, 0)
  const pendingClaims = investments.filter((i) => !i.reclamado).length
  const totalClaimed = investments.filter((i) => i.reclamado).reduce((s, i) => s + i.montoReclamado, 0)

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-100" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        label="Total Invertido"
        value={`$${totalInvested.toFixed(2)}`}
        sub="USDC"
        icon="💰"
      />
      <StatCard
        label="bCROP Acumulado"
        value={totalBcrop.toFixed(2)}
        sub="tokens de cosecha"
        icon="🌱"
      />
      <StatCard
        label="Pendientes de reclamar"
        value={pendingClaims}
        sub="inversiones"
        icon="⏳"
      />
      <StatCard
        label="Total Reclamado"
        value={`$${totalClaimed.toFixed(2)}`}
        sub="USDC recuperados"
        icon="✅"
      />
    </div>
  )
}
