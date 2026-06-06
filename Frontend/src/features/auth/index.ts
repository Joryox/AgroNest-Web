// Public barrel for the auth feature.
// Other features and shared code import ONLY from here.
export { useLogin, useLogout, useCurrentUser, useEditarPerfil } from './hooks'
export { useAuthStore } from './store'
export { RequireAuth, RequireGuest } from './guards'
export type { User, AuthTokens, LoginCredentials, BackendTokenResponse } from './types'
