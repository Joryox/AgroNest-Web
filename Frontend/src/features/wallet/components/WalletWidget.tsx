import { useNavigate } from 'react-router'
import { isAxiosError } from 'axios'
import { Spinner } from '@/shared/components'
import { useApiWallet } from '../hooks'
import { useWalletStore } from '../store'

export function WalletWidget() {
  const { data: wallet, isLoading, error } = useApiWallet()
  const { metaMaskAddress } = useWalletStore()
  const navigate = useNavigate()

  const isBlockchainDown =
    isAxiosError(error) && (error.response?.status === 503 || error.response?.status === 500)

  return (
    <button
      onClick={() => navigate('/wallet')}
      className="flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50
                 px-3 py-1.5 text-sm transition-colors hover:bg-primary-100"
      title="Ver cartera"
    >
      <span>🌾</span>
      {isLoading ? (
        <Spinner size="sm" />
      ) : isBlockchainDown ? (
        <span className="font-medium text-orange-500">Sin nodo</span>
      ) : (
        <span className="font-semibold text-primary-700">
          ${Number(wallet?.usdcBalance ?? 0).toFixed(2)} USDC
        </span>
      )}
      {metaMaskAddress && !isBlockchainDown && (
        <span className="hidden text-xs text-gray-500 sm:inline">
          {metaMaskAddress.slice(0, 6)}…{metaMaskAddress.slice(-4)}
        </span>
      )}
    </button>
  )
}
