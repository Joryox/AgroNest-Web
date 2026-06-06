export interface OracleEstado {
  vaultAddress: string
  oracleState: number
  oracleStateNombre: string
}

export interface AvanzarCicloInput {
  cosecha_id: number
  exito?: boolean
}

export interface AvanzarCicloResult {
  cosechaId: number
  vaultAddress: string
  estadoAnterior?: string
  estadoNuevo: string
  txHash: string | null
  mensaje: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function adaptOracleEstado(raw: any): OracleEstado {
  return {
    vaultAddress: raw.vault_address,
    oracleState: raw.oracle_state,
    oracleStateNombre: raw.oracle_state_nombre,
  }
}

export interface ChainlinkResolverInput {
  cosecha_id: number
  lat?: string
  lon?: string
}

export interface ChainlinkPendingResult {
  cosechaId: number
  vaultAddress: string
  estadoActual: string
  txHash: string
  lat: string
  lon: string
  status: 'pending_chainlink'
  mensaje: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function adaptChainlinkResult(raw: any): ChainlinkPendingResult {
  return {
    cosechaId:    raw.cosecha_id,
    vaultAddress: raw.vault_address,
    estadoActual: raw.estado_actual,
    txHash:       raw.tx_hash,
    lat:          raw.lat,
    lon:          raw.lon,
    status:       'pending_chainlink',
    mensaje:      raw.mensaje,
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function adaptAvanzarResult(raw: any): AvanzarCicloResult {
  return {
    cosechaId: raw.cosecha_id,
    vaultAddress: raw.vault_address,
    estadoAnterior: raw.estado_anterior ?? undefined,
    estadoNuevo: raw.nuevo_estado,
    txHash: raw.tx_hash ?? null,
    mensaje: raw.mensaje ?? 'Estado avanzado correctamente',
  }
}
