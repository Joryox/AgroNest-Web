import { Outlet } from 'react-router'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center flex flex-col items-center">
          <img src="/media/Nest.png" alt="AgroNest Logo" className="w-40 h-auto mb-2 drop-shadow-md" />
          <h1 className="text-4xl font-bold text-primary-700">AgroNest</h1>
          <p className="mt-2 text-sm text-gray-600 font-medium">Finanzas descentralizadas para el campo</p>
        </div>
        <div className="rounded-xl bg-white px-8 py-8 shadow-lg ring-1 ring-gray-950/5">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
