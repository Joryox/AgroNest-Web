import { useState } from 'react'
import { TrendingUp, CheckCircle2 } from 'lucide-react'
import { Badge, Button, InversionCardSkeleton, Pagination, EmptyState, ErrorState, PageTransition, ProgressBar, ConfirmDialog } from '@/shared/components'
import { useMisInversiones, useReclamar } from '../hooks'
import type { Inversion } from '../types'
import { Link } from 'react-router'

function InversionCard({ inv }: { inv: Inversion }) {
  const reclamar = useReclamar()
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <div className="flex flex-col rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-500">Cosecha #{inv.cosechaId}</p>
          <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-gray-100">
            ${inv.montoUsdc.toFixed(2)}
            <span className="ml-1 text-sm font-normal text-gray-400 dark:text-gray-500">USDC</span>
          </p>
          <p className="text-sm text-primary-600 dark:text-primary-400">
            {inv.bcropRecibido.toFixed(2)} bCROP recibidos
          </p>
        </div>
        <Badge status={inv.reclamado ? 'RECLAMADO' : 'ACTIVE'} />
      </div>

      {inv.txHashDeposit && (
        <p className="mt-3 font-mono text-xs text-gray-400 dark:text-gray-500">
          TX: {inv.txHashDeposit.slice(0, 12)}…{inv.txHashDeposit.slice(-6)}
        </p>
      )}

      {inv.reclamado && inv.montoReclamado > 0 && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-teal-50 dark:bg-teal-900/20 px-3 py-2">
          <CheckCircle2 className="h-4 w-4 text-teal-500 shrink-0" />
          <p className="text-sm font-medium text-teal-700 dark:text-teal-300">
            Retorno reclamado: ${inv.montoReclamado.toFixed(2)} USDC
          </p>
        </div>
      )}

      {!inv.reclamado && (
        <div className="mt-4 space-y-2">
          {reclamar.isPending && <ProgressBar />}
          <Button
            size="sm"
            isLoading={reclamar.isPending}
            onClick={() => setConfirmOpen(true)}
            title="Solo disponible cuando la bóveda esté en LIQUIDATED o DEFAULTED"
          >
            Reclamar retorno
          </Button>
          <ConfirmDialog
            open={confirmOpen}
            title="¿Reclamar retorno de inversión?"
            description={`Recibirás tu retorno de $${inv.montoUsdc.toFixed(2)} USDC más rendimiento. Esta operación ejecutará una transacción en blockchain.`}
            confirmLabel="Sí, reclamar"
            onConfirm={() => { setConfirmOpen(false); reclamar.mutate(inv.id) }}
            onCancel={() => setConfirmOpen(false)}
          />
        </div>
      )}
    </div>
  )
}

export function MisInversionesPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, isFetching, refetch } = useMisInversiones(page)
  const inversiones = data?.data ?? []

  const totalInvested = inversiones.reduce((s, i) => s + i.montoUsdc, 0)
  const totalBcrop = inversiones.reduce((s, i) => s + i.bcropRecibido, 0)
  const activas = inversiones.filter((i) => !i.reclamado).length

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Mis Inversiones</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Rastrea tus posiciones DeFi agrícolas</p>
          </div>
          {isFetching && !isLoading && (
            <span className="text-xs text-gray-400 dark:text-gray-500">Actualizando…</span>
          )}
        </div>

        {/* Summary */}
        {(inversiones.length > 0 || isLoading) && (
          <div className="grid gap-4 sm:grid-cols-3">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-20 animate-pulse rounded-xl bg-primary-50 dark:bg-primary-900/20" />
              ))
            ) : (
              <>
                <div className="rounded-xl bg-primary-50 dark:bg-primary-900/20 p-4 text-center">
                  <p className="text-xs text-primary-500 dark:text-primary-400">Total Invertido</p>
                  <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">${totalInvested.toFixed(2)}</p>
                  <p className="text-xs text-primary-400 dark:text-primary-500">USDC</p>
                </div>
                <div className="rounded-xl bg-primary-50 dark:bg-primary-900/20 p-4 text-center">
                  <p className="text-xs text-primary-500 dark:text-primary-400">bCROP Acumulado</p>
                  <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">{totalBcrop.toFixed(2)}</p>
                  <p className="text-xs text-primary-400 dark:text-primary-500">tokens</p>
                </div>
                <div className="rounded-xl bg-primary-50 dark:bg-primary-900/20 p-4 text-center">
                  <p className="text-xs text-primary-500 dark:text-primary-400">Posiciones activas</p>
                  <p className="text-2xl font-bold text-primary-700 dark:text-primary-300">{activas}</p>
                  <p className="text-xs text-primary-400 dark:text-primary-500">sin reclamar</p>
                </div>
              </>
            )}
          </div>
        )}

        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <InversionCardSkeleton key={i} />)}
          </div>
        )}
        {isError && <ErrorState title="Error al cargar inversiones" onRetry={() => refetch()} />}
        {!isLoading && inversiones.length === 0 && (
          <EmptyState
            icon={<TrendingUp className="h-8 w-8" />}
            title="Aún no tienes inversiones"
            description="Explora el mercado de cosechas y financia una para empezar a recibir rendimientos en bCROP."
            action={
              <Link to="/cosechas">
                <Button>Explorar mercado</Button>
              </Link>
            }
          />
        )}

        {!isLoading && inversiones.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {inversiones.map((inv, i) => (
              <div
                key={inv.id}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <InversionCard inv={inv} />
              </div>
            ))}
          </div>
        )}

        <Pagination
          currentPage={page}
          totalPages={data?.pages ?? 1}
          onPageChange={setPage}
          isLoading={isFetching}
        />
      </div>
    </PageTransition>
  )
}
