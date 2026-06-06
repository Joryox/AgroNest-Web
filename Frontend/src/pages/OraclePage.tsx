import { useState } from 'react'
import { Loader2, AlertTriangle } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBolt, faSeedling, faHashtag, faDoorOpen, faMoneyBillWave,
  faHourglassHalf, faCircleCheck, faCircleXmark, faSatelliteDish,
  faCloudRain, faLocationDot,
} from '@fortawesome/free-solid-svg-icons'
import { isAxiosError } from 'axios'
import { useTodasBovedas } from '@/features/boveda/hooks'
import { useOracleEstado, useAvanzarCiclo, useAvanzarChainlink } from '@/features/oracle'
import { SateliteWidget } from '@/features/oracle/components'
import { Badge, Button, Spinner, EmptyState, PageTransition, ProgressBar, ConfirmDialog, ErrorState } from '@/shared/components'
import type { Boveda } from '@/features/boveda/types'

const CICLO_ESTADOS = [
  { key: 'PENDIENTE',  label: 'Pendiente',    desc: 'Cosecha registrada, NFT no minteado aún',         icon: faSeedling },
  { key: 'MINTED',    label: 'NFT Minteado',  desc: 'NFT creado en blockchain',                        icon: faHashtag },
  { key: 'OPEN',      label: 'Abierto',       desc: 'Bóveda abierta, recibiendo inversiones',          icon: faDoorOpen },
  { key: 'FUNDED',    label: 'Financiado',    desc: 'Meta de financiamiento alcanzada',                icon: faMoneyBillWave },
  { key: 'ACTIVE',    label: 'Activo',        desc: 'Cosecha en producción, bóveda activa',            icon: faBolt },
  { key: 'MATURE',    label: 'Maduro',        desc: 'Cosecha lista para liquidar o declarar default',  icon: faHourglassHalf },
  { key: 'LIQUIDATED',label: 'Liquidado',     desc: 'Venta exitosa — inversores reciben rendimiento',  icon: faCircleCheck },
  { key: 'DEFAULTED', label: 'Default',       desc: 'Pérdida — inversores recuperan solo la reserva',  icon: faCircleXmark },
]

