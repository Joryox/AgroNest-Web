import { type FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { isAxiosError } from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Button, Input, Select } from '@/shared/components'
import { apiClient } from '@/lib/axios'
import { authApi } from '../api'
import { useAuthStore } from '../store'
import { useToastStore } from '@/store/toastStore'
import type { ApiError } from '@/types/api'

export function RegisterPage() {
  const navigate = useNavigate()
  const { setAuth, setTokens, clearAuth } = useAuthStore.getState()
  const addToast = useToastStore((s) => s.addToast)

  const [form, setForm] = useState({
    usuario: '',
    nombres: '',
    apellidos: '',
    correo: '',
    password_hash: '',
    rol: 'inversor',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    try {
      await apiClient.post('/usuarios', form)
      const tokenResp = await authApi.login({
        username: form.usuario,
        password: form.password_hash,
      })
      setTokens(tokenResp.access_token, tokenResp.refresh_token)
      const user = await authApi.getMe()
      setAuth(user, {
        accessToken: tokenResp.access_token,
        refreshToken: tokenResp.refresh_token,
      })
      addToast({ type: 'success', message: `¡Bienvenido a AgroNest, ${user.firstName}!` })
      navigate('/dashboard', { replace: true })
    } catch (err) {
      clearAuth()
      const apiErr = isAxiosError(err)
        ? (err.response?.data as ApiError | undefined)
        : undefined
      setError(apiErr?.message ?? 'Error al registrarse. Intenta de nuevo.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="mb-2">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
          <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" />
          Volver al inicio
        </Link>
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Crear cuenta</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Únete a la red agrícola descentralizada</p>
      </div>

      <Input
        label="Usuario"
        type="text"
        value={form.usuario}
        onChange={(e) => set('usuario', e.target.value)}
        placeholder="mi_usuario"
        autoComplete="username"
        required
        aria-required="true"
      />

      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Nombres"
          type="text"
          value={form.nombres}
          onChange={(e) => set('nombres', e.target.value)}
          placeholder="Juan"
          required
          aria-required="true"
        />
        <Input
          label="Apellidos"
          type="text"
          value={form.apellidos}
          onChange={(e) => set('apellidos', e.target.value)}
          placeholder="Pérez"
          required
          aria-required="true"
        />
      </div>

      <Input
        label="Correo electrónico"
        type="email"
        value={form.correo}
        onChange={(e) => set('correo', e.target.value)}
        placeholder="correo@ejemplo.com"
        autoComplete="email"
        required
        aria-required="true"
      />

      <Select
        label="¿Cómo usarás AgroNest?"
        value={form.rol}
        onChange={(e) => set('rol', e.target.value)}
        options={[
          { value: 'inversor', label: 'Soy Inversor — quiero financiar cosechas' },
          { value: 'agricultor', label: 'Soy Agricultor — quiero tokenizar mi cosecha' },
        ]}
        required
        aria-required="true"
      />

      {/* Password con show/hide */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Contraseña <span aria-hidden="true" className="ml-0.5 text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={form.password_hash}
            onChange={(e) => set('password_hash', e.target.value)}
            placeholder="••••••••"
            autoComplete="new-password"
            required
            aria-required="true"
            aria-describedby="password-helper"
            className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 text-sm text-gray-900
              placeholder-gray-400 bg-white outline-none transition-colors
              dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500
              focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-gray-600
              dark:text-gray-500 dark:hover:text-gray-300
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 rounded-r-md"
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className="h-4 w-4"
              aria-hidden="true"
            />
          </button>
        </div>
        <p id="password-helper" className="text-xs text-gray-500 dark:text-gray-400">
          Mínimo 8 caracteres
        </p>
      </div>

      {error && (
        <p className="text-sm text-red-600" role="alert">{error}</p>
      )}

      <Button type="submit" isLoading={isLoading} className="w-full">
        {isLoading ? 'Creando cuenta...' : 'Registrarse'}
      </Button>

      <p className="text-center text-sm text-gray-500">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
          Inicia sesión
        </Link>
      </p>
    </form>
  )
}
