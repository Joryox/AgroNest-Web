import { apiClient } from '@/lib/axios'
import type {
  EtherfuseAsset,
  EtherfuseOnboardingResult,
  PaginacionOrdenes,
  RawCliente,
  RawOnboardingResult,
  RawOrden,
  RawPaginacion,
  RawQuote,
} from './types'
import {
  adaptCliente,
  adaptOnboarding,
  adaptOrden,
  adaptPaginacion,
  adaptQuote,
  type EtherfuseCliente,
  type EtherfuseOrden,
  type EtherfuseQuote,
} from './types'

export const etherfuseApi = {
  async iniciarOnboarding(walletAddress?: string): Promise<EtherfuseOnboardingResult> {
    const { data } = await apiClient.post<RawOnboardingResult>('/etherfuse/onboarding', {
      wallet_address: walletAddress ?? null,
    })
    return adaptOnboarding(data)
  },

  async obtenerCliente(): Promise<EtherfuseCliente> {
    const { data } = await apiClient.get<RawCliente>('/etherfuse/customer')
    return adaptCliente(data)
  },

  async actualizarWallet(walletAddress: string): Promise<EtherfuseCliente> {
    const { data } = await apiClient.put<RawCliente>('/etherfuse/customer/wallet', {
      wallet_address: walletAddress,
    })
    return adaptCliente(data)
  },

  async obtenerActivos(): Promise<EtherfuseAsset[]> {
    const { data } = await apiClient.get<EtherfuseAsset[]>('/etherfuse/assets')
    return data
  },

  async crearQuote(params: {
    tipo: string
    sourceAsset: string
    targetAsset: string
    amount: number
  }): Promise<EtherfuseQuote> {
    const { data } = await apiClient.post<RawQuote>('/etherfuse/quote', {
      tipo: params.tipo,
      source_asset: params.sourceAsset,
      target_asset: params.targetAsset,
      amount: params.amount,
    })
    return adaptQuote(data)
  },

  async crearOrden(params: {
    quoteId: string
    walletAddress: string
  }): Promise<EtherfuseOrden> {
    const { data } = await apiClient.post<RawOrden>('/etherfuse/order', {
      quote_id: params.quoteId,
      wallet_address: params.walletAddress,
    })
    return adaptOrden(data)
  },

  async simularFiat(orderId: string): Promise<{ detail: string }> {
    const { data } = await apiClient.post(`/etherfuse/order/${orderId}/simulate`)
    return data
  },

  async listarOrdenes(page?: number, perPage?: number): Promise<PaginacionOrdenes> {
    const params: Record<string, unknown> = {}
    if (page) params.page = page
    if (perPage) params.per_page = perPage
    const { data } = await apiClient.get<RawPaginacion>('/etherfuse/orders', { params })
    return adaptPaginacion(data)
  },

  async obtenerOrden(orderId: string): Promise<EtherfuseOrden> {
    const { data } = await apiClient.get<RawOrden>(`/etherfuse/orders/${orderId}`)
    return adaptOrden(data)
  },
}
