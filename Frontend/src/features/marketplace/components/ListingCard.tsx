import { Link } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWheatAwn, faTag, faGavel, faCoins } from '@fortawesome/free-solid-svg-icons'
import type { NftListing } from '../types'

interface Props {
  listing: NftListing
}

export function ListingCard({ listing }: Props) {
  const isAuction = listing.tipo === 'AUCTION'
  const endDate = listing.auctionEndTime ? new Date(listing.auctionEndTime) : null
  const auctionEnded = endDate ? endDate < new Date() : false

  return (
    <Link
      to={`/marketplace/${listing.id}`}
      className="block rounded-xl bg-white dark:bg-gray-800 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700
                 transition-all hover:shadow-md hover:ring-primary-300 dark:hover:ring-primary-600"
    >
      {/* NFT image placeholder */}
      <div className="flex h-40 items-center justify-center rounded-t-xl bg-gradient-to-br from-primary-100 to-primary-200 dark:from-primary-900/40 dark:to-primary-800/40">
        <FontAwesomeIcon icon={faWheatAwn} className="h-16 w-16 text-primary-400 dark:text-primary-500 opacity-60" />
      </div>

      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
              Cosecha NFT #{listing.tokenId}
            </p>
            <p className="text-xs text-gray-400 font-mono">
              {listing.contractAddress.slice(0, 8)}…{listing.contractAddress.slice(-6)}
            </p>
          </div>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${
            isAuction
              ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
              : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
          }`}>
            <FontAwesomeIcon icon={isAuction ? faGavel : faTag} className="h-3 w-3 mr-1" />
            {isAuction ? 'Subasta' : 'Precio fijo'}
          </span>
        </div>

        {listing.precio && (
          <div className="flex items-center gap-1.5">
            <FontAwesomeIcon icon={faCoins} className="h-4 w-4 text-primary-500" />
            <span className="font-bold text-primary-700 dark:text-primary-300 text-lg">
              {listing.precio.toFixed(4)}
            </span>
            <span className="text-sm text-gray-400">{listing.currency}</span>
          </div>
        )}

        {isAuction && endDate && (
          <p className="text-xs text-gray-400">
            {auctionEnded ? 'Subasta finalizada' : `Termina: ${endDate.toLocaleDateString('es-MX')}`}
          </p>
        )}
      </div>
    </Link>
  )
}
