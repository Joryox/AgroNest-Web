import { useState } from 'react'
import { Link } from 'react-router'
import { Plus, Search } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWheatAwn } from '@fortawesome/free-solid-svg-icons'
import { Badge, Button, CosechaCardSkeleton, EmptyState, ErrorState, PageTransition } from '@/shared/components'
import { useMisCosechas } from '../hooks'
import type { Cosecha } from '../types'

function CosechaRow({ cosecha }: { cosecha: Cosecha }) {
  return (
    <div className="flex items-center justify-between rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 transition-colors hover:ring-primary-200 dark:hover:ring-primary-700">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/30">
          <FontAwesomeIcon icon={faWheatAwn} className="h-5 w-5 text-primary-600 dark:text-primary-400" aria-hidden="true" />
        </div>
        <div>
          <p className="font-semibold capitalize text-gray-900 dark:text-gray-100">{cosecha.tipoGrano}</p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {cosecha.hectareas} ha · {new Date(cosecha.fechaCosecha).toLocaleDateString('es-ES')}
          </p>
          {cosecha.nftTokenId != null && (
            <p className="text-xs font-medium text-primary-600 dark:text-primary-400">NFT #{cosecha.nftTokenId}</p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden sm:block">
          <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            ${cosecha.capitalRequerido.toLocaleString()}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">Meta ($)</p>
        </div>
        <Badge status={cosecha.estado} />
        <Link to={`/cosechas/${cosecha.id}`}>
          <Button variant="secondary" size="sm">Ver</Button>
        </Link>
      </div>
    </div>
  )
}

export function MisCosechasPage() {
  const { data, isLoading, isError, refetch } = useMisCosechas()
  const [busqueda, setBusqueda] = useState('')

  const cosechas = (data?.data ?? []).filter(
    (c) => !busqueda || c.tipoGrano.toLowerCase().includes(busqueda.toLowerCase()),
  )

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Mis Cultivos</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Tus proyectos agrícolas registrados</p>
          </div>
          <Link to="/cosechas/nueva">
            <Button>
              <Plus className="h-4 w-4" />
              Nuevo Proyecto
            </Button>
          </Link>
        </div>

        {/* Búsqueda */}
        {(data?.total ?? 0) > 3 && (
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden="true" />
            <input
              type="search"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Filtrar por tipo de grano…"
              aria-label="Filtrar mis cosechas"
              className="w-full rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800
                         py-2 pl-9 pr-4 text-sm text-gray-900 dark:text-gray-100
                         placeholder-gray-400 dark:placeholder-gray-500
                         focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
            />
          </div>
        )}

        {isLoading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <CosechaCardSkeleton key={i} />)}
          </div>
        )}
        {isError && (
          <ErrorState
            title="Error al cargar tus cosechas"
            onRetry={() => refetch()}
          />
        )}
        {!isLoading && cosechas.length === 0 && (
          <EmptyState
            icon={<FontAwesomeIcon icon={faWheatAwn} className="h-8 w-8" aria-hidden="true" />}
            title={busqueda ? 'Sin resultados para ese filtro' : 'Aún no tienes cosechas'}
            description={busqueda ? undefined : 'Registra tu primer proyecto agrícola para que otras personas puedan apoyarte.'}
            action={
              !busqueda ? (
                <Link to="/cosechas/nueva">
                  <Button>
                    <Plus className="h-4 w-4" />
                    Registrar mi primer cultivo
                  </Button>
                </Link>
              ) : undefined
            }
          />
        )}

        {!isLoading && cosechas.length > 0 && (
          <div className="space-y-3">
            {cosechas.map((c, i) => (
              <div
                key={c.id}
                className="animate-slide-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <CosechaRow cosecha={c} />
              </div>
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  )
}
