import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { useToastStore } from '@/store/toastStore'
import type { WalletState } from './types'

declare global {
  interface Window {
    ethereum?: any
  }
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set) => ({
      metaMaskAddress: null,
      isConnecting: false,

      connectMetaMask: async () => {
        if (typeof window.ethereum === 'undefined') {
          useToastStore.getState().addToast({ type: 'error', message: 'MetaMask no detectado. Instala la extensión.' })
          return
        }
        set({ isConnecting: true })
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }) as string[]
          if (!accounts.length) throw new Error('Sin cuentas')
          set({ metaMaskAddress: accounts[0], isConnecting: false })
          useToastStore.getState().addToast({ type: 'success', message: 'MetaMask conectado exitosamente.' })
          window.ethereum.on('accountsChanged', (accs: string[]) => {
            set({ metaMaskAddress: accs.length ? accs[0] : null })
          })
          window.ethereum.on('chainChanged', () => window.location.reload())
        } catch {
          set({ isConnecting: false })
          useToastStore.getState().addToast({ type: 'error', message: 'Error al conectar MetaMask.' })
        }
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
