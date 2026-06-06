import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { extractApiErrorMessage } from '@/types/api'
import { useToastStore } from '@/store/toastStore'

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      if (isAxiosError(error) && error.response?.status === 404) {
        if (error.config?.url?.includes('/etherfuse/customer')) return
      }
      const message = extractApiErrorMessage(error)
      useToastStore.getState().addToast({ type: 'error', message })
    },
  }),
  mutationCache: new MutationCache({
    onError: (error) => {
      const message = extractApiErrorMessage(error)
      useToastStore.getState().addToast({ type: 'error', message })
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: (failureCount, error) => {
        if (isAxiosError(error)) {
          const status = error.response?.status
          // Never retry auth errors, not-found, or server/blockchain errors
          if (status === 401 || status === 403 || status === 404 || status === 500 || status === 503) return false
        }
        return failureCount < 2
      },
      refetchOnWindowFocus: false,
    },
  },
})
