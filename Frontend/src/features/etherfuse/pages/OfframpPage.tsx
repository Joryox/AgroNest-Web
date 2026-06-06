import { useState } from 'react'
import { useNavigate } from 'react-router'
import { isAxiosError } from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowUp, faMoneyBillWave, faClock } from '@fortawesome/free-solid-svg-icons'
import { Button, Card, Input, PageTransition, ConfirmDialog, ProgressBar } from '@/shared/components'
import { useWalletStore } from '@/features/wallet'
import { useEtherfuseCustomer, useEtherfuseAssets, useCrearQuote, useCrearOrden } from '../hooks'
import type { EtherfuseQuote } from '../types'

export function OfframpPage() {
  const navigate = useNavigate()
  const metaMaskAddress = useWalletStore((s) => s.metaMaskAddress)
  const { data: cliente } = useEtherfuseCustomer()
  const { data: assets } = useEtherfuseAssets()

  const [monto, setMonto] = useState('')
  const [quote, setQuote] = useState<EtherfuseQuote | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [completedOrder, setCompletedOrder] = useState<{
    orderId: string
    burnTransaction: string | null
    statusPageUrl: string | null
  } | null>(null)

  const crearQuote = useCrearQuote()
  const crearOrden = useCrearOrden()

  const cetesAsset = assets?.find((a) => a.symbol?.includes('CETES') || a.name?.includes('CETES') || a.name?.includes('cetes'))

  const quoteError = crearQuote.isError && isAxiosError(crearQuote.error)
    ? (crearQuote.error.response?.data?.detail ?? 'Error al obtener cotización.')
    : crearQuote.isError ? 'Error al obtener cotización.' : null

  const ordenError = crearOrden.isError && isAxiosError(crearOrden.error)
    ? (crearOrden.error.response?.data?.detail ?? 'Error al crear la orden.')
    : crearOrden.isError ? 'Error al crear la orden.' : null

  if (!cliente) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center space-y-4">
        <p className="text-gray-500 dark:text-gray-400">Primero completa el proceso de verificación KYC.</p>
        <Button onClick={() => navigate('/etherfuse/onboarding')}>Ir al onboarding</Button>
      </div>
    )
  }

  async function handleGetQuote(e: React.FormEvent) {
    e.preventDefault()
    if (!cetesAsset || !monto) return
    setQuote(null)
    try {
      const q = await crearQuote.mutateAsync({
        tipo: 'offramp',
        sourceAsset: cetesAsset.identifier,
        targetAsset: 'MXN',
        amount: parseFloat(monto),
      })
      setQuote(q)
    } catch { /* handled */ }
  }

  async function handleOrden() {
    if (!quote || !metaMaskAddress) return
    setConfirmOpen(false)
    try {
      const orden = await crearOrden.mutateAsync({
        quoteId: quote.quoteId,
        walletAddress: metaMaskAddress,
      })
      setCompletedOrder({
        orderId: orden.orderId,
        burnTransaction: orden.burnTransaction,
        statusPageUrl: orden.statusPageUrl,
      })
    } catch { /* handled */ }
  }

  if (completedOrder) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-xl space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Orden de retiro creada</h1>
          <Card>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Orden <span className="font-mono font-medium">{completedOrder.orderId.slice(0, 12)}…</span>
              </p>

              {completedOrder.burnTransaction && (
                <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-4 space-y-2">
                  <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">Firma la transacción de quema</p>
                  <p className="text-xs text-amber-700 dark:text-amber-400">
                    Etherfuse proporcionó la transacción de quema pre-construida. Debes firmarla con MetaMask para liberar los fondos.
                  </p>
                  <Button
                    size="sm"
                    onClick={async () => {
                      if (!window.ethereum || !completedOrder.burnTransaction) return
                      try {
                        await window.ethereum.request({
                          method: 'eth_sendTransaction',
                          params: [JSON.parse(completedOrder.burnTransaction)],
                        })
                        navigate('/etherfuse/portfolio')
                      } catch (err) {
                        console.error('Error al firmar burn tx:', err)
                      }
                    }}
                  >
                    Firmar con MetaMask
                  </Button>
                </div>
              )}

              {completedOrder.statusPageUrl && (
                <div>
                  <p className="text-xs text-gray-500 mb-1">Monitorea el estado:</p>
                  <a
                    href={completedOrder.statusPageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
                  >
                    Ver estado en Etherfuse
                  </a>
                </div>
              )}

              <Button variant="secondary" size="sm" onClick={() => navigate('/etherfuse/portfolio')}>
                Ver portafolio
              </Button>
            </div>
          </Card>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Retirar a banco</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Convierte tus CETES tokenizados de vuelta a pesos mexicanos en tu cuenta CLABE.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span className="rounded-lg bg-primary-100 dark:bg-primary-900/30 px-3 py-1.5 font-medium text-primary-700 dark:text-primary-300">
            CETES
          </span>
          <FontAwesomeIcon icon={faArrowUp} className="h-4 w-4 text-primary-500" />
          <span className="rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1.5 font-medium">MXN</span>
        </div>

        <form onSubmit={handleGetQuote} className="space-y-4">
          <Input
            label="Monto en CETES"
            type="number"
            min="0.000001"
            step="0.000001"
            value={monto}
            onChange={(e) => { setMonto(e.target.value); setQuote(null) }}
            placeholder="ej. 100.00"
            required
            helperText="Cantidad de CETES a convertir"
          />
          <Button type="submit" isLoading={crearQuote.isPending} disabled={!monto}>
            <FontAwesomeIcon icon={faMoneyBillWave} className="h-4 w-4" />
            Obtener cotización
          </Button>
        </form>

        {quoteError && (
          <p role="alert" className="rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
            {quoteError}
          </p>
        )}

        {quote && (
          <Card>
            <h2 className="mb-3 font-semibold text-gray-800 dark:text-gray-200">Cotización de retiro</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Quemas</span>
                <span className="font-medium">{quote.amount.toFixed(6)} CETES</span>
              </div>
              {quote.exchangeRate && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Tipo de cambio</span>
                  <span className="font-medium">1 CETES = {quote.exchangeRate.toFixed(4)} MXN</span>
                </div>
              )}
              {quote.feeBps && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Comisión</span>
                  <span className="font-medium">{quote.feeBps / 100}% ({quote.feeAmount?.toFixed(4)} CETES)</span>
                </div>
              )}
              {quote.destinationAmount && (
                <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Recibes en banco</span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    ${quote.destinationAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })} MXN
                  </span>
                </div>
              )}
              {quote.expiresAt && (
                <p className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 pt-1">
                  <FontAwesomeIcon icon={faClock} className="h-3 w-3" />
                  Cotización válida por 2 minutos
                </p>
              )}
            </div>
            <Button className="mt-4" onClick={() => setConfirmOpen(true)}>
              Ejecutar offramp
            </Button>
          </Card>
        )}

        {crearOrden.isPending && (
          <div className="space-y-2" aria-live="polite">
            <ProgressBar />
            <p className="text-xs text-primary-600 dark:text-primary-400">Creando orden de retiro…</p>
          </div>
        )}

        {ordenError && (
          <p role="alert" className="rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
            {ordenError}
          </p>
        )}

        <ConfirmDialog
          open={confirmOpen}
          title="¿Confirmar retiro de CETES?"
          description={`Quemarás ${parseFloat(monto).toFixed(6)} CETES y recibirás ${quote?.destinationAmount?.toLocaleString(undefined, { minimumFractionDigits: 2 }) ?? '—'} MXN. Deberás firmar la transacción de quema con MetaMask.`}
          confirmLabel="Sí, retirar a banco"
          onConfirm={handleOrden}
          onCancel={() => setConfirmOpen(false)}
        />
      </div>
    </PageTransition>
  )
}
