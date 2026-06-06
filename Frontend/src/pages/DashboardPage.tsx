import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faSeedling, faMoneyBillWave, faChartLine, faCoins, faWheatAwn,
  faBuildingColumns, faStore,
} from '@fortawesome/free-solid-svg-icons'
import { StatCard, Button, Badge, PageTransition, ErrorState } from '@/shared/components'
import { useAuthStore } from '@/features/auth'
import { useApiWallet } from '@/features/wallet'
import { useTodasCosechas } from '@/features/cosechas'
import { useMisInversiones } from '@/features/inversiones'
import { InversionesChart } from '@/features/inversiones/components'
import { CosechasEstadoChart } from '@/features/cosechas/components'
import { useAnimatedCounter } from '@/hooks/useAnimatedCounter'
import { useEtherfuseCustomer, useEtherfuseOrdenes } from '@/features/etherfuse'

export function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const { data: wallet } = useApiWallet()
  const { data: cosechas, isLoading: loadingCosechas, isError: errorCosechas, refetch: refetchCosechas } = useTodasCosechas()
  const { data: inversiones, isLoading: loadingInversiones, isError: errorInversiones, refetch: refetchInversiones } = useMisInversiones()
  const { data: etherfuseCliente } = useEtherfuseCustomer()
  const { data: etherfuseOrdenes } = useEtherfuseOrdenes()

  const allCosechas = cosechas?.data ?? []
  const allInversiones = inversiones?.data ?? []
  const totalInvested = allInversiones.reduce((s, i) => s + i.montoUsdc, 0)
  const totalBcrop = allInversiones.reduce((s, i) => s + i.bcropRecibido, 0)
  const activeCosechas = allCosechas.filter(
    (c) => c.estado === 'ACTIVE' || c.estado === 'MINTED' || c.estado === 'MATURE',
  ).length

  const cetesBalance = (etherfuseOrdenes?.data ?? [])
    .filter((o) => o.tipo === 'onramp' && o.status === 'completed')
    .reduce((s, o) => s + (o.destinationAmount ?? 0), 0)

  const animatedActiveCosechas = useAnimatedCounter(activeCosechas)

  return (
    <PageTransition>
      <div className="space-y-8">
        {/* Welcome */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Bienvenido, {user?.firstName ?? 'Agricultor'}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Plataforma descentralizada de financiamiento agrícola — AgroNest
          </p>
        </div>

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Proyectos Activos"
            value={loadingCosechas ? '—' : animatedActiveCosechas}
            sub={`de ${cosechas?.total ?? 0} registrados`}
            icon={<FontAwesomeIcon icon={faSeedling} className="h-5 w-5 text-primary-500" aria-hidden="true" />}
          />
          <StatCard
            label="Dinero Disponible"
            value={`$${Number(wallet?.usdcBalance ?? 0).toFixed(2)}`}
            sub="Dólares Digitales ($)"
            icon={<FontAwesomeIcon icon={faMoneyBillWave} className="h-5 w-5 text-blue-500" aria-hidden="true" />}
          />
          <StatCard
            label="Total Apoyado"
            value={loadingInversiones ? '—' : `$${totalInvested.toFixed(2)}`}
            sub="Dinero prestado"
            icon={<FontAwesomeIcon icon={faChartLine} className="h-5 w-5 text-accent-500" aria-hidden="true" />}
          />
          <StatCard
            label="Ganancias Estimadas"
            value={loadingInversiones ? '—' : totalBcrop.toFixed(2)}
            sub="Cosecha futura"
            icon={<FontAwesomeIcon icon={faCoins} className="h-5 w-5 text-amber-500" aria-hidden="true" />}
          />
          <StatCard
            label="Ahorro Fijo"
            value={cetesBalance > 0 ? `$${cetesBalance.toFixed(2)}` : etherfuseCliente ? '$0.00' : '—'}
            sub={etherfuseCliente ? `Cuenta ${etherfuseCliente.kycStatus}` : 'Sin cuenta vinculada'}
            icon={<FontAwesomeIcon icon={faBuildingColumns} className="h-5 w-5 text-emerald-500" aria-hidden="true" />}
          />
        </div>

        {/* Error states */}
        {errorCosechas && (
          <ErrorState
            title="No se pudieron cargar las cosechas"
            description="Verifica tu conexión con el servidor."
            onRetry={() => refetchCosechas()}
          />
        )}
        {errorInversiones && !errorCosechas && (
          <ErrorState
            title="No se pudieron cargar las inversiones"
            onRetry={() => refetchInversiones()}
          />
        )}

        {/* Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
            <h2 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Historial de mis apoyos financieros
            </h2>
            <InversionesChart inversiones={allInversiones} isLoading={loadingInversiones} />
          </div>
          <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
            <h2 className="mb-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
              Estado de los cultivos
            </h2>
            <CosechasEstadoChart cosechas={allCosechas} isLoading={loadingCosechas} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 sm:grid-cols-2">
          {(user?.role === 'agricultor' || user?.role === 'admin') && (
            <div className="rounded-xl bg-gradient-to-br from-primary-600 to-primary-700 p-6 text-white shadow-md">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faWheatAwn} className="h-5 w-5 opacity-90" aria-hidden="true" />
                <h2 className="text-lg font-bold">Busco Financiamiento</h2>
              </div>
              <p className="mt-2 text-sm opacity-80">
                Registra tus tierras y recibe apoyo económico de otros usuarios.
              </p>
              <div className="mt-4 flex gap-3">
                <Link to="/cosechas/nueva">
                  <Button className="bg-white text-primary-700 hover:bg-primary-50" size="sm">
                    Nuevo Cultivo
                  </Button>
                </Link>
                <Link to="/mis-cosechas">
                  <Button variant="ghost" className="text-white hover:bg-primary-500" size="sm">
                    Mis Proyectos
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {(user?.role === 'inversor' || user?.role === 'admin') && (
            <div className="rounded-xl bg-gradient-to-br from-accent-500 to-accent-600 p-6 text-white shadow-md">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faChartLine} className="h-5 w-5 opacity-90" aria-hidden="true" />
                <h2 className="text-lg font-bold">Quiero Apoyar</h2>
              </div>
              <p className="mt-2 text-sm opacity-80">
                Presta tu dinero a agricultores y recibe una ganancia de su cosecha.
              </p>
              <div className="mt-4 flex gap-3">
                <Link to="/cosechas">
                  <Button className="bg-white text-accent-700 hover:bg-accent-50" size="sm">
                    Ver Proyectos
                  </Button>
                </Link>
                <Link to="/inversiones">
                  <Button variant="ghost" className="text-white hover:bg-accent-400" size="sm">
                    Mis Apoyos
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {(user?.role === 'inversor' || user?.role === 'admin') && (
            <div className="rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 text-white shadow-md">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faBuildingColumns} className="h-5 w-5 opacity-90" aria-hidden="true" />
                <h2 className="text-lg font-bold">Ahorro Fijo</h2>
              </div>
              <p className="mt-2 text-sm opacity-80">
                Ahorra tu dinero de forma segura como en el banco, desde el primer día.
              </p>
              <div className="mt-4 flex gap-3">
                <Link to="/etherfuse/portfolio">
                  <Button className="bg-white text-emerald-700 hover:bg-emerald-50" size="sm">
                    Mi Ahorro
                  </Button>
                </Link>
                <Link to={etherfuseCliente ? '/etherfuse/onramp' : '/etherfuse/onboarding'}>
                  <Button variant="ghost" className="text-white hover:bg-emerald-500" size="sm">
                    {etherfuseCliente ? 'Ahorrar Más' : 'Activar Cuenta'}
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {(user?.role === 'inversor' || user?.role === 'admin') && (
            <div className="rounded-xl bg-gradient-to-br from-violet-600 to-violet-700 p-6 text-white shadow-md">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faStore} className="h-5 w-5 opacity-90" aria-hidden="true" />
                <h2 className="text-lg font-bold">Mercado Secundario</h2>
              </div>
              <p className="mt-2 text-sm opacity-80">
                Compra o vende tus comprobantes de apoyo con otros usuarios.
              </p>
              <div className="mt-4 flex gap-3">
                <Link to="/marketplace">
                  <Button className="bg-white text-violet-700 hover:bg-violet-50" size="sm">
                    Ver Ofertas
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Recent Cosechas */}
        {allCosechas.length > 0 && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Cosechas recientes</h2>
              <Link
                to="/cosechas"
                className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
              >
                Ver todas <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="space-y-2">
              {allCosechas.slice(0, 3).map((c, i) => (
                <div
                  key={c.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <Link
                    to={`/cosechas/${c.id}`}
                    className="flex items-center justify-between rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm
                               ring-1 ring-gray-200 dark:ring-gray-700 transition-all hover:ring-primary-200 dark:hover:ring-primary-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-900/30">
                        <FontAwesomeIcon icon={faWheatAwn} className="h-4 w-4 text-primary-600 dark:text-primary-400" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-medium capitalize text-gray-900 dark:text-gray-100">{c.tipoGrano}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {c.hectareas} ha · ${c.capitalRequerido.toLocaleString()} USDC
                        </p>
                      </div>
                    </div>
                    <Badge status={c.estado} />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
