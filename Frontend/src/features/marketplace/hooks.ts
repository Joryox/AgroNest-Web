import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuthStore } from '@/features/auth'
import { marketplaceApi } from './api'

export const marketplaceKeys = {
  listings: (page?: number, estado?: string) => ['marketplace', 'listings', page, estado] as const,
  listing: (id: number) => ['marketplace', 'listing', id] as const,
}

export function useListings(page?: number, estado = 'ACTIVE') {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: marketplaceKeys.listings(page, estado),
    queryFn: () => marketplaceApi.listarNfts({ page, estado }),
    enabled: isAuthenticated,
  })
}

export function useListing(id: number) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: marketplaceKeys.listing(id),
    queryFn: () => marketplaceApi.obtenerListing(id),
    enabled: isAuthenticated && !!id,
  })
}

export function useCrearListing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: marketplaceApi.crearListing,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['marketplace', 'listings'] })
    },
  })
}

export function useCancelarListing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => marketplaceApi.cancelarListing(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['marketplace', 'listings'] })
    },
  })
}

export function useConfirmarListing() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, chainListingId, txHash }: { id: number; chainListingId: string; txHash: string }) =>
      marketplaceApi.confirmarListing(id, chainListingId, txHash),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['marketplace', 'listings'] })
    },
  })
}
