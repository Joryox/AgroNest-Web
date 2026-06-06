import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { oracleApi } from './api'
import { bovedaKeys } from '@/features/boveda/hooks'
import { cosechaKeys } from '@/features/cosechas/hooks'
import { useToastStore } from '@/store/toastStore'
import type { AvanzarCicloInput, ChainlinkResolverInput } from './types'

export const oracleKeys = {
  estado: (vaultAddress: string) => ['oracle', 'estado', vaultAddress] as const,
}

export function useOracleEstado(vaultAddress: string | null) {
  return useQuery({
    queryKey: oracleKeys.estado(vaultAddress ?? ''),
    queryFn: () => oracleApi.getEstado(vaultAddress!),
    enabled: !!vaultAddress,
    refetchInterval: 10_000,
    retry: false,
  })
}

export function useAvanzarCiclo() {
  const qc = useQueryClient()
  const addToast = useToastStore((s) => s.addToast)

  return useMutation({
    mutationFn: (data: AvanzarCicloInput) => oracleApi.avanzarCiclo(data),
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: bovedaKeys.all })
      qc.invalidateQueries({ queryKey: cosechaKeys.all })
      addToast({
        type: 'success',
        message: `Ciclo avanzado a: ${result.estadoNuevo}`,
        duration: 6000,
      })
    },
    onError: (error) => {
      const detail = isAxiosError(error)
        ? (error.response?.data?.detail ?? 'Error al avanzar el ciclo.')
        : 'Error al avanzar el ciclo.'
      addToast({ type: 'error', message: detail })
    },
  })
}

export function useAvanzarChainlink() {
  const qc = useQueryClient()
  const addToast = useToastStore((s) => s.addToast)

  return useMutation({
    mutationFn: (data: ChainlinkResolverInput) => oracleApi.avanzarChainlink(data),
    onSuccess: (result) => {
      qc.invalidateQueries({ queryKey: bovedaKeys.all })
      qc.invalidateQueries({ queryKey: cosechaKeys.all })
      addToast({
        type: 'success',
        message: result.mensaje,
        duration: 8000,
      })
    },
    onError: (error) => {
      const detail = isAxiosError(error)
        ? (error.response?.data?.detail ?? 'Error al solicitar resolución Chainlink.')
        : 'Error al solicitar resolución Chainlink.'
      addToast({ type: 'error', message: detail })
    },
  })
}
