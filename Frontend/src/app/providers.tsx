import { useEffect } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { queryClient } from './queryClient'
import { App } from '@/App'
import { Toaster } from '@/store/toastStore'
import { ErrorBoundary, SkipLink } from '@/shared/components'
import { useThemeStore } from '@/store/themeStore'
import { useAccessibilityStore } from '@/store/accessibilityStore'

function ThemeInitializer() {
  const initTheme = useThemeStore((s) => s.initTheme)
  useEffect(() => { initTheme() }, [initTheme])
  return null
}

function AccessibilityInitializer() {
  const initAccessibility = useAccessibilityStore((s) => s.initAccessibility)
  useEffect(() => { initAccessibility() }, [initAccessibility])
  return null
}

export function Providers() {
  return (
    <ErrorBoundary>
      <ThemeInitializer />
      <AccessibilityInitializer />
      <SkipLink />
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster />
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
