import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { env } from '@/config/env'
import { useAuthStore } from '@/features/auth/store'
import type { BackendTokenResponse } from '@/features/auth/types'

const baseConfig = {
  baseURL: env.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
}

// Main client — has request + response interceptors
export const apiClient = axios.create(baseConfig)

// Plain client used ONLY for token refresh to avoid an interceptor → refresh → interceptor loop
const plainAxios = axios.create(baseConfig)

// --- Attach Bearer token to every request ---
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// --- Refresh queue: prevents multiple simultaneous refresh calls ---
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null) {
  if (error) {
    failedQueue.forEach((p) => p.reject(error))
  } else if (token) {
    failedQueue.forEach((p) => p.resolve(token))
  }
  failedQueue = []
}

// --- Handle 401: refresh token, retry original request, or logout ---
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error)
    }

    original._retry = true

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject })
      }).then((token) => {
        original.headers.Authorization = `Bearer ${token}`
        return apiClient(original)
      })
    }

    isRefreshing = true
    const { refreshToken, setTokens, clearAuth } = useAuthStore.getState()

    try {
      const { data } = await plainAxios.post<BackendTokenResponse>(
        `/token/renovacion?refresh_token=${encodeURIComponent(refreshToken ?? '')}`
      )

      setTokens(data.access_token, data.refresh_token)
      processQueue(null, data.access_token)
      original.headers.Authorization = `Bearer ${data.access_token}`
      return apiClient(original)
    } catch (refreshError) {
      processQueue(refreshError, null)
      clearAuth()
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)
