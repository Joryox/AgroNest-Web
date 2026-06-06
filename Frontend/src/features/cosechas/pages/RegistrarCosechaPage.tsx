import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWheatAwn, faSpinner, faCheck } from '@fortawesome/free-solid-svg-icons'
import { isAxiosError } from 'axios'
import { Button, Input, Select, PageTransition, ProgressBar, PageHeader, ErrorState } from '@/shared/components'
import { useRegistrarCosecha } from '../hooks'

const GRAIN_OPTIONS = [
  { value: 'Maiz',   label: 'Maíz' },
  { value: 'Trigo',  label: 'Trigo' },
  { value: 'Soja',   label: 'Soja' },
  { value: 'Arroz',  label: 'Arroz' },
  { value: 'Sorgo',  label: 'Sorgo' },
  { value: 'Cafe',   label: 'Café' },
  { value: 'Otro',   label: 'Otro' },
]

interface FormErrors {
  hectareas?: string
  rendimiento_kg?: string
  capital_requerido?: string
  fecha_cosecha?: string
}

function validateForm(form: {
  hectareas: string
  rendimiento_kg: string
  capital_requerido: string
  fecha_cosecha: string
}): FormErrors {
  const errors: FormErrors = {}
  if (!form.hectareas || Number(form.hectareas) <= 0)
    errors.hectareas = 'Debe ser mayor a 0'
  if (!form.rendimiento_kg || Number(form.rendimiento_kg) <= 0)
    errors.rendimiento_kg = 'Debe ser mayor a 0'
  if (!form.capital_requerido || Number(form.capital_requerido) <= 0)
    errors.capital_requerido = 'Debe ser mayor a 0'
  if (!form.fecha_cosecha)
    errors.fecha_cosecha = 'Selecciona una fecha'
  else if (new Date(form.fecha_cosecha) <= new Date())
    errors.fecha_cosecha = 'La fecha debe ser en el futuro'
  return errors
}

export function RegistrarCosechaPage() {
  const navigate = useNavigate()
  const registrar = useRegistrarCosecha()

  const [form, setForm] = useState({
    tipo_grano: 'Maiz',
    hectareas: '',
    rendimiento_kg: '',
    capital_requerido: '',
    fecha_cosecha: '',
    latitud: '',
    longitud: '',
  })
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({})
  const [submitted, setSubmitted] = useState(false)

  function set(field: string, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
    if (submitted) {
      const newErrors = validateForm({ ...form, [field]: value })
      setFieldErrors(newErrors)
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    const errors = validateForm(form)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }
    registrar.mutate(
      {
        tipo_grano: form.tipo_grano,
        hectareas: Number(form.hectareas),
        rendimiento_kg: Number(form.rendimiento_kg),
        capital_requerido: Number(form.capital_requerido),
        fecha_cosecha: form.fecha_cosecha,
        ...(form.latitud  ? { latitud:  Number(form.latitud)  } : {}),
        ...(form.longitud ? { longitud: Number(form.longitud) } : {}),
      },
      { onSuccess: () => navigate('/mis-cosechas') },
    )
  }

  const apiErrorMsg = registrar.isError && isAxiosError(registrar.error)
    ? (registrar.error.response?.data?.detail ?? 'No se pudo registrar la cosecha.')
    : registrar.isError ? 'No se pudo registrar la cosecha.' : null

  return (
    <PageTransition>
      <div className="mx-auto max-w-xl space-y-6">
        <PageHeader
          icon={<FontAwesomeIcon icon={faWheatAwn} className="h-5 w-5 text-primary-600 dark:text-primary-400" aria-hidden="true" />}
          title="Registrar Cosecha"
          description="Tu cosecha será tokenizada como un NFT en la blockchain de Ethereum."
        />

        {registrar.isPending && (
          <div className="space-y-3">
            <ProgressBar />
            <div className="rounded-lg border border-primary-200 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-800 p-4">
              <ul className="space-y-2 text-sm text-primary-700 dark:text-primary-300" aria-live="polite">
                <li className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faSpinner} className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  Firmando y enviando transacción…
                </li>
                <li className="flex items-center gap-2 text-primary-500 dark:text-primary-500">
                  <FontAwesomeIcon icon={faCheck} className="h-3.5 w-3.5 opacity-40" aria-hidden="true" />
                  Minteando NFT de cosecha
                </li>
                <li className="flex items-center gap-2 text-primary-500 dark:text-primary-500">
                  <FontAwesomeIcon icon={faCheck} className="h-3.5 w-3.5 opacity-40" aria-hidden="true" />
                  Guardando en base de datos
                </li>
              </ul>
              <p className="mt-2 text-xs text-primary-500 dark:text-primary-500">Esto puede tomar hasta 60 segundos.</p>
            </div>
          </div>
        )}

        {apiErrorMsg && !registrar.isPending && (
          <ErrorState
            title="Error al registrar cosecha"
            description={apiErrorMsg}
            onRetry={() => registrar.reset()}
          />
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          aria-label="Formulario de registro de cosecha"
          className="space-y-4 rounded-xl bg-white dark:bg-gray-800 p-6 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700"
        >
          <Select
            label="Tipo de grano"
            options={GRAIN_OPTIONS}
            value={form.tipo_grano}
            onChange={(e) => set('tipo_grano', e.target.value)}
            required
          />

          <Input
            label="Hectáreas"
            type="number"
            min="0"
            step="0.01"
            value={form.hectareas}
            onChange={(e) => set('hectareas', e.target.value)}
            placeholder="ej. 50.5"
            required
            aria-required="true"
            error={fieldErrors.hectareas}
            helperText="Superficie total de cultivo"
          />

          <Input
            label="Rendimiento estimado (kg)"
            type="number"
            min="0"
            value={form.rendimiento_kg}
            onChange={(e) => set('rendimiento_kg', e.target.value)}
            placeholder="ej. 15000"
            required
            aria-required="true"
            error={fieldErrors.rendimiento_kg}
          />

          <Input
            label="Capital requerido (USDC)"
            type="number"
            min="0"
            step="0.01"
            value={form.capital_requerido}
            onChange={(e) => set('capital_requerido', e.target.value)}
            placeholder="ej. 5000"
            required
            aria-required="true"
            error={fieldErrors.capital_requerido}
          />

          <Input
            label="Fecha de cosecha"
            type="date"
            value={form.fecha_cosecha}
            onChange={(e) => set('fecha_cosecha', e.target.value)}
            required
            aria-required="true"
            error={fieldErrors.fecha_cosecha}
            helperText="Debe ser una fecha futura"
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Latitud (opcional)"
              type="number"
              step="0.0001"
              min="-90"
              max="90"
              value={form.latitud}
              onChange={(e) => set('latitud', e.target.value)}
              placeholder="ej. 20.6597"
              helperText="Para verificación satelital NASA"
            />
            <Input
              label="Longitud (opcional)"
              type="number"
              step="0.0001"
              min="-180"
              max="180"
              value={form.longitud}
              onChange={(e) => set('longitud', e.target.value)}
              placeholder="ej. -103.3496"
              helperText="Coordenadas del terreno"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => navigate(-1)} className="flex-1">
              Cancelar
            </Button>
            <Button
              type="submit"
              isLoading={registrar.isPending}
              disabled={registrar.isPending}
              className="flex-1"
            >
              {registrar.isPending ? 'Minteando NFT…' : 'Registrar Cosecha'}
            </Button>
          </div>
        </form>
      </div>
    </PageTransition>
  )
}
