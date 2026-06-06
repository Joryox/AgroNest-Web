import { useState } from 'react'
import { useNavigate } from 'react-router'
import { isAxiosError } from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowDown, faCoins, faClock } from '@fortawesome/free-solid-svg-icons'
import { Button, Card, Input, PageTransition, ConfirmDialog, ProgressBar } from '@/shared/components'
import { useWalletStore } from '@/features/wallet'
import { useEtherfuseCustomer, useEtherfuseAssets, useCrearQuote, useCrearOrden, useSimularFiat } from '../hooks'
import type { EtherfuseQuote } from '../types'

export function OnrampPage() {
  const navigate = useNavigate()
  const metaMaskAddress = useWalletStore((s) => s.metaMaskAddress)
  const { data: cliente } = useEtherfuseCustomer()
  const { data: assets } = useEtherfuseAssets()

  const [monto, setMonto] = useState('')
  const [quote, setQuote] = useState<EtherfuseQuote | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [completedOrder, setCompletedOrder] = useState<{ orderId: string; depositClabe: string | null } | null>(null)

  const crearQuote = useCrearQuote()
  const crearOrden = useCrearOrden()
  const simularFiat = useSimularFiat()

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
        tipo: 'onramp',
        sourceAsset: 'MXN',
        targetAsset: cetesAsset.identifier,
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
      setCompletedOrder({ orderId: orden.orderId, depositClabe: orden.depositClabe })
    } catch { /* handled */ }
  }

  if (completedOrder) {
    return (
      <PageTransition>
        <div className="mx-auto max-w-xl space-y-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Orden creada</h1>
          <Card>
            <div className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Orden <span className="font-mono font-medium">{completedOrder.orderId.slice(0, 12)}…</span> creada correctamente.
              </p>
              {completedOrder.depositClabe && (
                <div className="rounded-lg bg-primary-50 dark:bg-primary-900/20 p-4">
                  <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-1">CLABE de depósito:</p>
                  <p className="font-mono text-lg font-bold text-primary-800 dark:text-primary-200">{completedOrder.depositClabe}</p>
                  <p className="mt-2 text-xs text-gray-500">Deposita MXN a esta CLABE para recibir CETES on-chain.</p>
                </div>
              )}
              <div className="flex gap-3">
                <Button
                  size="sm"
                  onClick={() => simularFiat.mutate(completedOrder.orderId, { onSuccess: () => navigate('/etherfuse/portfolio') })}
                  isLoading={simularFiat.isPending}
                >
                  Simular pago (sandbox)
                </Button>
                <Button variant="secondary" size="sm" onClick={() => navigate('/etherfuse/portfolio')}>
                  Ver portafolio
                </Button>
              </div>
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Comprar CETES</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Convierte pesos mexicanos en CETES tokenizados con rendimiento del gobierno.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span className="rounded-lg bg-gray-100 dark:bg-gray-800 px-3 py-1.5 font-medium">MXN</span>
          <FontAwesomeIcon icon={faArrowDown} className="h-4 w-4 text-primary-500" />
          <span className="rounded-lg bg-primary-100 dark:bg-primary-900/30 px-3 py-1.5 font-medium text-primary-700 dark:text-primary-300">
            CETES
          </span>
        </div>

        <form onSubmit={handleGetQuote} className="space-y-4">
          <Input
            label="Monto en MXN"
            type="number"
            min="1"
            step="0.01"
            value={monto}
            onChange={(e) => { setMonto(e.target.value); setQuote(null) }}
            placeholder="ej. 1000"
            required
            helperText="Monto a convertir a CETES"
          />
          <Button type="submit" isLoading={crearQuote.isPending} disabled={!monto}>
            <FontAwesomeIcon icon={faCoins} className="h-4 w-4" />
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
            <h2 className="mb-3 font-semibold text-gray-800 dark:text-gray-200">Cotización</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Pagas</span>
                <span className="font-medium">{quote.amount.toLocaleString()} MXN</span>
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
                  <span className="font-medium">{quote.feeBps / 100}% ({quote.feeAmount?.toFixed(2)} MXN)</span>
                </div>
              )}
              {quote.destinationAmount && (
                <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2">
                  <span className="font-semibold text-gray-800 dark:text-gray-200">Recibes</span>
                  <span className="font-bold text-primary-600 dark:text-primary-400">
                    {quote.destinationAmount.toFixed(6)} CETES
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
              Ejecutar onramp
            </Button>
          </Card>
        )}

        {crearOrden.isPending && (
          <div className="space-y-2" aria-live="polite">
            <ProgressBar />
            <p className="text-xs text-primary-600 dark:text-primary-400">Creando orden Etherfuse…</p>
          </div>
        )}

        {ordenError && (
          <p role="alert" className="rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
            {ordenError}
          </p>
        )}

        <ConfirmDialog
          open={confirmOpen}
          title={`¿Confirmar compra de CETES?`}
          description={`Pagarás ${parseFloat(monto).toLocaleString()} MXN y recibirás ${quote?.destinationAmount?.toFixed(6) ?? '—'} CETES. La cotización expira en 2 minutos.`}
          confirmLabel="Sí, comprar CETES"
          onConfirm={handleOrden}
          onCancel={() => setConfirmOpen(false)}
        />
      </div>
    </PageTransition>
  )
}
