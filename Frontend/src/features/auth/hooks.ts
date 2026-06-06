import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useLocation } from 'react-router'
import { authApi } from './api'
import { useAuthStore } from './store'
import { useToastStore } from '@/store/toastStore'
import type { EditarPerfilInput, LoginCredentials } from './types'

export function useLogin() {
  const { setAuth, setTokens, clearAuth } = useAuthStore.getState()
  const navigate = useNavigate()
  const location = useLocation()
  const addToast = useToastStore((s) => s.addToast)

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      // Step 1: get tokens
      const tokenResp = await authApi.login(credentials)
      // Step 2: store tokens immediately so interceptor can attach Bearer on next call
      setTokens(tokenResp.access_token, tokenResp.refresh_token)
      // Step 3: fetch user info with the new token
      const user = await authApi.getMe()
      return {
        user,
        tokens: {
          accessToken: tokenResp.access_token,
          refreshToken: tokenResp.refresh_token,
        },
      }
    },
    onSuccess: ({ user, tokens }) => {
      setAuth(user, tokens)
      const from =
        (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/dashboard'
      navigate(from, { replace: true })
      addToast({ type: 'success', message: `Bienvenido, ${user.firstName}!` })
    },
    onError: () => {
      clearAuth()
    },
  })
}

export function useLogout() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      const { accessToken } = useAuthStore.getState()
      if (accessToken) await authApi.logout(accessToken)
    },
    onSettled: () => {
      useAuthStore.getState().clearAuth()
      queryClient.clear()
      navigate('/login', { replace: true })
    },
  })
}

export function useEditarPerfil() {
  const qc = useQueryClient()
  const addToast = useToastStore((s) => s.addToast)

  return useMutation({
    mutationFn: (data: EditarPerfilInput) => {
      const { user } = useAuthStore.getState()
      return authApi.editarPerfil(user!.id, data)
    },
    onSuccess: (updatedUser) => {
      const { accessToken, refreshToken } = useAuthStore.getState()
      useAuthStore.getState().setAuth(updatedUser, {
        accessToken: accessToken!,
        refreshToken: refreshToken!,
      })
      qc.invalidateQueries({ queryKey: ['auth', 'me'] })
      addToast({ type: 'success', message: 'Perfil actualizado correctamente.' })
    },
    onError: () => {
      addToast({ type: 'error', message: 'Error al actualizar el perfil.' })
    },
  })
}

export function useCurrentUser() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.getMe,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 10,
  })
}
