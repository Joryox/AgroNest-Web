// Single source of truth for environment variables.
// All other files import from here — never read import.meta.env directly elsewhere.
export const env = {
  apiBaseUrl: (() => {
    const url = import.meta.env.VITE_API_BASE_URL
    if (!url) throw new Error('VITE_API_BASE_URL is not defined. Check your .env file.')
    return url
  })(),
  appName: import.meta.env.VITE_APP_NAME ?? 'App',
} as const
