import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface EtherfuseState {
  customerId: string | null
  bankAccountId: string | null
  kycStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | null
  walletAddress: string | null
  setCustomer: (customerId: string, bankAccountId: string, kycStatus: string, walletAddress?: string | null) => void
  setKycStatus: (status: 'PENDING' | 'APPROVED' | 'REJECTED') => void
  setWalletAddress: (address: string) => void
  clear: () => void
}

export const useEtherfuseStore = create<EtherfuseState>()(
  persist(
    (set) => ({
      customerId: null,
      bankAccountId: null,
      kycStatus: null,
      walletAddress: null,

      setCustomer: (customerId, bankAccountId, kycStatus, walletAddress) =>
        set({
          customerId,
          bankAccountId,
          kycStatus: kycStatus as EtherfuseState['kycStatus'],
          walletAddress: walletAddress ?? null,
        }),

      setKycStatus: (status) => set({ kycStatus: status }),

      setWalletAddress: (address) => set({ walletAddress: address }),

      clear: () => set({ customerId: null, bankAccountId: null, kycStatus: null, walletAddress: null }),
    }),
    { name: 'etherfuse-store' },
  ),
)
