import { apiClient } from '@/lib/axios'
import type {
  AvanzarCicloInput, AvanzarCicloResult, OracleEstado,
  ChainlinkResolverInput, ChainlinkPendingResult,
} from './types'
import { adaptAvanzarResult, adaptOracleEstado, adaptChainlinkResult } from './types'

export const oracleApi = {
  avanzarCiclo: (data: AvanzarCicloInput): Promise<AvanzarCicloResult> =>
    apiClient
      .post('/oracle/avanzar', data, { timeout: 90_000 })
      .then((r) => adaptAvanzarResult(r.data)),

  avanzarChainlink: (data: ChainlinkResolverInput): Promise<ChainlinkPendingResult> =>
    apiClient
      .post('/oracle/avanzar-chainlink', data, { timeout: 90_000 })
      .then((r) => adaptChainlinkResult(r.data)),

  getEstado: (vaultAddress: string): Promise<OracleEstado> =>
    apiClient
      .get(`/oracle/estado/${vaultAddress}`)
      .then((r) => adaptOracleEstado(r.data)),
}
