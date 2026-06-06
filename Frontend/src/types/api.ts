import { isAxiosError } from 'axios'

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface ApiError {
  message: string
  code?: string
  details?: Record<string, string[]>
}

export function extractApiErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const apiError = error.response?.data as ApiError | undefined
    return apiError?.message ?? error.message ?? 'An unexpected error occurred'
  }
  if (error instanceof Error) return error.message
  return 'An unexpected error occurred'
}
