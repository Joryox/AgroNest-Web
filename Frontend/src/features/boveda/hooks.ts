import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { bovedaApi } from './api'
import { useToastStore } from '@/store/toastStore'
import type { AbrirBovedaInput } from './types'

export const bovedaKeys = {
  all: ['boveda'] as const,
  porCosecha: (cosechaId: number) => [...bovedaKeys.all, 'cosecha', cosechaId] as const,
  detalle: (id: number) => [...bovedaKeys.all, id] as const,
}

export function useBovedaPorCosecha(cosechaId: number) {
  return useQuery({
    queryKey: bovedaKeys.porCosecha(cosechaId),
    queryFn: () => bovedaApi.porCosecha(cosechaId),
    enabled: !!cosechaId,
    retry: false,
  })
}

export function useTodasBovedas() {
  return useQuery({
    queryKey: [...bovedaKeys.all, 'todas'],
    queryFn: () => bovedaApi.todas(),
  })
}

export function useAbrirBoveda() {
  const qc = useQueryClient()
  const addToast = useToastStore((s) => s.addToast)

  return useMutation({
    mutationFn: (data: AbrirBovedaInput) => bovedaApi.abrir(data),
    onSuccess: (boveda) => {
      qc.invalidateQueries({ queryKey: bovedaKeys.all })
      addToast({
        type: 'success',
        message: `Bóveda creada en ${boveda.vaultAddress?.slice(0, 10)}...`,
      })
    },
    onError: () => {
      addToast({ type: 'error', message: 'Error al abrir la bóveda.' })
    },
  })
}
