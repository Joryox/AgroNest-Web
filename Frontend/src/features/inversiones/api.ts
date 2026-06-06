import { apiClient } from '@/lib/axios'
import { adaptInversion } from './types'
import type { Inversion, InvertirInput, PaginacionInversiones } from './types'

function adaptPage(raw: any): PaginacionInversiones {
  return {
    page: raw.page ?? null,
    per_page: raw.per_page ?? null,
    total: raw.total ?? 0,
    pages: raw.pages ?? null,
    data: (raw.data ?? []).map(adaptInversion),
  }
}

export const inversionesApi = {
  invertir: (data: InvertirInput) =>
    apiClient
      .post<Inversion>('/inversiones', data, { timeout: 90_000 })
      .then((r) => adaptInversion(r.data)),

  misInversiones: (page = 1, perPage = 20) =>
    apiClient
      .get(`/inversiones?page=${page}&per_page=${perPage}`)
      .then((r) => adaptPage(r.data)),

  porCosecha: (cosechaId: number) =>
    apiClient
      .get(`/inversiones/cosecha/${cosechaId}`)
      .then((r) => (r.data as any[]).map(adaptInversion)),

  reclamar: (inversionId: number) =>
    apiClient
      .post<Inversion>(`/inversiones/${inversionId}/reclamar`)
      .then((r) => adaptInversion(r.data)),
}
