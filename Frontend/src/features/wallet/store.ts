import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useToastStore } from '@/store/toastStore'
import type { WalletState } from './types'

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      metaMaskAddress: null,
      isConnecting: false,

      connectMetaMask: async () => {
        set({ isConnecting: true })
        setTimeout(() => {
          set({ metaMaskAddress: '0x82f0B9C9B4Bc5b13d28532454508933454B4B9A7', isConnecting: false })
          useToastStore.getState().addToast({ type: 'success', message: 'MetaMask conectado exitosamente.' })
        }, 800)
      },

      disconnectMetaMask: () => {
        set({ metaMaskAddress: null })
        useToastStore.getState().addToast({ type: 'success', message: 'MetaMask desconectado.' })
      },
    }),
    {
      name: 'wallet-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ metaMaskAddress: s.metaMaskAddress }),
    },
  ),
)
