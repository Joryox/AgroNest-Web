import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { cosechasApi } from './api'
import { useToastStore } from '@/store/toastStore'
import type { CrearCosechaInput } from './types'

export const cosechaKeys = {
  all: ['cosechas'] as const,
  mis: () => [...cosechaKeys.all, 'mis'] as const,
  todas: () => [...cosechaKeys.all, 'todas'] as const,
  detalle: (id: number) => [...cosechaKeys.all, id] as const,
}

export function useMisCosechas(page = 1) {
  return useQuery({
    queryKey: [...cosechaKeys.mis(), page],
    queryFn: () => cosechasApi.misCosechas(page),
    placeholderData: (prev) => prev,
  })
}

export function useTodasCosechas(page = 1) {
  return useQuery({
    queryKey: [...cosechaKeys.todas(), page],
    queryFn: () => cosechasApi.todas(page),
    placeholderData: (prev) => prev,
  })
}

export function useCosecha(id: number) {
  return useQuery({
    queryKey: cosechaKeys.detalle(id),
    queryFn: () => cosechasApi.detalle(id),
    enabled: !!id,
  })
}

export function useRegistrarCosecha() {
  const qc = useQueryClient()
  const addToast = useToastStore((s) => s.addToast)

  return useMutation({
    mutationFn: (data: CrearCosechaInput) => cosechasApi.registrar(data),
    onSuccess: (cosecha) => {
      qc.invalidateQueries({ queryKey: cosechaKeys.mis() })
      qc.invalidateQueries({ queryKey: cosechaKeys.todas() })
      addToast({
        type: 'success',
        message: `Cosecha registrada. NFT #${cosecha.nftTokenId ?? 'pendiente'} minteado.`,
      })
    },
    onError: () => {
      addToast({ type: 'error', message: 'Error al registrar la cosecha.' })
    },
  })
}
