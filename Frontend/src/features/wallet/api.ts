import { apiClient } from '@/lib/axios'
import { adaptBalance } from './types'
import type { RawBalance, TxStatus } from './types'

export const walletApi = {
  getApiWallet: () =>
    apiClient.get<RawBalance>('/blockchain/wallet').then((r) => adaptBalance(r.data)),

  getBalance: (address: string) =>
    apiClient
      .get<RawBalance>(`/blockchain/balance/${address}`)
      .then((r) => adaptBalance(r.data)),

  getTxStatus: (txHash: string) =>
    apiClient.get<TxStatus>(`/blockchain/tx/${txHash}`).then((r) => r.data),
}
