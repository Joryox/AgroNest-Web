import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type FontSize = 'small' | 'normal' | 'large' | 'xl'

interface AccessibilityState {
  fontSize: FontSize
  highContrast: boolean
  reducedMotion: boolean
  showIconLabels: boolean
  focusEnhanced: boolean

  setFontSize: (size: FontSize) => void
  setHighContrast: (value: boolean) => void
  setReducedMotion: (value: boolean) => void
  setShowIconLabels: (value: boolean) => void
  setFocusEnhanced: (value: boolean) => void
  initAccessibility: () => void
}

function applyAccessibility(state: Omit<AccessibilityState, keyof Pick<AccessibilityState, 'setFontSize' | 'setHighContrast' | 'setReducedMotion' | 'setShowIconLabels' | 'setFocusEnhanced' | 'initAccessibility'>>) {
  const html = document.documentElement

  // Font size
  html.classList.remove('font-size-sm', 'font-size-lg', 'font-size-xl')
  if (state.fontSize === 'small') html.classList.add('font-size-sm')
  if (state.fontSize === 'large') html.classList.add('font-size-lg')
  if (state.fontSize === 'xl') html.classList.add('font-size-xl')

  // High contrast
  html.classList.toggle('high-contrast', state.highContrast)

  // Reduced motion
  html.classList.toggle('reduce-motion', state.reducedMotion)

  // Show icon labels
  html.classList.toggle('show-icon-labels', state.showIconLabels)

  // Focus enhanced
  html.classList.toggle('focus-enhanced', state.focusEnhanced)
}

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set, get) => ({
      fontSize: 'normal',
      highContrast: false,
      reducedMotion: false,
      showIconLabels: false,
      focusEnhanced: false,

      setFontSize: (fontSize) => {
        set({ fontSize })
        applyAccessibility({ ...get(), fontSize })
      },

      setHighContrast: (highContrast) => {
        set({ highContrast })
        applyAccessibility({ ...get(), highContrast })
      },

      setReducedMotion: (reducedMotion) => {
        set({ reducedMotion })
        applyAccessibility({ ...get(), reducedMotion })
      },

      setShowIconLabels: (showIconLabels) => {
        set({ showIconLabels })
        applyAccessibility({ ...get(), showIconLabels })
      },

      setFocusEnhanced: (focusEnhanced) => {
        set({ focusEnhanced })
        applyAccessibility({ ...get(), focusEnhanced })
      },

      initAccessibility: () => {
        const state = get()

        // Auto-detectar prefers-reduced-motion si el usuario no lo ha cambiado
        const systemReducedMotion =
          typeof window !== 'undefined' &&
          window.matchMedia('(prefers-reduced-motion: reduce)').matches

        const finalState = {
          ...state,
          reducedMotion: state.reducedMotion || systemReducedMotion,
        }

        if (systemReducedMotion && !state.reducedMotion) {
          set({ reducedMotion: true })
        }

        applyAccessibility(finalState)
      },
    }),
    {
      name: 'agronest-accessibility',
      partialize: (state) => ({
        fontSize: state.fontSize,
        highContrast: state.highContrast,
        reducedMotion: state.reducedMotion,
        showIconLabels: state.showIconLabels,
        focusEnhanced: state.focusEnhanced,
      }),
    },
  ),
)
