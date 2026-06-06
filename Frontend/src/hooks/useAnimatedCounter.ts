import { useEffect, useRef, useState } from 'react'

function isReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return (
    document.documentElement.classList.contains('reduce-motion') ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

/**
 * Anima un contador numérico desde 0 hasta `target` en `duration` ms.
 * Respeta prefers-reduced-motion y la clase .reduce-motion del accessibilityStore.
 */
export function useAnimatedCounter(target: number, duration = 600): number {
  const [displayValue, setDisplayValue] = useState(0)
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const startValueRef = useRef(0)

  useEffect(() => {
    if (isReducedMotion()) {
      setDisplayValue(target)
      return
    }

    startValueRef.current = displayValue
    startTimeRef.current = null

    const animate = (timestamp: number) => {
      if (startTimeRef.current === null) {
        startTimeRef.current = timestamp
      }

      const elapsed = timestamp - startTimeRef.current
      const progress = Math.min(elapsed / duration, 1)

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(startValueRef.current + (target - startValueRef.current) * eased)

      setDisplayValue(current)

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration])

  return displayValue
}
