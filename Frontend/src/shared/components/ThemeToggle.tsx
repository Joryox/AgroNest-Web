import { Sun, Moon } from 'lucide-react'
import { useThemeStore } from '@/store/themeStore'

interface ThemeToggleProps {
  showLabel?: boolean
}

export function ThemeToggle({ showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useThemeStore()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
      className="flex h-9 items-center justify-center gap-1.5 rounded-full px-2 text-gray-500
                 transition-colors hover:bg-gray-100 hover:text-gray-700
                 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200
                 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      {showLabel && (
        <span className="text-xs font-medium">Tema</span>
      )}
    </button>
  )
}
