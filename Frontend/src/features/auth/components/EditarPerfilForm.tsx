import { useState } from 'react'
import { Pencil, X } from 'lucide-react'
import { useAuthStore } from '../store'
import { useEditarPerfil } from '../hooks'
import { Input, Button } from '@/shared/components'

export function EditarPerfilForm() {
  const user = useAuthStore((s) => s.user)
  const editarPerfil = useEditarPerfil()
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({
    nombres: user?.firstName ?? '',
    apellidos: user?.lastName ?? '',
    correo: user?.email ?? '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.nombres.trim()) errs.nombres = 'El nombre es requerido'
    if (!form.apellidos.trim()) errs.apellidos = 'Los apellidos son requeridos'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo)) errs.correo = 'Correo inválido'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    editarPerfil.mutate(
      { nombres: form.nombres, apellidos: form.apellidos, correo: form.correo },
      { onSuccess: () => setIsEditing(false) },
    )
  }

  function handleCancel() {
    setForm({
      nombres: user?.firstName ?? '',
      apellidos: user?.lastName ?? '',
      correo: user?.email ?? '',
    })
    setErrors({})
    setIsEditing(false)
  }

  if (!isEditing) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Nombre</p>
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{user?.firstName}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Apellidos</p>
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{user?.lastName}</p>
          </div>
          <div className="col-span-2">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Correo</p>
            <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{user?.email}</p>
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setIsEditing(true)}
        >
          <Pencil className="h-3.5 w-3.5" />
          Editar perfil
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Nombre"
          value={form.nombres}
          onChange={(e) => setForm(f => ({ ...f, nombres: e.target.value }))}
          error={errors.nombres}
          autoFocus
        />
        <Input
          label="Apellidos"
          value={form.apellidos}
          onChange={(e) => setForm(f => ({ ...f, apellidos: e.target.value }))}
          error={errors.apellidos}
        />
        <div className="sm:col-span-2">
          <Input
            label="Correo electrónico"
            type="email"
            value={form.correo}
            onChange={(e) => setForm(f => ({ ...f, correo: e.target.value }))}
            error={errors.correo}
          />
        </div>
      </div>
      <div className="flex gap-3">
        <Button type="submit" size="sm" isLoading={editarPerfil.isPending}>
          Guardar cambios
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={handleCancel}>
          <X className="h-3.5 w-3.5" />
          Cancelar
        </Button>
      </div>
    </form>
  )
}
