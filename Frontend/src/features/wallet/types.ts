export interface BlockchainBalance {
  address: string
  ethBalance: string
  usdcBalance: string
  bcropBalance: string | null
}

export interface TxStatus {
  txHash: string
  status: 'pending' | 'success' | 'failed'
  blockNumber: number | null
  gasUsed: number | null
}

// Raw snake_case from backend
export interface RawBalance {
  address: string
  eth_balance: string
  usdc_balance: string
  bcrop_balance: string | null
}

export interface TxEntry {
  hash: string
  type: 'invest' | 'claim' | 'mint' | 'vault'
  amount?: string
  date?: string
}

export function adaptBalance(raw: RawBalance): BlockchainBalance {
  return {
    address: raw.address,
    ethBalance: raw.eth_balance,
    usdcBalance: raw.usdc_balance,
    bcropBalance: raw.bcrop_balance,
  }
}

export interface WalletState {
  metaMaskAddress: string | null
  isConnecting: boolean
  connectMetaMask: () => Promise<void>
  disconnectMetaMask: () => void
}
