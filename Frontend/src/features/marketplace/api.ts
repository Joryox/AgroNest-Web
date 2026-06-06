import { apiClient } from '@/lib/axios'
import type { NftListing, PaginacionListings, RawListing, RawPaginacionListings } from './types'
import { adaptListing, adaptPaginacionListings } from './types'

export const marketplaceApi = {
  async listarNfts(params?: { page?: number; perPage?: number; estado?: string }): Promise<PaginacionListings> {
    const query: Record<string, unknown> = {}
    if (params?.page) query.page = params.page
    if (params?.perPage) query.per_page = params.perPage
    if (params?.estado) query.estado = params.estado
    const { data } = await apiClient.get<RawPaginacionListings>('/marketplace', { params: query })
    return adaptPaginacionListings(data)
  },

  async obtenerListing(id: number): Promise<NftListing> {
    const { data } = await apiClient.get<RawListing>(`/marketplace/${id}`)
    return adaptListing(data)
  },

  async crearListing(params: {
    cosechaId: number
    precio: number
    currency?: string
    tipo?: string
    auctionHoras?: number
  }): Promise<NftListing> {
    const { data } = await apiClient.post<RawListing>('/marketplace', {
      cosecha_id: params.cosechaId,
      precio: params.precio,
      currency: params.currency ?? 'ETH',
      tipo: params.tipo ?? 'FIXED',
      auction_horas: params.auctionHoras,
    })
    return adaptListing(data)
  },

  async confirmarListing(id: number, chainListingId: string, txHash: string): Promise<NftListing> {
    const { data } = await apiClient.put<RawListing>(`/marketplace/${id}/confirm`, null, {
      params: { chain_listing_id: chainListingId, tx_hash: txHash },
    })
    return adaptListing(data)
  },

  async cancelarListing(id: number): Promise<NftListing> {
    const { data } = await apiClient.post<RawListing>(`/marketplace/${id}/cancel`)
    return adaptListing(data)
  },

  async marcarVendido(id: number, txHash: string): Promise<NftListing> {
    const { data } = await apiClient.post<RawListing>(`/marketplace/${id}/sold`, null, {
      params: { tx_hash: txHash },
    })
    return adaptListing(data)
  },
}
