export type BovedaEstado = 'PENDIENTE' | 'OPEN' | 'FUNDED' | 'ACTIVE' | 'MATURE' | 'LIQUIDATED' | 'DEFAULTED'

export interface Boveda {
  id: number
  cosechaId: number
  vaultId: number | null
  vaultAddress: string | null
  bcropAddress: string | null
  metaFinanciamiento: number
  plazoDias: number
  porcentajeReserva: number
  porcentajeRendimiento: number
  fechaLimite: string | null
  estado: BovedaEstado
  totalRecaudado: number
  txHashOpen: string | null
}

export interface AbrirBovedaInput {
  cosecha_id: number
  plazo_dias: number
  porcentaje_reserva: number
  porcentaje_rendimiento: number
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function adaptBoveda(raw: any): Boveda {
  return {
    id: raw.id,
    cosechaId: raw.cosecha_id,
    vaultId: raw.vault_id ?? null,
    vaultAddress: raw.vault_address ?? null,
    bcropAddress: raw.bcrop_address ?? null,
    metaFinanciamiento: Number(raw.meta_financiamiento),
    plazoDias: raw.plazo_dias,
    porcentajeReserva: Number(raw.porcentaje_reserva),
    porcentajeRendimiento: Number(raw.porcentaje_rendimiento),
    fechaLimite: raw.fecha_limite ?? null,
    estado: raw.estado,
    totalRecaudado: Number(raw.total_recaudado ?? 0),
    txHashOpen: raw.tx_hash_open ?? null,
  }
}
