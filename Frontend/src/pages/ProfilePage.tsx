import { useEffect, useRef, useState } from 'react'
import {
  Shield, AtSign, Mail, Sun, Moon, Monitor, Type, Eye,
  Bell, Lock, Wallet, Clock, Laptop, Copy,
  AlertTriangle, LogOut, ChevronRight,
} from 'lucide-react'
import { useAuthStore } from '@/features/auth'
import { useLogout } from '@/features/auth/hooks'
import { EditarPerfilForm } from '@/features/auth/components'
import { useThemeStore } from '@/store/themeStore'
import { useAccessibilityStore } from '@/store/accessibilityStore'
import { useWalletStore } from '@/features/wallet/store'
import { useToastStore } from '@/store/toastStore'
import { Button, PageTransition } from '@/shared/components'

// ─── tipos ────────────────────────────────────────────────────────────────────
type Tab = 'perfil' | 'apariencia' | 'accesibilidad' | 'notificaciones' | 'seguridad' | 'cartera'

const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: 'perfil',         label: 'Perfil',          icon: <AtSign className="h-4 w-4" /> },
  { id: 'apariencia',     label: 'Apariencia',       icon: <Sun className="h-4 w-4" /> },
  { id: 'accesibilidad',  label: 'Accesibilidad',    icon: <Eye className="h-4 w-4" /> },
  { id: 'notificaciones', label: 'Notificaciones',   icon: <Bell className="h-4 w-4" /> },
  { id: 'seguridad',      label: 'Seguridad',        icon: <Shield className="h-4 w-4" /> },
  { id: 'cartera',        label: 'Cartera',          icon: <Wallet className="h-4 w-4" /> },
]

// ─── Helper: Toggle de ajuste ─────────────────────────────────────────────────
function SettingToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description?: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  const id = `toggle-${label.toLowerCase().replace(/\s+/g, '-')}`
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div className="flex-1">
        <label htmlFor={id} className="text-sm font-medium text-gray-800 dark:text-gray-200 cursor-pointer">
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{description}</p>
        )}
      </div>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent
          transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2
          ${checked ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'}`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-md ring-0 transition-transform
            ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
    </div>
  )
}

// ─── Sección card wrapper ────────────────────────────────────────────────────
function Section({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
      {title && (
        <h2 className="mb-4 text-base font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
      )}
      {children}
    </div>
  )
}

// ─── TAB A: Perfil ───────────────────────────────────────────────────────────
function TabPerfil() {
  const user = useAuthStore((s) => s.user)
  const initials = [user?.firstName?.[0], user?.lastName?.[0]]
    .filter(Boolean).join('').toUpperCase() || '?'

  return (
    <div className="space-y-6">
      <Section>
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-primary-700 text-2xl font-bold text-white shadow-md">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary-600 ring-2 ring-white dark:ring-gray-800">
              <Shield className="h-3 w-3 text-white" />
            </div>
          </div>
          <div>
            <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {user?.firstName} {user?.lastName}
            </p>
            <div className="mt-1 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <AtSign className="h-3.5 w-3.5" /> {user?.username ?? '—'}
            </div>
            <div className="mt-0.5 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
              <Mail className="h-3.5 w-3.5" /> {user?.email ?? '—'}
            </div>
            <span className="mt-2 inline-block rounded-full bg-primary-100 dark:bg-primary-900/40 px-2.5 py-0.5 text-xs font-medium text-primary-700 dark:text-primary-300">
              {user?.role ?? 'usuario'}
            </span>
          </div>
        </div>
      </Section>

      <Section title="Información personal">
        <EditarPerfilForm />
      </Section>
    </div>
  )
}