function EstadoTimeline({ estadoActual }: { estadoActual: string }) {
  const terminalStates = ['LIQUIDATED', 'DEFAULTED']
  const mainFlow = CICLO_ESTADOS.filter(e => e.key !== 'DEFAULTED')

  return (
    <div className="mt-4">
      <div className="flex items-start gap-1 overflow-x-auto pb-2">
        {mainFlow.map((estado, i) => {
          const idx = CICLO_ESTADOS.findIndex(e => e.key === estadoActual)
          const thisIdx = CICLO_ESTADOS.findIndex(e => e.key === estado.key)
          const isActive = estado.key === estadoActual
          const isPast = thisIdx < idx

          return (
            <div key={estado.key} className="flex items-center gap-1">
              <div className="flex flex-col items-center min-w-[80px]">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold border-2 transition-all
                  ${isActive ? 'bg-primary-600 border-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-primary-900' :
                    isPast ? 'bg-primary-100 border-primary-400 text-primary-700 dark:bg-primary-900/40 dark:border-primary-600 dark:text-primary-300' :
                    'bg-gray-100 border-gray-300 text-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-500'}`}
                >
                  <FontAwesomeIcon icon={estado.icon} className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
                <p className={`mt-1 text-center text-[10px] font-medium leading-tight
                  ${isActive ? 'text-primary-700 dark:text-primary-300' :
                    isPast ? 'text-gray-600 dark:text-gray-400' : 'text-gray-400 dark:text-gray-600'}`}
                >
                  {estado.label}
                </p>
              </div>
              {i < mainFlow.length - 1 && (
                <div className={`h-0.5 w-4 shrink-0 rounded ${isPast || isActive ? 'bg-primary-400 dark:bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
              )}
            </div>
          )
        })}

        {/* Terminal states */}
        <div className="ml-2 flex gap-2">
          {terminalStates.map(key => {
            const estado = CICLO_ESTADOS.find(e => e.key === key)!
            const isActive = key === estadoActual
            return (
              <div key={key} className="flex flex-col items-center min-w-[72px]">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold border-2
                  ${isActive && key === 'LIQUIDATED' ? 'bg-teal-600 border-teal-600 text-white' :
                    isActive && key === 'DEFAULTED' ? 'bg-red-600 border-red-600 text-white' :
                    'bg-gray-100 border-gray-300 text-gray-400 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-500'}`}
                >
                  <FontAwesomeIcon icon={estado.icon} className="h-3.5 w-3.5" aria-hidden="true" />
                </div>
                <p className={`mt-1 text-center text-[10px] font-medium leading-tight
                  ${isActive ? (key === 'LIQUIDATED' ? 'text-teal-700 dark:text-teal-300' : 'text-red-700 dark:text-red-300') : 'text-gray-400 dark:text-gray-600'}`}
                >
                  {estado.label}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Description of current state */}
      <div className="mt-3 rounded-lg bg-primary-50 dark:bg-primary-900/20 px-4 py-3">
        <p className="text-sm text-primary-800 dark:text-primary-200">
          <span className="font-semibold">Estado actual: </span>
          {CICLO_ESTADOS.find(e => e.key === estadoActual)?.desc ?? estadoActual}
        </p>
      </div>
    </div>
  )
}

// Zonas predefinidas de México para demo Chainlink
const ZONAS_MX = [
  { label: 'Sonora (zona árida)',   lat: '29.0892', lon: '-110.9605' },
  { label: 'Sinaloa (costa)',       lat: '24.7994', lon: '-107.3910' },
  { label: 'Jalisco (bajío)',       lat: '20.6597', lon: '-103.3496' },
  { label: 'Guanajuato',           lat: '21.0190', lon: '-101.2574' },
  { label: 'CDMX (demo default)',   lat: '19.4326', lon: '-99.1332'  },
]

function BovedaPanel({ boveda }: { boveda: Boveda }) {
  const { data: oracleEstado, isLoading: loadingEstado } = useOracleEstado(boveda.vaultAddress)
  const avanzar = useAvanzarCiclo()
  const chainlink = useAvanzarChainlink()
  const terminalStates = ['LIQUIDATED', 'DEFAULTED']
  const isTerminal = terminalStates.includes(boveda.estado)
  const [confirmType, setConfirmType] = useState<'avanzar' | 'liquidar' | 'default' | 'chainlink' | null>(null)
  const [zonaIdx, setZonaIdx] = useState(0)
  const zonaSeleccionada = ZONAS_MX[zonaIdx] ?? ZONAS_MX[0]!

  const avanzarError = avanzar.isError && isAxiosError(avanzar.error)
    ? (avanzar.error.response?.data?.detail ?? 'Error al avanzar el ciclo.')
    : avanzar.isError ? 'Error al avanzar el ciclo.' : null

  const chainlinkError = chainlink.isError && isAxiosError(chainlink.error)
    ? (chainlink.error.response?.data?.detail ?? 'Error al solicitar Chainlink.')
    : chainlink.isError ? 'Error al solicitar Chainlink.' : null

  function ejecutarAvanzar(exito?: boolean) {
    setConfirmType(null)
    avanzar.mutate({ cosecha_id: boveda.cosechaId, ...(exito !== undefined ? { exito } : {}) })
  }

  function ejecutarChainlink() {
    setConfirmType(null)
    chainlink.mutate({
      cosecha_id: boveda.cosechaId,
      lat: zonaSeleccionada.lat,
      lon: zonaSeleccionada.lon,
    })
  }

  return (
    <div className="space-y-6">
      {/* Vault info */}
      <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Cosecha #{boveda.cosechaId}
            </h2>
            <p className="mt-1 font-mono text-xs text-gray-500 dark:text-gray-400">
              {boveda.vaultAddress}
            </p>
          </div>
          <Badge status={boveda.estado} />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Meta</p>
            <p className="font-semibold text-gray-900 dark:text-gray-100">${boveda.metaFinanciamiento.toFixed(0)} USDC</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Recaudado</p>
            <p className="font-semibold text-primary-700 dark:text-primary-400">${boveda.totalRecaudado.toFixed(2)} USDC</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Oracle State</p>
            {loadingEstado ? (
              <Spinner size="sm" />
            ) : (
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {oracleEstado?.oracleStateNombre ?? '—'}
              </p>
            )}
          </div>
        </div>

        <EstadoTimeline estadoActual={boveda.estado} />
      </div>

      <SateliteWidget
        lat={19.4326}
        lng={-99.1332}
        tipoGrano="Maíz demo"
      />

      {/* Action panel */}
      <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Avanzar ciclo de vida</h3>

        {isTerminal ? (
          <div className="mt-4 flex items-center gap-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 p-4">
            <FontAwesomeIcon icon={faCircleCheck} className="h-5 w-5 text-teal-500 shrink-0" aria-hidden="true" />
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Esta bóveda ya está en estado terminal (<strong>{boveda.estado}</strong>). No se puede avanzar más.
            </p>
          </div>
        ) : (
          <>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Llama al oráculo para ejecutar la transición de estado en la blockchain.
              En el estado <strong>MATURE</strong>, puedes elegir si la cosecha fue exitosa o no.
            </p>

            {avanzar.isPending && (
              <div className="mt-4" aria-live="polite">
                <ProgressBar />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Ejecutando en blockchain…</p>
              </div>
            )}

            {avanzar.data && (
              <div className="mt-4 rounded-lg border border-primary-200 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-700 p-4">
                <p className="text-sm font-medium text-primary-800 dark:text-primary-200">
                  ✓ Avanzado a {avanzar.data.estadoNuevo}
                </p>
                {avanzar.data.txHash && (
                  <p className="mt-1 font-mono text-xs text-primary-600 dark:text-primary-400">
                    tx: {avanzar.data.txHash.slice(0, 20)}…
                  </p>
                )}
              </div>
            )}

            {chainlink.data && (
              <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700 p-4">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-amber-600 dark:text-amber-400" />
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                    Esperando respuesta de Chainlink (~30 seg)
                  </p>
                </div>
                <p className="mt-1 text-xs text-amber-600 dark:text-amber-400">
                  Zona: {zonaSeleccionada.label} · tx: {chainlink.data.txHash.slice(0, 20)}…
                </p>
                <p className="mt-1 text-xs text-amber-500 dark:text-amber-500">
                  El estado se actualizará automáticamente cuando llegue el callback on-chain.
                </p>
              </div>
            )}

            {avanzarError && (
              <ErrorState
                title="Error al avanzar ciclo"
                description={avanzarError}
                onRetry={() => avanzar.reset()}
                className="mt-4 py-6"
              />
            )}

            {chainlinkError && (
              <ErrorState
                title="Error Chainlink"
                description={chainlinkError}
                onRetry={() => chainlink.reset()}
                className="mt-4 py-6"
              />
            )}

            {boveda.estado === 'MATURE' && (
              <div className="mt-4 rounded-xl border border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/10 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faSatelliteDish} className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden="true" />
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">Resolución automática · Chainlink Functions</p>
                </div>
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  Consulta datos reales de precipitación vía Open-Meteo. Si la zona tuvo &lt;5 mm en 7 días → DEFAULT. Si tuvo lluvia → LIQUIDADO.
                </p>

                <div className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faLocationDot} className="h-3.5 w-3.5 text-amber-500 shrink-0" aria-hidden="true" />
                  <select
                    value={zonaIdx}
                    onChange={(e) => setZonaIdx(Number(e.target.value))}
                    className="flex-1 rounded-lg border border-amber-300 dark:border-amber-600 bg-white dark:bg-gray-800 px-2 py-1 text-xs text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-400"
                  >
                    {ZONAS_MX.map((z, i) => (
                      <option key={i} value={i}>{z.label}</option>
                    ))}
                  </select>
                </div>

                <Button
                  onClick={() => setConfirmType('chainlink')}
                  isLoading={chainlink.isPending}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                >
                  <FontAwesomeIcon icon={faCloudRain} className="h-4 w-4" aria-hidden="true" />
                  Resolver con datos reales (Chainlink)
                </Button>
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-3">
              {boveda.estado === 'MATURE' ? (
                <>
                  <p className="w-full text-xs text-gray-400 dark:text-gray-500">Resolución manual (fallback demo):</p>
                  <Button
                    onClick={() => setConfirmType('liquidar')}
                    isLoading={avanzar.isPending}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    <FontAwesomeIcon icon={faCircleCheck} className="h-4 w-4" aria-hidden="true" />
                    Liquidar (Éxito)
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => setConfirmType('default')}
                    isLoading={avanzar.isPending}
                  >
                    <FontAwesomeIcon icon={faCircleXmark} className="h-4 w-4" aria-hidden="true" />
                    Default (Pérdida)
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setConfirmType('avanzar')}
                  isLoading={avanzar.isPending}
                >
                  {avanzar.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Ejecutando en blockchain…
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faBolt} className="h-4 w-4" aria-hidden="true" />
                      Avanzar ciclo
                    </>
                  )}
                </Button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Confirmation dialogs */}
      <ConfirmDialog
        open={confirmType === 'chainlink'}
        title="¿Resolver con datos reales de Chainlink?"
        description={`Se consultará la precipitación de "${zonaSeleccionada.label}" en los últimos 7 días. Si hubo sequía (<5 mm) → DEFAULT. Si hubo lluvia → LIQUIDADO. La respuesta llega ~30 segundos después.`}
        confirmLabel="Sí, consultar Chainlink"
        onConfirm={ejecutarChainlink}
        onCancel={() => setConfirmType(null)}
      />
      <ConfirmDialog
        open={confirmType === 'avanzar'}
        title="¿Avanzar el ciclo de esta bóveda?"
        description="Esta operación ejecutará una transacción blockchain que cambia el estado de forma irreversible."
        confirmLabel="Sí, avanzar"
        onConfirm={() => ejecutarAvanzar()}
        onCancel={() => setConfirmType(null)}
      />
      <ConfirmDialog
        open={confirmType === 'liquidar'}
        title="¿Liquidar la cosecha como exitosa?"
        description="Los inversores recibirán su capital más el rendimiento acordado. Esta acción es irreversible."
        confirmLabel="Confirmar Liquidación"
        onConfirm={() => ejecutarAvanzar(true)}
        onCancel={() => setConfirmType(null)}
      />
      <ConfirmDialog
        open={confirmType === 'default'}
        title="¿Declarar default en la cosecha?"
        description="Los inversores solo recuperarán el porcentaje de reserva. Esta acción es irreversible."
        confirmLabel="Confirmar Default"
        confirmVariant="danger"
        onConfirm={() => ejecutarAvanzar(false)}
        onCancel={() => setConfirmType(null)}
      />
    </div>
  )
}

export function OraclePage() {
  const { data: bovedas, isLoading } = useTodasBovedas()
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const selectedBoveda = bovedas?.find(b => b.id === selectedId) ?? null

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/30">
              <FontAwesomeIcon icon={faBolt} className="h-5 w-5 text-amber-600 dark:text-amber-400" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Panel Oracle</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Control del ciclo de vida de bóvedas DeFi</p>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-700 p-4">
            <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              Este panel simula el oráculo blockchain que avanza el estado de las cosechas.
              Cada acción ejecuta una transacción real en la red configurada.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Vault list */}
          <div className="rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700 overflow-hidden">
            <div className="border-b border-gray-100 dark:border-gray-700 px-5 py-4">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100">Bóvedas</h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Selecciona una para operar</p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-10"><Spinner /></div>
            ) : !bovedas?.length ? (
              <div className="p-4">
                <EmptyState
                  icon={<FontAwesomeIcon icon={faHourglassHalf} className="h-6 w-6" aria-hidden="true" />}
                  title="Sin bóvedas"
                  description="Registra una cosecha y abre una bóveda primero."
                  className="py-10"
                />
              </div>
            ) : (
              <ul className="divide-y divide-gray-50 dark:divide-gray-700">
                {bovedas.map(boveda => (
                  <li key={boveda.id}>
                    <button
                      type="button"
                      onClick={() => setSelectedId(boveda.id)}
                      className={`w-full px-5 py-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50
                        ${selectedId === boveda.id ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500' : ''}`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Cosecha #{boveda.cosechaId}</p>
                          <p className="mt-0.5 font-mono text-xs text-gray-400 dark:text-gray-500">
                            {boveda.vaultAddress?.slice(0, 16)}…
                          </p>
                        </div>
                        <Badge status={boveda.estado} />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-2">
            {selectedBoveda ? (
              <BovedaPanel boveda={selectedBoveda} />
            ) : (
              <EmptyState
                icon={<FontAwesomeIcon icon={faBolt} className="h-8 w-8" aria-hidden="true" />}
                title="Selecciona una bóveda"
                description="Elige una bóveda de la lista para ver su estado y avanzar el ciclo de vida."
                className="h-full min-h-[300px]"
              />
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
