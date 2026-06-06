import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { inversionesApi } from './api'
import { useToastStore } from '@/store/toastStore'
import type { InvertirInput } from './types'
import { walletKeys } from '@/features/wallet/hooks'

export const inversionKeys = {
  all: ['inversiones'] as const,
  mis: () => [...inversionKeys.all, 'mis'] as const,
  porCosecha: (id: number) => [...inversionKeys.all, 'cosecha', id] as const,
}

export function useMisInversiones(page = 1) {
  return useQuery({
    queryKey: [...inversionKeys.mis(), page],
    queryFn: () => inversionesApi.misInversiones(page),
    placeholderData: (prev) => prev,
  })
}

export function useInversionesPorCosecha(cosechaId: number) {
  return useQuery({
    queryKey: inversionKeys.porCosecha(cosechaId),
    queryFn: () => inversionesApi.porCosecha(cosechaId),
    enabled: !!cosechaId,
  })
}

export function useInvertir() {
  const qc = useQueryClient()
  const addToast = useToastStore((s) => s.addToast)

  return useMutation({
    mutationFn: (data: InvertirInput) => inversionesApi.invertir(data),
    onSuccess: (inv) => {
      qc.invalidateQueries({ queryKey: inversionKeys.all })
      qc.invalidateQueries({ queryKey: walletKeys.apiWallet })
      addToast({
        type: 'success',
        message: `Inversión de $${inv.montoUsdc} USDC realizada. ${inv.bcropRecibido} bCROP acreditados.`,
      })
    },
    onError: () => {
      addToast({ type: 'error', message: 'Error al procesar la inversión.' })
    },
  })
}

export function useReclamar() {
  const qc = useQueryClient()
  const addToast = useToastStore((s) => s.addToast)

  return useMutation({
    mutationFn: (inversionId: number) => inversionesApi.reclamar(inversionId),
    onSuccess: (inv) => {
      qc.invalidateQueries({ queryKey: inversionKeys.all })
      qc.invalidateQueries({ queryKey: walletKeys.apiWallet })
      addToast({
        type: 'success',
        message: `Retorno reclamado: $${inv.montoReclamado} USDC.`,
      })
    },
    onError: () => {
      addToast({ type: 'error', message: 'Error al reclamar el retorno.' })
    },
  })
}
