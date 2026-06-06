import { useState } from 'react'
import { Link } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStore, faPlus } from '@fortawesome/free-solid-svg-icons'
import { Button, PageTransition, Pagination, Spinner, EmptyState, ErrorState } from '@/shared/components'
import { useListings } from '../hooks'
import { ListingCard } from '../components/ListingCard'

export function MarketplacePage() {
  const [page, setPage] = useState(1)
  const [estadoFiltro, setEstadoFiltro] = useState('ACTIVE')
  const { data, isLoading, isError, refetch } = useListings(page, estadoFiltro)

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
              <FontAwesomeIcon icon={faStore} className="text-primary-500" />
              Mercado Secundario
              <span className="text-[10px] font-bold bg-violet-100 text-violet-700 px-2 py-0.5 rounded border border-violet-200 uppercase tracking-wider">
                Powered by Rare Protocol
              </span>
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Compra y vende comprobantes de apoyo con otras personas
            </p>
          </div>
          <Link to="/mis-cosechas">
            <Button size="sm">
              <FontAwesomeIcon icon={faPlus} className="h-4 w-4" />
              Vender comprobante
            </Button>
          </Link>
        </div>

        {/* Filtros */}
        <div className="flex gap-2">
          {(['ACTIVE', 'SOLD', 'CANCELLED'] as const).map((estado) => (
            <button
              key={estado}
              type="button"
              onClick={() => { setEstadoFiltro(estado); setPage(1) }}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                estadoFiltro === estado
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              {estado === 'ACTIVE' ? 'Activos' : estado === 'SOLD' ? 'Vendidos' : 'Cancelados'}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : isError ? (
          <ErrorState
            title="Error al cargar el marketplace"
            description="No se pudieron obtener los listings."
            onRetry={() => refetch()}
          />
        ) : (data?.data ?? []).length === 0 ? (
          <EmptyState
            icon={<FontAwesomeIcon icon={faStore} className="h-6 w-6" />}
            title="No hay ofertas disponibles"
            description={estadoFiltro === 'ACTIVE' ? 'Nadie está vendiendo sus comprobantes ahora mismo.' : 'No hay registros en esta categoría.'}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {(data?.data ?? []).map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}

        {/* Paginación */}
        {data && data.pages && data.pages > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={page}
              totalPages={data.pages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </PageTransition>
  )
}
