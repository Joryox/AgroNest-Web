import { apiClient } from '@/lib/axios'
import { adaptBoveda } from './types'
import type { AbrirBovedaInput, Boveda } from './types'

export const bovedaApi = {
  abrir: (data: AbrirBovedaInput) =>
    apiClient
      .post<Boveda>('/boveda', data, { timeout: 90_000 })
      .then((r) => adaptBoveda(r.data)),

  porCosecha: (cosechaId: number) =>
    apiClient.get(`/boveda/cosecha/${cosechaId}`).then((r) => adaptBoveda(r.data)),

  detalle: (id: number) =>
    apiClient.get(`/boveda/${id}`).then((r) => adaptBoveda(r.data)),

  estadoChain: (id: number) =>
    apiClient.get(`/boveda/${id}/chain`).then((r) => r.data),

  todas: (): Promise<Boveda[]> =>
    apiClient.get('/boveda').then((r) =>
      (r.data?.data ?? r.data ?? []).map(adaptBoveda)
    ),
}
