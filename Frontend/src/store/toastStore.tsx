import { useState } from 'react'
import { create } from 'zustand'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastState {
  toasts: Toast[]
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = crypto.randomUUID()
    const duration = toast.duration ?? 4000
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }))
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }))
    }, duration)
  },
  removeToast: (id) =>
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

// --- Toast UI ---

const styles: Record<ToastType, string> = {
  success: 'bg-green-50 border-green-500 text-green-800 dark:bg-green-900/40 dark:border-green-500 dark:text-green-200',
  error:   'bg-red-50 border-red-500 text-red-800 dark:bg-red-900/40 dark:border-red-500 dark:text-red-200',
  warning: 'bg-yellow-50 border-yellow-500 text-yellow-800 dark:bg-yellow-900/40 dark:border-yellow-500 dark:text-yellow-200',
  info:    'bg-blue-50 border-blue-500 text-blue-800 dark:bg-blue-900/40 dark:border-blue-500 dark:text-blue-200',
}

const icons = {
  success: CheckCircle,
  error:   XCircle,
  warning: AlertTriangle,
  info:    Info,
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const [isLeaving, setIsLeaving] = useState(false)
  const Icon = icons[toast.type]

  const handleDismiss = () => {
    setIsLeaving(true)
    setTimeout(onDismiss, 280)
  }

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`flex items-start gap-3 min-w-72 max-w-sm rounded-lg border-l-4 px-4 py-3 shadow-lg
        ${styles[toast.type]}
        ${isLeaving ? 'animate-slide-out-right' : 'animate-slide-in-right'}`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        type="button"
        onClick={handleDismiss}
        className="opacity-60 hover:opacity-100 transition-opacity text-current"
        aria-label="Cerrar notificación"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts)
  const removeToast = useToastStore((s) => s.removeToast)

  return (
    <div
      aria-label="Notificaciones"
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
      ))}
    </div>
  )
}
