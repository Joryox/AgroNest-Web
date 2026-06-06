import { Link } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCoins, faArrowDown, faArrowUp, faCheckCircle,
  faHourglassHalf, faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons'
import { Button, Card, PageTransition, Spinner, StatCard } from '@/shared/components'
import { useEtherfuseCustomer, useEtherfuseOrdenes, useSimularFiat } from '../hooks'
import type { EtherfuseOrden } from '../types'

function statusIcon(status: EtherfuseOrden['status']) {
  switch (status) {
    case 'completed':
    case 'finalized':
      return <FontAwesomeIcon icon={faCheckCircle} className="h-4 w-4 text-green-500" />
    case 'funded':
      return <FontAwesomeIcon icon={faHourglassHalf} className="h-4 w-4 text-amber-500" />
    default:
      return <FontAwesomeIcon icon={faExclamationTriangle} className="h-4 w-4 text-gray-400" />
  }
}

export function CETESPortfolioPage() {
  const { data: cliente, isLoading: loadingCliente } = useEtherfuseCustomer()
  const { data: paginacion, isLoading: loadingOrdenes } = useEtherfuseOrdenes()
  const simularFiat = useSimularFiat()

  const ordenes = paginacion?.data ?? []
  const onramps = ordenes.filter((o) => o.tipo === 'onramp')
  const offramps = ordenes.filter((o) => o.tipo === 'offramp')

  const totalCETES = onramps
    .filter((o) => o.status === 'completed')
    .reduce((s, o) => s + (o.destinationAmount ?? 0), 0)
  const totalMXNIn = onramps
    .filter((o) => o.status === 'completed')
    .reduce((s, o) => s + o.sourceAmount, 0)

  if (loadingCliente) return <div className="flex justify-center py-16"><Spinner /></div>

  if (!cliente) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center space-y-4">
        <p className="text-gray-500 dark:text-gray-400">No tienes cuenta Etherfuse. Comienza con el onboarding KYC.</p>
        <Link to="/etherfuse/onboarding">
          <Button>Iniciar onboarding</Button>
        </Link>
      </div>
    )
  }

  return (
    <PageTransition>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Mi Ahorro Fijo</h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Crece tu dinero con el respaldo del Gobierno de forma segura y sencilla
            </p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
            cliente.kycStatus === 'APPROVED'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : cliente.kycStatus === 'PENDING'
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            KYC {cliente.kycStatus}
          </span>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Ahorro Activo"
            value={totalCETES.toFixed(4)}
            sub="unidades acumuladas"
            icon={<FontAwesomeIcon icon={faCoins} className="h-5 w-5 text-primary-500" />}
          />
          <StatCard
            label="Dinero Ingresado"
            value={`$${totalMXNIn.toLocaleString()}`}
            sub="MXN convertidos"
            icon={<FontAwesomeIcon icon={faArrowDown} className="h-5 w-5 text-blue-500" />}
          />
          <StatCard
            label="Movimientos"
            value={paginacion?.total ?? 0}
            sub={`${onramps.length} ingresos · ${offramps.length} retiros`}
            icon={<FontAwesomeIcon icon={faArrowUp} className="h-5 w-5 text-green-500" />}
          />
        </div>

        {/* Acciones */}
        <div className="flex gap-3">
          <Link to="/etherfuse/onramp">
            <Button size="sm">
              <FontAwesomeIcon icon={faArrowDown} className="h-4 w-4" />
              Ahorrar más dinero
            </Button>
          </Link>
          <Link to="/etherfuse/offramp">
            <Button variant="secondary" size="sm">
              <FontAwesomeIcon icon={faArrowUp} className="h-4 w-4" />
              Retirar a mi banco
            </Button>
          </Link>
        </div>

        {/* Historial de órdenes */}
        <Card header={<h2 className="font-semibold text-gray-700 dark:text-gray-300">Historial de movimientos</h2>}>
          {loadingOrdenes ? (
            <div className="flex justify-center py-8"><Spinner /></div>
          ) : ordenes.length === 0 ? (
            <p className="py-6 text-center text-sm text-gray-400">Aún no has ahorrado nada. Da el primer paso.</p>
          ) : (
            <div className="space-y-3">
              {ordenes.map((o) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3 text-sm"
                >
                  <div className="flex items-center gap-3">
                    {statusIcon(o.status)}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {o.tipo === 'onramp' ? '↓ Ingreso' : '↑ Retiro'} ·{' '}
                        {o.sourceAmount.toLocaleString()} {o.sourceAsset}
                      </p>
                      <p className="text-xs text-gray-400 font-mono">{o.orderId.slice(0, 12)}…</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs capitalize text-gray-500 dark:text-gray-400">{o.status}</span>
                    {o.tipo === 'onramp' && o.status === 'created' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        isLoading={simularFiat.isPending}
                        onClick={() => simularFiat.mutate(o.orderId)}
                      >
                        Simular
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </PageTransition>
  )
}
