import { useRef, useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router'
import { Menu, X } from 'lucide-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChartPie, faWheatAwn, faTractor, faCoins, faWallet,
  faBolt, faRightFromBracket, faStore, faBuildingColumns,
} from '@fortawesome/free-solid-svg-icons'
import { faCircleUser } from '@fortawesome/free-regular-svg-icons'
import { useAuthStore, useLogout } from '@/features/auth'
import { Spinner, ThemeToggle } from '@/shared/components'
import { WalletWidget } from '@/features/wallet'
import { useAccessibilityStore } from '@/store/accessibilityStore'

type Role = 'agricultor' | 'inversor' | 'admin'

const navItems: { to: string; label: string; icon: any; roles: Role[] }[] = [
  { to: '/dashboard',          label: 'Mi Resumen',       icon: faChartPie, roles: ['agricultor', 'inversor', 'admin'] },
  { to: '/cosechas',           label: 'Explorar Cultivos', icon: faWheatAwn, roles: ['inversor', 'admin'] },
  { to: '/mis-cosechas',       label: 'Mis Cultivos',     icon: faTractor, roles: ['agricultor', 'admin'] },
  { to: '/inversiones',        label: 'Mis Apoyos',       icon: faCoins, roles: ['inversor', 'admin'] },
  { to: '/marketplace',        label: 'Mercado Secundario',icon: faStore, roles: ['inversor', 'admin'] },
  { to: '/etherfuse/portfolio',label: 'Ahorro Fijo',      icon: faBuildingColumns, roles: ['inversor', 'admin'] },
  { to: '/wallet',             label: 'Mi Dinero',        icon: faWallet, roles: ['agricultor', 'inversor', 'admin'] },
  { to: '/oracle',             label: 'Actualizar Estados',icon: faBolt, roles: ['admin'] },
  { to: '/profile',            label: 'Mi Perfil',        icon: faCircleUser, roles: ['agricultor', 'inversor', 'admin'] },
]

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()
  const sidebarRef = useRef<HTMLElement>(null)
  const showIconLabels = useAccessibilityStore((s) => s.showIconLabels)

  // Close sidebar on Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && sidebarOpen) setSidebarOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [sidebarOpen])

  // Focus trap for mobile sidebar
  useEffect(() => {
    if (!sidebarOpen || !sidebarRef.current) return
    const focusable = sidebarRef.current.querySelectorAll<HTMLElement>(
      'a, button, [tabindex]:not([tabindex="-1"])',
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    first?.focus()

    function trap(e: KeyboardEvent) {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus() }
      }
    }
    document.addEventListener('keydown', trap)
    return () => document.removeEventListener('keydown', trap)
  }, [sidebarOpen])

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        id="main-sidebar"
        aria-label="Menú principal"
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-primary-900
          bg-primary-800 dark:bg-gray-900 dark:border-gray-700 transition-transform duration-200
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-primary-700 dark:border-gray-700 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
            <FontAwesomeIcon icon={faWheatAwn} className="h-4 w-4 text-white" aria-hidden="true" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">AgroNest</span>
        </div>

        <nav
          role="navigation"
          aria-label="Navegación principal"
          className="flex-1 overflow-y-auto px-3 py-4"
        >
          {navItems
            .filter((item) => user && item.roles.includes(user.role as Role))
            .map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors mb-1
                ${isActive
                  ? 'bg-primary-600 text-white shadow-sm'
                  : 'text-primary-100 hover:bg-primary-700 hover:text-white dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'}`
              }
            >
              {({ isActive }) => (
                <>
                  <FontAwesomeIcon
                    icon={icon}
                    className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-primary-300 dark:text-gray-400'}`}
                    aria-hidden="true"
                  />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User info + logout */}
        <div className="border-t border-primary-700 dark:border-gray-700 p-4">
          <div className="mb-3 flex items-center gap-3 px-2">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-600 text-xs font-bold text-white">
              {user?.firstName?.[0]?.toUpperCase() ?? '?'}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="truncate text-xs text-primary-300 dark:text-gray-400">@{user?.username}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
              text-primary-200 transition-colors hover:bg-primary-700 hover:text-white
              dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white
              disabled:opacity-50"
            aria-label="Cerrar sesión"
          >
            {logout.isPending ? <Spinner size="sm" /> : <FontAwesomeIcon icon={faRightFromBracket} className="h-4 w-4 shrink-0" aria-hidden="true" />}
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header role="banner" className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 dark:bg-gray-800 dark:border-gray-700 md:px-6">
          <button
            type="button"
            className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 md:hidden
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú de navegación"
            aria-expanded={sidebarOpen}
            aria-controls="main-sidebar"
          >
            {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <WalletWidget />
            <ThemeToggle showLabel={showIconLabels} />
            <div
              aria-hidden="true"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900 text-sm font-semibold text-primary-700 dark:text-primary-300"
            >
              {user?.firstName?.[0]?.toUpperCase() ?? '?'}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main id="main-content" className="flex-1 overflow-y-auto p-4 md:p-6" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
