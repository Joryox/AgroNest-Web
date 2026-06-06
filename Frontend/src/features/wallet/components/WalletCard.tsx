import { isAxiosError } from 'axios'
import { Spinner } from '@/shared/components'
import { useApiWallet, useMetaMaskBalance } from '../hooks'
import { useWalletStore } from '../store'

function truncate(addr: string) {
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`
}

function BlockchainOffline() {
  return (
    <div className="rounded-xl border-2 border-dashed border-orange-200 bg-orange-50 p-6 text-center">
      <p className="text-2xl">⛓️</p>
      <p className="mt-2 font-semibold text-orange-700">Nodo blockchain no disponible</p>
      <p className="mt-1 text-sm text-orange-600">
        Para habilitar funciones blockchain, sigue estos pasos:
      </p>
      <ol className="mt-3 space-y-1 text-left text-sm text-orange-700">
        <li className="flex gap-2"><span className="font-bold">1.</span> <code className="rounded bg-orange-100 px-1">cd Argos-Net-Api/contracts</code></li>
        <li className="flex gap-2"><span className="font-bold">2.</span> <code className="rounded bg-orange-100 px-1">npx hardhat node</code></li>
        <li className="flex gap-2"><span className="font-bold">3.</span> (nueva terminal) <code className="rounded bg-orange-100 px-1">npx hardhat run scripts/deploy.js --network localhost</code></li>
        <li className="flex gap-2"><span className="font-bold">4.</span> Copia las addresses al <code className="rounded bg-orange-100 px-1">.env</code> del backend</li>
        <li className="flex gap-2"><span className="font-bold">5.</span> Reinicia la API</li>
      </ol>
    </div>
  )
}

export function WalletCard() {
  const { data: apiWallet, isLoading: loadingApi, error: apiError } = useApiWallet()
  const { data: mmBalance, isLoading: loadingMm } = useMetaMaskBalance()
  const { metaMaskAddress, isConnecting, connectMetaMask, disconnectMetaMask } = useWalletStore()

  const isBlockchainDown =
    isAxiosError(apiError) && (apiError.response?.status === 503 || apiError.response?.status === 500)

  if (isBlockchainDown) {
    return <BlockchainOffline />
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Custodial API Wallet */}
      <div className="rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white shadow">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium opacity-80">Billetera AgroNest</h3>
          <span className="text-xl">🏦</span>
        </div>
        {loadingApi ? (
          <div className="mt-4 flex justify-center"><Spinner size="sm" /></div>
        ) : (
          <>
            <p className="mt-4 text-3xl font-bold">
              ${Number(apiWallet?.usdcBalance ?? 0).toFixed(2)}
              <span className="ml-2 text-lg font-normal opacity-70">USDC</span>
            </p>
            <div className="mt-3 space-y-1 text-sm opacity-80">
              <p>ETH: {Number(apiWallet?.ethBalance ?? 0).toFixed(4)}</p>
              {apiWallet?.bcropBalance != null && (
                <p>bCROP: {Number(apiWallet.bcropBalance).toFixed(2)}</p>
              )}
            </div>
            {apiWallet?.address && (
              <p className="mt-3 truncate text-xs opacity-60" title={apiWallet.address}>
                {truncate(apiWallet.address)}
              </p>
            )}
            <p className="mt-2 text-xs opacity-50">Gestionada por la plataforma</p>
          </>
        )}
      </div>

      {/* MetaMask Wallet */}
      <div className="rounded-xl border-2 border-dashed border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-600">Mi Wallet MetaMask</h3>
          <span className="text-xl">🦊</span>
        </div>

        {metaMaskAddress ? (
          <>
            {loadingMm ? (
              <div className="mt-4 flex justify-center"><Spinner size="sm" /></div>
            ) : (
              <>
                <p className="mt-4 text-3xl font-bold text-gray-900">
                  ${Number(mmBalance?.usdcBalance ?? 0).toFixed(2)}
                  <span className="ml-2 text-lg font-normal text-gray-400">USDC</span>
                </p>
                <div className="mt-3 space-y-1 text-sm text-gray-500">
                  <p>ETH: {Number(mmBalance?.ethBalance ?? 0).toFixed(4)}</p>
                  {mmBalance?.bcropBalance != null && (
                    <p>bCROP: {Number(mmBalance.bcropBalance).toFixed(2)}</p>
                  )}
                </div>
                <p className="mt-3 truncate text-xs text-gray-400" title={metaMaskAddress}>
                  {truncate(metaMaskAddress)}
                </p>
              </>
            )}
            <button
              onClick={disconnectMetaMask}
              className="mt-4 text-xs text-red-500 hover:text-red-700"
            >
              Desconectar MetaMask
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-sm text-gray-400">Conecta MetaMask para ver tus balances on-chain</p>
            <button
              onClick={connectMetaMask}
              disabled={isConnecting}
              className="mt-4 flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2
                         text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50"
            >
              {isConnecting ? <Spinner size="sm" /> : '🦊'}
              {isConnecting ? 'Conectando...' : 'Conectar MetaMask'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
