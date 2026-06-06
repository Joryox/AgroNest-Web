import { useState } from 'react'
import { Link } from 'react-router'
import { Search, X } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWheatAwn } from '@fortawesome/free-solid-svg-icons'
import { Badge, CosechaCardSkeleton, Pagination, EmptyState, ErrorState, PageTransition } from '@/shared/components'
import { useTodasCosechas } from '../hooks'
import type { Cosecha, CosechaEstado } from '../types'

function FundingBar({ recaudado, meta }: { recaudado: number; meta: number }) {
  const pct = meta > 0 ? Math.min((recaudado / meta) * 100, 100) : 0
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>${recaudado.toFixed(0)} USDC</span>
        <span>${meta.toFixed(0)} meta</span>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100 dark:bg-gray-700">
        <div
          className="h-2 rounded-full bg-primary-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1 text-right text-xs font-medium text-primary-600 dark:text-primary-400">
        {pct.toFixed(0)}%
      </p>
    </div>
  )
}

function CosechaCard({ cosecha }: { cosecha: Cosecha }) {
  const showBar = ['ACTIVE', 'FUNDED', 'MATURE', 'LIQUIDATED'].includes(cosecha.estado)
  return (
    <Link
      to={`/cosechas/${cosecha.id}`}
      className="flex flex-col rounded-xl bg-white dark:bg-gray-800 p-5 shadow-sm
                 ring-1 ring-gray-200 dark:ring-gray-700 transition-all
                 hover:shadow-md hover:ring-primary-200 dark:hover:ring-primary-700"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/30">
            <FontAwesomeIcon icon={faWheatAwn} className="h-4 w-4 text-primary-600 dark:text-primary-400" aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold capitalize text-gray-900 dark:text-gray-100">{cosecha.tipoGrano}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{cosecha.hectareas} ha</p>
          </div>
        </div>
        <Badge status={cosecha.estado} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-500">Dinero Necesario</p>
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            ${cosecha.capitalRequerido.toLocaleString()} USDC
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 dark:text-gray-500">Cosecha Estimada</p>
          <p className="font-semibold text-gray-900 dark:text-gray-100">
            {cosecha.rendimientoKg.toLocaleString()} kg
          </p>
        </div>
        {cosecha.nftTokenId != null && (
          <div className="col-span-2">
            <p className="text-xs text-gray-400 dark:text-gray-500">NFT</p>
            <p className="font-medium text-primary-600 dark:text-primary-400">#{cosecha.nftTokenId}</p>
          </div>
        )}
      </div>

      {showBar && (
        <div className="mt-4">
          <FundingBar recaudado={0} meta={cosecha.capitalRequerido} />
        </div>
      )}
    </Link>
  )
}

const ESTADOS: CosechaEstado[] = ['PENDIENTE', 'MINTED', 'ACTIVE', 'MATURE', 'LIQUIDATED', 'DEFAULTED']

const ESTADO_LABELS: Record<string, string> = {
  PENDIENTE: 'Pendiente',
  MINTED: 'Registrado',
  ACTIVE: 'Recibiendo Apoyo',
  MATURE: 'En Crecimiento',
  LIQUIDATED: 'Finalizado (Éxito)',
  DEFAULTED: 'Pérdida',
}

export function CosechasPage() {
  const [page, setPage] = useState(1)
  const { data, isLoading, isError, isFetching, refetch } = useTodasCosechas(page)
  const [filtro, setFiltro] = useState<string>('all')
  const [busqueda, setBusqueda] = useState('')

  const cosechas = (data?.data ?? [])
    .filter((c) => filtro === 'all' || c.estado === filtro)
    .filter((c) => !busqueda || c.tipoGrano.toLowerCase().includes(busqueda.toLowerCase()))

  const hayFiltros = filtro !== 'all' || busqueda !== ''

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Explorar Cultivos</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Encuentra y apoya proyectos agrícolas para recibir ganancias</p>
          </div>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {isFetching && !isLoading ? '↻ ' : ''}{data?.total ?? 0} cosechas
          </p>
        </div>

        {/* Búsqueda */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
          <input
            type="search"
            value={busqueda}
            onChange={(e) => { setBusqueda(e.target.value); setPage(1) }}
            placeholder="Buscar por tipo de grano…"
            aria-label="Buscar cosechas"
            className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800
                       py-2 pl-9 pr-4 text-sm text-gray-900 dark:text-gray-100
                       placeholder-gray-400 dark:placeholder-gray-500
                       focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          />
        </div>

        {/* Filtros */}
        <div role="group" aria-label="Filtrar por estado" className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={filtro === 'all'}
            onClick={() => { setFiltro('all'); setPage(1) }}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filtro === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            Todas
          </button>
          {ESTADOS.map((e) => (
            <button
              key={e}
              type="button"
              aria-pressed={filtro === e}
              onClick={() => { setFiltro(e); setPage(1) }}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filtro === e
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {ESTADO_LABELS[e] ?? e}
            </button>
          ))}
          {hayFiltros && (
            <button
              type="button"
              onClick={() => { setFiltro('all'); setBusqueda(''); setPage(1) }}
              className="flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <X className="h-3 w-3" /> Limpiar
            </button>
          )}
        </div>

        {isLoading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <CosechaCardSkeleton key={i} />)}
          </div>
        )}
        {isError && (
          <ErrorState
            title="Error al cargar cosechas"
            onRetry={() => refetch()}
          />
        )}
        {!isLoading && cosechas.length === 0 && (
          <EmptyState
            icon={<FontAwesomeIcon icon={faWheatAwn} className="h-8 w-8" aria-hidden="true" />}
            title={hayFiltros ? 'Sin resultados para esos filtros' : 'No hay cosechas disponibles'}
            description={hayFiltros ? 'Prueba con otros filtros o limpia la búsqueda.' : 'Vuelve más tarde para ver cosechas disponibles para invertir.'}
          />
        )}

        {!isLoading && cosechas.length > 0 && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cosechas.map((c, i) => (
              <div
                key={c.id}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <CosechaCard cosecha={c} />
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
