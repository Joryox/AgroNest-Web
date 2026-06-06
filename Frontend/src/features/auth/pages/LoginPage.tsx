import { type FormEvent, useState } from 'react'
import { isAxiosError } from 'axios'
import { Link } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { useLogin } from '../hooks'
import { Button, Input } from '@/shared/components'
import type { ApiError } from '@/types/api'

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const login = useLogin()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    login.mutate({ username, password })
  }

  const apiError = isAxiosError(login.error)
    ? (login.error.response?.data as ApiError | undefined)
    : undefined

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="mb-2">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
          <FontAwesomeIcon icon={faArrowLeft} className="w-3.5 h-3.5" />
          Volver al inicio
        </Link>
      </div>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Iniciar sesión</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Ingresa tus credenciales para continuar</p>
      </div>

      <Input
        label="Usuario o correo"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="tu_usuario o correo@ejemplo.com"
        error={apiError?.details?.['username']?.[0]}
        autoComplete="username"
        required
        aria-required="true"
      />

      {/* Password field with show/hide toggle */}
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Contraseña
        </label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
            aria-required="true"
            aria-invalid={!!apiError?.details?.['password']?.[0]}
            className={`w-full rounded-md border px-3 py-2 pr-10 text-sm text-gray-900 placeholder-gray-400
              bg-white outline-none transition-colors
              dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100 dark:placeholder-gray-500
              focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20
              ${apiError?.details?.['password']?.[0] ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300'}`}
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
        {apiError?.details?.['password']?.[0] && (
          <p className="text-xs text-red-600 dark:text-red-400" role="alert">
            {apiError.details['password'][0]}
          </p>
        )}
      </div>

      {login.isError && (
        <p className="text-sm text-red-600" role="alert">
          {apiError?.message ?? 'Credenciales inválidas. Intenta de nuevo.'}
        </p>
      )}

      <Button type="submit" isLoading={login.isPending} className="w-full">
        Ingresar
      </Button>

      <p className="text-center text-sm text-gray-500">
        ¿No tienes cuenta?{' '}
        <Link to="/registro" className="font-medium text-primary-600 hover:text-primary-500">
          Regístrate aquí
        </Link>
      </p>
    </form>
  )
}
