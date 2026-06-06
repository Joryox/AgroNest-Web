import { apiClient } from '@/lib/axios'
import type { BackendUser, BackendTokenResponse, EditarPerfilInput, LoginCredentials, User } from './types'

function adaptUser(raw: BackendUser): User {
  return {
    id: raw.id,
    username: raw.usuario,
    firstName: raw.nombres,
    lastName: raw.apellidos,
    email: raw.correo,
    role: raw.rol as 'agricultor' | 'inversor' | 'admin',
    walletAddress: raw.wallet_address ?? null,
  }
}

export const authApi = {
  // POST /token — OAuth2 form-urlencoded (username + password)
  login: async (credentials: LoginCredentials): Promise<BackendTokenResponse> => {
    const form = new URLSearchParams()
    form.append('username', credentials.username)
    form.append('password', credentials.password)
    const r = await apiClient.post<BackendTokenResponse>('/token', form, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    })
    return r.data
  },

  // GET /usuarios/mi_info — Bearer token set by interceptor
  getMe: async (): Promise<User> => {
    const r = await apiClient.get<BackendUser>('/usuarios/mi_info')
    return adaptUser(r.data)
  },

  // POST /token/revocacion?token=xxx
  logout: (token: string) =>
    apiClient.post<void>(`/token/revocacion?token=${encodeURIComponent(token)}`),

  // PUT /usuarios/:id
  editarPerfil: (userId: number, data: EditarPerfilInput): Promise<User> =>
    apiClient
      .put<BackendUser>(`/usuarios/${userId}`, data)
      .then((r) => adaptUser(r.data)),

  // POST /token/renovacion?refresh_token=xxx
  refresh: (refreshToken: string) =>
    apiClient
      .post<BackendTokenResponse>(
        `/token/renovacion?refresh_token=${encodeURIComponent(refreshToken)}`
      )
      .then((r) => r.data),
}