// ─── TAB B: Apariencia ───────────────────────────────────────────────────────
function TabApariencia() {
  const { theme, setTheme } = useThemeStore()
  const { fontSize, setFontSize, reducedMotion, setReducedMotion } = useAccessibilityStore()

  const themes = [
    { id: 'light' as const, label: 'Claro', icon: <Sun className="h-5 w-5" /> },
    { id: 'dark'  as const, label: 'Oscuro', icon: <Moon className="h-5 w-5" /> },
    { id: 'system' as const, label: 'Sistema', icon: <Monitor className="h-5 w-5" /> },
  ]

  const fontSizes = [
    { id: 'small'  as const, label: 'Pequeño' },
    { id: 'normal' as const, label: 'Normal' },
    { id: 'large'  as const, label: 'Grande' },
    { id: 'xl'     as const, label: 'Extra grande' },
  ]

  return (
    <div className="space-y-6">
      <Section title="Tema de la interfaz">
        <div className="grid grid-cols-3 gap-3">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              aria-pressed={theme === t.id}
              className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2
                ${theme === t.id
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
            >
              {t.icon}
              <span className="text-xs font-medium">{t.label}</span>
              {theme === t.id && (
                <span className="h-1.5 w-1.5 rounded-full bg-primary-600" aria-hidden="true" />
              )}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Tamaño de texto">
        <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
          Ajusta el tamaño base del texto en toda la aplicación.
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {fontSizes.map((f) => (
            <button
              key={f.id}
              onClick={() => setFontSize(f.id)}
              aria-pressed={fontSize === f.id}
              className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium transition-all
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600
                ${fontSize === f.id
                  ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                  : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
            >
              <Type className="h-3.5 w-3.5 shrink-0" />
              {f.label}
            </button>
          ))}
        </div>
      </Section>

      <Section title="Movimiento y animaciones">
        <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
          <SettingToggle
            label="Reducir animaciones"
            description="Desactiva las transiciones y animaciones de la interfaz para mejorar el rendimiento o reducir distracciones."
            checked={reducedMotion}
            onChange={setReducedMotion}
          />
        </div>
      </Section>
    </div>
  )
}

// ─── TAB C: Accesibilidad ────────────────────────────────────────────────────
function TabAccesibilidad() {
  const {
    highContrast, setHighContrast,
    showIconLabels, setShowIconLabels,
    focusEnhanced, setFocusEnhanced,
  } = useAccessibilityStore()

  return (
    <div className="space-y-6">
      <Section title="Visibilidad">
        <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
          <SettingToggle
            label="Alto contraste"
            description="Aumenta el contraste de colores para mejorar la legibilidad."
            checked={highContrast}
            onChange={setHighContrast}
          />
          <SettingToggle
            label="Mostrar etiquetas en botones de icono"
            description="Añade texto descriptivo junto a los botones que solo muestran un icono."
            checked={showIconLabels}
            onChange={setShowIconLabels}
          />
          <SettingToggle
            label="Indicadores de foco mejorados"
            description="Hace más visibles los contornos de foco al navegar con teclado."
            checked={focusEnhanced}
            onChange={setFocusEnhanced}
          />
        </div>
      </Section>

      <Section title="Navegación por teclado">
        <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
            <span>Saltar al contenido principal</span>
            <kbd className="rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-0.5 text-xs font-mono text-gray-700 dark:text-gray-300">Tab → Enter</kbd>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
            <span>Cerrar menú móvil</span>
            <kbd className="rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-0.5 text-xs font-mono text-gray-700 dark:text-gray-300">Esc</kbd>
          </div>
          <div className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
            <span>Navegar entre tabs</span>
            <div className="flex gap-1">
              <kbd className="rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-0.5 text-xs font-mono text-gray-700 dark:text-gray-300">←</kbd>
              <kbd className="rounded border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-2 py-0.5 text-xs font-mono text-gray-700 dark:text-gray-300">→</kbd>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}

// ─── TAB D: Notificaciones ───────────────────────────────────────────────────
type NotifPrefs = {
  cosechas: boolean
  inversiones: boolean
  precios: boolean
  sistema: boolean
}

const NOTIF_KEY = 'agronest-notifications'

const NOTIF_ITEMS: { key: keyof NotifPrefs; label: string; description: string }[] = [
  {
    key: 'cosechas',
    label: 'Actualizaciones de cosechas',
    description: 'Notificaciones cuando el estado de tus cosechas cambia.',
  },
  {
    key: 'inversiones',
    label: 'Actividad de inversiones',
    description: 'Alertas sobre nuevas inversiones y retornos disponibles.',
  },
  {
    key: 'precios',
    label: 'Alertas de precio',
    description: 'Cambios relevantes en el precio de los tokens bCROP.',
  },
  {
    key: 'sistema',
    label: 'Actualizaciones del sistema',
    description: 'Mantenimientos, nuevas funcionalidades y avisos de la plataforma.',
  },
]

function TabNotificaciones() {
  const [prefs, setPrefs] = useState<NotifPrefs>(() => {
    try {
      return JSON.parse(localStorage.getItem(NOTIF_KEY) ?? 'null') ?? {
        cosechas: true, inversiones: true, precios: false, sistema: true,
      }
    } catch {
      return { cosechas: true, inversiones: true, precios: false, sistema: true }
    }
  })

  useEffect(() => {
    localStorage.setItem(NOTIF_KEY, JSON.stringify(prefs))
  }, [prefs])

  const toggle = (key: keyof NotifPrefs) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }))

  return (
    <div className="space-y-6">
      <Section title="Preferencias de notificación">
        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
          Estas preferencias son locales a este dispositivo.
        </p>
        <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
          {NOTIF_ITEMS.map((item) => (
            <SettingToggle
              key={item.key}
              label={item.label}
              description={item.description}
              checked={prefs[item.key]}
              onChange={() => toggle(item.key)}
            />
          ))}
        </div>
      </Section>

      <Section title="Canales">
        <div className="space-y-3">
          {[
            { label: 'Notificaciones en la app', active: true },
            { label: 'Correo electrónico', active: false },
            { label: 'Push (móvil)', active: false },
          ].map(({ label, active }) => (
            <div key={label} className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-700/50 px-4 py-3 text-sm">
              <span className="text-gray-700 dark:text-gray-300">{label}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${active ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400'}`}>
                {active ? 'Activo' : 'Próximamente'}
              </span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

// ─── TAB E: Seguridad ────────────────────────────────────────────────────────
function TabSeguridad() {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const logout = useLogout()

  return (
    <div className="space-y-6">
      <Section title="Estado de la cuenta">
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
            <Clock className="h-4 w-4 shrink-0 text-gray-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Último acceso</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Hoy a las {new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 px-4 py-3">
            <Laptop className="h-4 w-4 shrink-0 text-gray-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Sesiones activas</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">1 sesión — Este dispositivo</p>
            </div>
            <span className="h-2 w-2 rounded-full bg-green-500" aria-label="activo" />
          </div>
        </div>
      </Section>

      <Section title="Contraseña">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña actual</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Última actualización: administrada por el sistema</p>
          </div>
          <span className="text-sm tracking-widest text-gray-400">••••••••</span>
        </div>
        <div className="mt-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => dialogRef.current?.showModal()}
          >
            <Lock className="h-3.5 w-3.5" />
            Cambiar contraseña
          </Button>
        </div>
      </Section>

      <Section title="Autenticación de dos factores">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">2FA</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Añade una capa extra de seguridad a tu cuenta.</p>
          </div>
          <span className="rounded-full bg-gray-100 dark:bg-gray-700 px-2.5 py-0.5 text-xs font-medium text-gray-500 dark:text-gray-400">
            Próximamente
          </span>
        </div>
      </Section>

      {/* Zona de peligro */}
      <div className="rounded-xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10 p-6">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <h2 className="text-base font-semibold text-red-700 dark:text-red-400">Zona de peligro</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Cerrar todas las sesiones</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Cierra tu sesión en todos los dispositivos.</p>
          </div>
          <Button
            variant="danger"
            size="sm"
            isLoading={logout.isPending}
            onClick={() => logout.mutate()}
          >
            <LogOut className="h-3.5 w-3.5" />
            Cerrar sesiones
          </Button>
        </div>
      </div>

      {/* Dialog cambiar contraseña */}
      <dialog
        ref={dialogRef}
        className="rounded-xl shadow-2xl p-6 max-w-md w-full backdrop:bg-black/50 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold">Cambiar contraseña</h3>
          <button
            onClick={() => dialogRef.current?.close()}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          El cambio de contraseña estará disponible próximamente. Por ahora, puedes contactar al administrador de la plataforma si necesitas restablecer tu contraseña.
        </p>
        <Button variant="secondary" size="sm" onClick={() => dialogRef.current?.close()}>
          Entendido
        </Button>
      </dialog>
    </div>
  )
}

// ─── TAB F: Cartera ──────────────────────────────────────────────────────────
function TabCartera() {
  const { metaMaskAddress, isConnecting, connectMetaMask, disconnectMetaMask } = useWalletStore()
  const addToast = useToastStore((s) => s.addToast)

  const copyAddress = async () => {
    if (!metaMaskAddress) return
    await navigator.clipboard.writeText(metaMaskAddress)
    addToast({ type: 'success', message: 'Dirección copiada al portapapeles.' })
  }

  const chainId =
    typeof window !== 'undefined' && window.ethereum
      ? 'Ethereum / Red detectada'
      : null

  return (
    <div className="space-y-6">
      <Section title="MetaMask">
        {metaMaskAddress ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-4">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Dirección conectada</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 truncate text-sm font-mono text-gray-900 dark:text-gray-100">
                  {metaMaskAddress}
                </code>
                <button
                  onClick={copyAddress}
                  className="shrink-0 rounded-md p-1.5 text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                  aria-label="Copiar dirección"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="rounded-lg bg-gray-50 dark:bg-gray-700/50 p-4">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Red activa</p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{chainId ?? 'No detectada'}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
              <span className="text-sm text-green-700 dark:text-green-400 font-medium">Conectado</span>
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={disconnectMetaMask}
            >
              Desconectar MetaMask
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="h-2 w-2 rounded-full bg-gray-300 dark:bg-gray-600 shrink-0" />
              No hay cartera conectada
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Conecta MetaMask para interactuar con contratos inteligentes, firmar transacciones y gestionar tus activos en la blockchain.
            </p>
            <Button
              variant="primary"
              size="sm"
              isLoading={isConnecting}
              onClick={connectMetaMask}
            >
              <Wallet className="h-3.5 w-3.5" />
              Conectar MetaMask
            </Button>
          </div>
        )}
      </Section>

      <Section title="Información de la red">
        <div className="space-y-2 text-sm">
          {[
            { label: 'Protocolo', value: 'Ethereum EVM compatible' },
            { label: 'Tokens soportados', value: 'USDC, bCROP' },
            { label: 'Estándar NFT', value: 'ERC-721 (cosechas tokenizadas)' },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
              <span className="text-gray-500 dark:text-gray-400">{label}</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">{value}</span>
            </div>
          ))}
        </div>
      </Section>
    </div>
  )
}

// ─── Componente principal ────────────────────────────────────────────────────
export function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>('perfil')

  // Navegación por teclado con ← →
  const handleTabKeyDown = (e: React.KeyboardEvent, index: number) => {
    const total = TABS.length
    let next = -1
    if (e.key === 'ArrowRight') next = (index + 1) % total
    if (e.key === 'ArrowLeft')  next = (index - 1 + total) % total
    if (next >= 0) {
      const nextTab = TABS[next]
      if (nextTab) {
        setActiveTab(nextTab.id)
        document.getElementById(`tab-${nextTab.id}`)?.focus()
      }
    }
  }

  const tabContent: Record<Tab, React.ReactNode> = {
    perfil:         <TabPerfil />,
    apariencia:     <TabApariencia />,
    accesibilidad:  <TabAccesibilidad />,
    notificaciones: <TabNotificaciones />,
    seguridad:      <TabSeguridad />,
    cartera:        <TabCartera />,
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Configuración</h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Gestiona tu perfil, apariencia y preferencias de AgroNest
          </p>
        </div>

        {/* Tablist */}
        <div
          role="tablist"
          aria-label="Secciones de configuración"
          className="flex gap-1 overflow-x-auto rounded-xl bg-gray-100 dark:bg-gray-800 p-1 scrollbar-hide"
        >
          {TABS.map((tab, i) => (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              onKeyDown={(e) => handleTabKeyDown(e, i)}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all whitespace-nowrap
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600
                ${activeTab === tab.id
                  ? 'bg-white dark:bg-gray-700 text-primary-700 dark:text-primary-300 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tab panels */}
        {TABS.map((tab) => (
          <div
            key={tab.id}
            id={`panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            hidden={activeTab !== tab.id}
          >
            {activeTab === tab.id && tabContent[tab.id]}
          </div>
        ))}

        {/* Quick nav footer */}
        <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 p-4">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-gray-400 dark:text-gray-500">
            Acceso rápido
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {TABS.filter((t) => t.id !== activeTab).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 dark:text-gray-400
                  hover:bg-white dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100 transition-colors text-left"
              >
                {tab.icon}
                <span className="truncate">{tab.label}</span>
                <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0 opacity-40" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </PageTransition>
  )
}
