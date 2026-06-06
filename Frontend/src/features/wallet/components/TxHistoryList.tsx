import { ArrowUpRight } from 'lucide-react'
import { Badge, EmptyState } from '@/shared/components'
import { useTxStatus } from '../hooks'
import type { TxEntry } from '../types'

export type { TxEntry }

const typeLabels: Record<string, string> = {
  invest: '💰 Inversión',
  claim:  '✅ Reclamo',
  mint:   '🪙 NFT Mint',
  vault:  '🏦 Bóveda',
}

function TxRow({ entry }: { entry: TxEntry }) {
  const { data: status } = useTxStatus(entry.hash)

  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <span className="text-lg" aria-hidden="true">{typeLabels[entry.type]?.split(' ')[0]}</span>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
            {typeLabels[entry.type]}
          </p>
          <a
            href={`#${entry.hash}`}
            className="font-mono text-xs text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-0.5"
            title={entry.hash}
          >
            {entry.hash.slice(0, 10)}…{entry.hash.slice(-6)}
            <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
          </a>
          {entry.date && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {new Date(entry.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 text-right">
        {entry.amount && (
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{entry.amount}</p>
        )}
        <Badge status={status?.status === 'success' ? 'ACTIVE' : status?.status === 'failed' ? 'DEFAULTED' : 'PENDIENTE'} />
      </div>
    </div>
  )
}

interface TxHistoryListProps {
  entries: TxEntry[]
}

export function TxHistoryList({ entries }: TxHistoryListProps) {
  if (entries.length === 0) {
    return (
      <EmptyState
        icon={<span className="text-2xl" aria-hidden="true">📋</span>}
        title="Sin transacciones"
        description="Tus transacciones blockchain aparecerán aquí cuando realices inversiones o reclamos."
      />
    )
  }

  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
      <div className="border-b border-gray-100 dark:border-gray-700 px-6 py-4">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Historial de transacciones
        </h3>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-gray-700/50 px-6">
        {entries.map((entry, i) => (
          <div
            key={entry.hash}
            className="animate-slide-up"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            <TxRow entry={entry} />
          </div>
        ))}
      </div>
    </div>
  )
}
