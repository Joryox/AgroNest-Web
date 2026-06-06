export interface NftListing {
  id: number
  cosechaId: number
  vendedorId: number
  tokenId: number
  contractAddress: string
  precio: number | null
  currency: string
  tipo: 'FIXED' | 'AUCTION'
  estado: 'ACTIVE' | 'SOLD' | 'CANCELLED'
  listingId: string | null
  auctionEndTime: string | null
  txHash: string | null
  creacion: string | null
}

export interface PaginacionListings {
  page: number | null
  perPage: number | null
  total: number
  pages: number | null
  data: NftListing[]
}

// Raw snake_case from backend
export interface RawListing {
  id: number
  cosecha_id: number
  vendedor_id: number
  token_id: number
  contract_address: string
  precio: string | null
  currency: string
  tipo: string
  estado: string
  listing_id: string | null
  auction_end_time: string | null
  tx_hash: string | null
  creacion: string | null
}

export interface RawPaginacionListings {
  page: number | null
  per_page: number | null
  total: number
  pages: number | null
  data: RawListing[]
}

export function adaptListing(raw: RawListing): NftListing {
  return {
    id: raw.id,
    cosechaId: raw.cosecha_id,
    vendedorId: raw.vendedor_id,
    tokenId: raw.token_id,
    contractAddress: raw.contract_address,
    precio: raw.precio ? parseFloat(raw.precio) : null,
    currency: raw.currency,
    tipo: raw.tipo as NftListing['tipo'],
    estado: raw.estado as NftListing['estado'],
    listingId: raw.listing_id,
    auctionEndTime: raw.auction_end_time,
    txHash: raw.tx_hash,
    creacion: raw.creacion,
  }
}

export function adaptPaginacionListings(raw: RawPaginacionListings): PaginacionListings {
  return {
    page: raw.page,
    perPage: raw.per_page,
    total: raw.total,
    pages: raw.pages,
    data: raw.data.map(adaptListing),
  }
}
