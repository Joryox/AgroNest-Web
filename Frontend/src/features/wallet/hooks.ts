import { useQuery } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useAuthStore } from '@/features/auth'
import { walletApi } from './api'
import { useWalletStore } from './store'

export const walletKeys = {
  apiWallet: ['wallet', 'api'] as const,
  metaMask: (address: string | null) => ['wallet', 'metamask', address] as const,
  tx: (hash: string | null) => ['tx', hash] as const,
}

// Returns false to stop polling when blockchain is unreachable (503/500)
function blockchainRefetchInterval(intervalMs: number) {
  return (query: { state: { error: unknown; data: unknown } }) => {
    if (isAxiosError(query.state.error)) {
      const status = query.state.error.response?.status
      if (status === 503 || status === 500) return false
    }
    if (!query.state.data && query.state.error) return false
    return intervalMs
  }
}

export function useApiWallet() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return useQuery({
    queryKey: walletKeys.apiWallet,
    queryFn: walletApi.getApiWallet,
    enabled: isAuthenticated,
    refetchInterval: blockchainRefetchInterval(30_000),
    retry: false,
  })
}

export function useMetaMaskBalance() {
  const address = useWalletStore((s) => s.metaMaskAddress)
  return useQuery({
    queryKey: walletKeys.metaMask(address),
    queryFn: () => walletApi.getBalance(address!),
    enabled: !!address,
    refetchInterval: blockchainRefetchInterval(60_000),
    retry: false,
  })
}

export function useTxStatus(txHash: string | null) {
  return useQuery({
    queryKey: walletKeys.tx(txHash),
    queryFn: () => walletApi.getTxStatus(txHash!),
    enabled: !!txHash,
    retry: false,
    refetchInterval: (query) => {
      if (isAxiosError(query.state.error)) return false
      const data = query.state.data
      if (data?.status === 'success' || data?.status === 'failed') return false
      return 5_000
    },
  })
}
