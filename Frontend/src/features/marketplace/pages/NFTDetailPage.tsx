import { useParams, useNavigate } from 'react-router'
import { useState } from 'react'
import { isAxiosError } from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faWheatAwn, faTag, faGavel, faCoins, faExternalLinkAlt,
  faShoppingCart, faBan,
} from '@fortawesome/free-solid-svg-icons'
import { Button, Badge, Card, PageTransition, Spinner, ConfirmDialog } from '@/shared/components'
import { useAuthStore } from '@/features/auth'
import { useListing, useCancelarListing } from '../hooks'

export function NFTDetailPage() {
  const { id } = useParams<{ id: string }>()
  const listingId = Number(id)
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { data: listing, isLoading, isError } = useListing(listingId)
  const cancelar = useCancelarListing()
  const [confirmCancel, setConfirmCancel] = useState(false)

  const cancelarError = cancelar.isError && isAxiosError(cancelar.error)
    ? (cancelar.error.response?.data?.detail ?? 'Error al cancelar.')
    : cancelar.isError ? 'Error al cancelar.' : null

  if (isLoading) return <div className="flex justify-center py-16"><Spinner /></div>
  if (isError || !listing) {
    return (
      <div className="text-center py-16 space-y-4">
        <p className="text-gray-500 dark:text-gray-400">Listing no encontrado.</p>
        <Button variant="secondary" onClick={() => navigate('/marketplace')}>Volver al marketplace</Button>
      </div>
    )
  }

  const isOwner = user?.id === listing.vendedorId
  const isAuction = listing.tipo === 'AUCTION'
  const endDate = listing.auctionEndTime ? new Date(listing.auctionEndTime) : null
  const auctionActive = endDate ? endDate > new Date() : false

  async function handleBuy() {
    if (!window.ethereum) {
      alert('Instala MetaMask para realizar compras.')
      return
    }
    alert('Integra la llamada al contrato Rare Protocol Marketplace para ejecutar la compra.')
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl space-y-6">
        <button
          type="button"
          onClick={() => navigate('/marketplace')}
          className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
        >
          ← Volver al marketplace
        </button>

        {/* NFT visual */}
        <div className="flex h-64 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40 shadow-md">
          <FontAwesomeIcon icon={faWheatAwn} className="h-28 w-28 text-primary-400 dark:text-primary-500 opacity-60" />
        </div>

        {/* Info */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Cosecha NFT #{listing.tokenId}
            </h1>
            <p className="text-sm text-gray-400 font-mono mt-1">
              Token ID: {listing.tokenId} · Contrato: {listing.contractAddress.slice(0, 10)}…{listing.contractAddress.slice(-6)}
            </p>
          </div>
          <Badge status={listing.estado} />
        </div>

        {/* Precio y acción */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-xs text-gray-400">{isAuction ? 'Oferta actual / inicio' : 'Precio de venta'}</p>
              <div className="flex items-center gap-2 mt-1">
                <FontAwesomeIcon icon={faCoins} className="h-5 w-5 text-primary-500" />
                <span className="text-2xl font-bold text-primary-700 dark:text-primary-300">
                  {listing.precio?.toFixed(4) ?? '—'}
                </span>
                <span className="text-gray-400">{listing.currency}</span>
              </div>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isAuction
                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
            }`}>
              <FontAwesomeIcon icon={isAuction ? faGavel : faTag} className="h-3 w-3 mr-1" />
              {isAuction ? 'Subasta' : 'Precio fijo'}
            </span>
          </div>

          {isAuction && endDate && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {auctionActive
                ? `Subasta activa hasta: ${endDate.toLocaleString('es-MX')}`
                : 'Subasta finalizada'}
            </p>
          )}

          {listing.estado === 'ACTIVE' && !isOwner && (
            <Button onClick={handleBuy} className="w-full">
              <FontAwesomeIcon icon={isAuction ? faGavel : faShoppingCart} className="h-4 w-4" />
              {isAuction ? 'Pujar' : 'Comprar ahora'}
            </Button>
          )}

          {listing.estado === 'ACTIVE' && isOwner && (
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => setConfirmCancel(true)}
                isLoading={cancelar.isPending}
                className="text-red-600 border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-900/20"
              >
                <FontAwesomeIcon icon={faBan} className="h-4 w-4" />
                Cancelar listing
              </Button>
            </div>
          )}

          {cancelarError && (
            <p role="alert" className="mt-3 rounded-lg bg-red-50 dark:bg-red-900/20 px-3 py-2 text-sm text-red-700 dark:text-red-400">
              {cancelarError}
            </p>
          )}
        </Card>

        {/* On-chain info */}
        {listing.listingId && (
          <Card header={<h2 className="font-semibold text-gray-700 dark:text-gray-300">Información on-chain</h2>}>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Listing ID on-chain</span>
                <span className="font-mono">{listing.listingId.slice(0, 16)}…</span>
              </div>
              {listing.txHash && (
                <div className="flex justify-between">
                  <span className="text-gray-500">TX Hash</span>
                  <a
                    href={`https://sepolia.etherscan.io/tx/${listing.txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary-600 dark:text-primary-400 hover:underline font-mono"
                  >
                    {listing.txHash.slice(0, 10)}…
                    <FontAwesomeIcon icon={faExternalLinkAlt} className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </Card>
        )}

        <ConfirmDialog
          open={confirmCancel}
          title="¿Cancelar este listing?"
          description="El NFT dejará de estar disponible en el marketplace. Esta acción puede requerir una transacción on-chain."
          confirmLabel="Sí, cancelar listing"
          onConfirm={() => {
            setConfirmCancel(false)
            cancelar.mutate(listingId, { onSuccess: () => navigate('/marketplace') })
          }}
          onCancel={() => setConfirmCancel(false)}
        />
      </div>
    </PageTransition>
  )
}
