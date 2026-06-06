// ─── Etherfuse API types ───────────────────────────────────────────────────

export interface EtherfuseCliente {
  id: number
  customerId: string
  bankAccountId: string | null
  kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
  walletAddress: string | null
  creacion: string | null
}

export interface EtherfuseOnboardingResult {
  customerId: string
  bankAccountId: string
  kycStatus: string
  presignedUrl: string | null
}

export interface EtherfuseAsset {
  identifier: string
  name: string
  symbol: string
  chain: string
  decimals: number
}

export interface EtherfuseQuote {
  quoteId: string
  tipo: string
  sourceAsset: string
  targetAsset: string
  amount: number
  exchangeRate: number | null
  feeBps: number | null
  feeAmount: number | null
  destinationAmount: number | null
  expiresAt: string | null
}

export interface EtherfuseOrden {
  id: number
  orderId: string
  quoteId: string
  tipo: 'onramp' | 'offramp'
  status: 'created' | 'funded' | 'completed' | 'finalized'
  sourceAsset: string
  targetAsset: string
  sourceAmount: number
  destinationAmount: number | null
  exchangeRate: number | null
  feeBps: number | null
  feeAmount: number | null
  depositClabe: string | null
  burnTransaction: string | null
  statusPageUrl: string | null
  creacion: string | null
}

export interface PaginacionOrdenes {
  page: number | null
  perPage: number | null
  total: number
  pages: number | null
  data: EtherfuseOrden[]
}

// ─── Raw snake_case from backend ──────────────────────────────────────────

export interface RawCliente {
  id: number
  customer_id: string
  bank_account_id: string | null
  kyc_status: string
  wallet_address: string | null
  creacion: string | null
}

export interface RawOnboardingResult {
  customer_id: string
  bank_account_id: string
  kyc_status: string
  presigned_url: string | null
}

export interface RawQuote {
  quote_id: string
  tipo: string
  source_asset: string
  target_asset: string
  amount: string
  exchange_rate: string | null
  fee_bps: number | null
  fee_amount: string | null
  destination_amount: string | null
  expires_at: string | null
}

export interface RawOrden {
  id: number
  order_id: string
  quote_id: string
  tipo: string
  status: string
  source_asset: string
  target_asset: string
  source_amount: string
  destination_amount: string | null
  exchange_rate: string | null
  fee_bps: number | null
  fee_amount: string | null
  deposit_clabe: string | null
  burn_transaction: string | null
  status_page_url: string | null
  creacion: string | null
}

export interface RawPaginacion {
  page: number | null
  per_page: number | null
  total: number
  pages: number | null
  data: RawOrden[]
}

// ─── Adapters ──────────────────────────────────────────────────────────────

export function adaptCliente(raw: RawCliente): EtherfuseCliente {
  return {
    id: raw.id,
    customerId: raw.customer_id,
    bankAccountId: raw.bank_account_id,
    kycStatus: raw.kyc_status as EtherfuseCliente['kycStatus'],
    walletAddress: raw.wallet_address,
    creacion: raw.creacion,
  }
}

export function adaptOnboarding(raw: RawOnboardingResult): EtherfuseOnboardingResult {
  return {
    customerId: raw.customer_id,
    bankAccountId: raw.bank_account_id,
    kycStatus: raw.kyc_status,
    presignedUrl: raw.presigned_url,
  }
}

export function adaptQuote(raw: RawQuote): EtherfuseQuote {
  return {
    quoteId: raw.quote_id,
    tipo: raw.tipo,
    sourceAsset: raw.source_asset,
    targetAsset: raw.target_asset,
    amount: parseFloat(raw.amount),
    exchangeRate: raw.exchange_rate ? parseFloat(raw.exchange_rate) : null,
    feeBps: raw.fee_bps,
    feeAmount: raw.fee_amount ? parseFloat(raw.fee_amount) : null,
    destinationAmount: raw.destination_amount ? parseFloat(raw.destination_amount) : null,
    expiresAt: raw.expires_at,
  }
}

export function adaptOrden(raw: RawOrden): EtherfuseOrden {
  return {
    id: raw.id,
    orderId: raw.order_id,
    quoteId: raw.quote_id,
    tipo: raw.tipo as EtherfuseOrden['tipo'],
    status: raw.status as EtherfuseOrden['status'],
    sourceAsset: raw.source_asset,
    targetAsset: raw.target_asset,
    sourceAmount: parseFloat(raw.source_amount),
    destinationAmount: raw.destination_amount ? parseFloat(raw.destination_amount) : null,
    exchangeRate: raw.exchange_rate ? parseFloat(raw.exchange_rate) : null,
    feeBps: raw.fee_bps,
    feeAmount: raw.fee_amount ? parseFloat(raw.fee_amount) : null,
    depositClabe: raw.deposit_clabe,
    burnTransaction: raw.burn_transaction,
    statusPageUrl: raw.status_page_url,
    creacion: raw.creacion,
  }
}

export function adaptPaginacion(raw: RawPaginacion): PaginacionOrdenes {
  return {
    page: raw.page,
    perPage: raw.per_page,
    total: raw.total,
    pages: raw.pages,
    data: raw.data.map(adaptOrden),
  }
}
