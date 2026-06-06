export type CosechaEstado = 'PENDIENTE' | 'MINTED' | 'ACTIVE' | 'MATURE' | 'LIQUIDATED' | 'DEFAULTED'

export interface Cosecha {
  id: number
  farmId: string
  propietarioId: number
  tipoGrano: string
  hectareas: number
  rendimientoKg: number
  capitalRequerido: number
  fechaCosecha: string
  nftTokenId: number | null
  txHashMint: string | null
  estado: CosechaEstado
  latitud: number | null
  longitud: number | null
  creacion: string | null
}

export interface CrearCosechaInput {
  tipo_grano: string
  hectareas: number
  rendimiento_kg: number
  capital_requerido: number
  fecha_cosecha: string
  latitud?: number
  longitud?: number
}

export interface PaginacionCosechas {
  page: number | null
  per_page: number | null
  total: number
  pages: number | null
  data: Cosecha[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function adaptCosecha(raw: any): Cosecha {
  return {
    id: raw.id,
    farmId: raw.farm_id,
    propietarioId: raw.propietario_id,
    tipoGrano: raw.tipo_grano,
    hectareas: Number(raw.hectareas),
    rendimientoKg: Number(raw.rendimiento_kg),
    capitalRequerido: Number(raw.capital_requerido),
    fechaCosecha: raw.fecha_cosecha,
    nftTokenId: raw.nft_token_id ?? null,
    txHashMint: raw.tx_hash_mint ?? null,
    estado: raw.estado,
    latitud: raw.latitud ?? null,
    longitud: raw.longitud ?? null,
    creacion: raw.creacion ?? null,
  }
}
