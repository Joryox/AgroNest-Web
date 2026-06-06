export interface Inversion {
  id: number
  inversorId: number
  cosechaId: number
  montoUsdc: number
  bcropRecibido: number
  txHashDeposit: string | null
  reclamado: boolean
  montoReclamado: number
  txHashClaim: string | null
  creacion: string | null
}

export interface InvertirInput {
  cosecha_id: number
  monto_usdc: number
}

export interface PaginacionInversiones {
  page: number | null
  per_page: number | null
  total: number
  pages: number | null
  data: Inversion[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function adaptInversion(raw: any): Inversion {
  return {
    id: raw.id,
    inversorId: raw.inversor_id,
    cosechaId: raw.cosecha_id,
    montoUsdc: Number(raw.monto_usdc),
    bcropRecibido: Number(raw.bcrop_recibido ?? 0),
    txHashDeposit: raw.tx_hash_deposit ?? null,
    reclamado: raw.reclamado ?? false,
    montoReclamado: Number(raw.monto_reclamado ?? 0),
    txHashClaim: raw.tx_hash_claim ?? null,
    creacion: raw.creacion ?? null,
  }
}
