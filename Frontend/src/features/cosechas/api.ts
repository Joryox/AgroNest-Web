import { apiClient } from '@/lib/axios'
import { adaptCosecha } from './types'
import type { Cosecha, CrearCosechaInput, PaginacionCosechas } from './types'

function adaptPage(raw: any): PaginacionCosechas {
  return {
    page: raw.page ?? null,
    per_page: raw.per_page ?? null,
    total: raw.total ?? 0,
    pages: raw.pages ?? null,
    data: (raw.data ?? []).map(adaptCosecha),
  }
}

export const cosechasApi = {
  registrar: (data: CrearCosechaInput) =>
    apiClient
      .post<Cosecha>('/cosechas', data, { timeout: 90_000 })
      .then((r) => adaptCosecha(r.data)),

  misCosechas: (page = 1, perPage = 20) =>
    apiClient
      .get(`/cosechas/mis_cosechas?page=${page}&per_page=${perPage}`)
      .then((r) => adaptPage(r.data)),

  todas: (page = 1, perPage = 20) =>
    apiClient
      .get(`/cosechas?page=${page}&per_page=${perPage}`)
      .then((r) => adaptPage(r.data)),

  detalle: (id: number) =>
    apiClient.get(`/cosechas/${id}`).then((r) => adaptCosecha(r.data)),
}
