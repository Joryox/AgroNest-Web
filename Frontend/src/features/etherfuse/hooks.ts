import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useAuthStore } from '@/features/auth'
import { etherfuseApi } from './api'
import { useEtherfuseStore } from './store'

export const etherfuseKeys = {
  customer: ['etherfuse', 'customer'] as const,
  assets: ['etherfuse', 'assets'] as const,
  orders: (page?: number) => ['etherfuse', 'orders', page] as const,
  order: (id: string) => ['etherfuse', 'order', id] as const,
}

export function useEtherfuseCustomer() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const setCustomer = useEtherfuseStore((s) => s.setCustomer)

  return useQuery({
    queryKey: etherfuseKeys.customer,
    queryFn: async () => {
      const cliente = await etherfuseApi.obtenerCliente()
      setCustomer(cliente.customerId, cliente.bankAccountId ?? '', cliente.kycStatus, cliente.walletAddress)
      return cliente
    },
    enabled: isAuthenticated,
    retry: (count, error) => {
      if (isAxiosError(error) && error.response?.status === 404) return false
      return count < 2
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function useEtherfuseAssets() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: etherfuseKeys.assets,
    queryFn: etherfuseApi.obtenerActivos,
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000,
  })
}

export function useEtherfuseOrdenes(page?: number) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: etherfuseKeys.orders(page),
    queryFn: () => etherfuseApi.listarOrdenes(page),
    enabled: isAuthenticated,
  })
}

export function useIniciarOnboarding() {
  const qc = useQueryClient()
  const setCustomer = useEtherfuseStore((s) => s.setCustomer)
  return useMutation({
    mutationFn: (walletAddress?: string) => etherfuseApi.iniciarOnboarding(walletAddress),
    onSuccess: (result) => {
      setCustomer(result.customerId, result.bankAccountId, result.kycStatus)
      qc.invalidateQueries({ queryKey: etherfuseKeys.customer })
    },
  })
}

export function useCrearQuote() {
  return useMutation({
    mutationFn: etherfuseApi.crearQuote,
  })
}

export function useCrearOrden() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: etherfuseApi.crearOrden,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['etherfuse', 'orders'] })
    },
  })
}

export function useSimularFiat() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: etherfuseApi.simularFiat,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['etherfuse', 'orders'] })
    },
  })
}
