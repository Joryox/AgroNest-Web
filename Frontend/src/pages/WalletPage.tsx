import { Link } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBuildingColumns, faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { WalletCard, PortfolioSummary, TxHistoryList } from '@/features/wallet'
import { useMisInversiones } from '@/features/inversiones'
import type { TxEntry } from '@/features/wallet'
import { PageTransition, Button, Card } from '@/shared/components'
import { useEtherfuseCustomer, useEtherfuseOrdenes } from '@/features/etherfuse'

export function WalletPage() {
  const { data: inversiones, isLoading } = useMisInversiones()
  const { data: etherfuseCliente } = useEtherfuseCustomer()
  const { data: etherfuseOrdenes } = useEtherfuseOrdenes()

  const cetesBalance = (etherfuseOrdenes?.data ?? [])
    .filter((o) => o.tipo === 'onramp' && o.status === 'completed')
    .reduce((s, o) => s + (o.destinationAmount ?? 0), 0)

  const investments = (inversiones?.data ?? []).map((inv) => ({
    montoUsdc: inv.montoUsdc,
    bcropRecibido: inv.bcropRecibido,
    reclamado: inv.reclamado,
    montoReclamado: inv.montoReclamado,
  }))

  const txEntries: TxEntry[] = (inversiones?.data ?? []).flatMap((inv) => {
    const entries: TxEntry[] = []
    if (inv.txHashDeposit) {
      entries.push({
        hash: inv.txHashDeposit,
        type: 'invest',
        amount: `$${inv.montoUsdc} USDC`,
        date: inv.creacion ?? undefined,
      })
    }
    if (inv.txHashClaim) {
      entries.push({
        hash: inv.txHashClaim,
        type: 'claim',
        amount: `$${inv.montoReclamado} USDC`,
      })
    }
    return entries
  })

  return (
    <PageTransition>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Mi Dinero</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Consulta tu saldo y el resumen de todo tu dinero
          </p>
        </div>

        <WalletCard />

        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Resumen de Apoyos</h2>
          <PortfolioSummary investments={investments} isLoading={isLoading} />
        </div>

        {/* CETES Section */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
            <FontAwesomeIcon icon={faBuildingColumns} className="text-emerald-500" />
            Ahorro Seguro (CETES)
            <span className="text-[10px] font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded border border-green-200 uppercase tracking-wider">
              Powered by Etherfuse (MXNb)
            </span>
          </h2>
          {etherfuseCliente ? (
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Mi Ahorro Acumulado</p>
                  <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    {cetesBalance.toFixed(4)} CETES
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">KYC: {etherfuseCliente.kycStatus}</p>
                </div>
                <div className="flex gap-2">
                  <Link to="/etherfuse/onramp">
                    <Button size="sm">
                      <FontAwesomeIcon icon={faArrowDown} className="h-3.5 w-3.5" />
                      Comprar
                    </Button>
                  </Link>
                  <Link to="/etherfuse/offramp">
                    <Button size="sm" variant="secondary">
                      <FontAwesomeIcon icon={faArrowUp} className="h-3.5 w-3.5" />
                      Retirar
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          ) : (
            <Card>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Abre tu cuenta de ahorro sin costo extra.
                </p>
                <Link to="/etherfuse/onboarding">
                  <Button size="sm">Abrir Cuenta de Ahorro</Button>
                </Link>
              </div>
            </Card>
          )}
        </div>

        <div>
          <h2 className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">Historial de transacciones</h2>
          <TxHistoryList entries={txEntries} />
        </div>
      </div>
    </PageTransition>
  )
}
