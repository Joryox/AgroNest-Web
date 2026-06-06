// Raw response from GET /usuarios/mi_info (snake_case)
export interface BackendUser {
  id: number
  usuario: string
  nombres: string
  apellidos: string
  correo: string
  eliminado: boolean
  rol: string
  wallet_address?: string | null
}

// Normalized user stored in Zustand (camelCase)
export interface User {
  id: number
  username: string
  firstName: string
  lastName: string
  email: string
  role: 'agricultor' | 'inversor' | 'admin'
  walletAddress?: string | null
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

// Login form: "usuario o correo" + password
export interface LoginCredentials {
  username: string
  password: string
}

// Raw response from POST /token (snake_case)
export interface BackendTokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

export interface EditarPerfilInput {
  nombres?: string
  apellidos?: string
  correo?: string
}

export interface AuthState {
  user: User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  setAuth: (user: User, tokens: AuthTokens) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  clearAuth: () => void
}
