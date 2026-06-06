import { type FormEvent, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { isAxiosError } from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins, faChartLine, faStore, faTag } from '@fortawesome/free-solid-svg-icons'
import {
  Badge, Button, Card, Input, Spinner, StatCard,
  PageTransition, ProgressBar, ConfirmDialog,
} from '@/shared/components'
import { useCosecha } from '../hooks'
import { useBovedaPorCosecha, useAbrirBoveda } from '@/features/boveda/hooks'
import { useInvertir, useInversionesPorCosecha } from '@/features/inversiones/hooks'
import { useAuthStore } from '@/features/auth'
import { useListings, useCrearListing } from '@/features/marketplace'
import { ChatAssistant } from '@/features/ai/ChatAssistant'
import type { CosechaContext } from '@/features/ai/api'
import { SateliteWidget } from '@/features/oracle/components'

function BovedaPanel({ cosechaId }: { cosechaId: number }) {
  const { data: boveda, isLoading, isError } = useBovedaPorCosecha(cosechaId)
  const abrirBoveda = useAbrirBoveda()
  const [showForm, setShowForm] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingData, setPendingData] = useState<{
    cosecha_id: number
    plazo_dias: number
    porcentaje_reserva: number
    porcentaje_rendimiento: number
  } | null>(null)
  const [form, setForm] = useState({
    plazo_dias: '30',
    porcentaje_reserva: '10',
    porcentaje_rendimiento: '8',
  })

  const abrirError = abrirBoveda.isError && isAxiosError(abrirBoveda.error)
    ? (abrirBoveda.error.response?.data?.detail ?? 'Error al abrir la bóveda.')
    : abrirBoveda.isError ? 'Error al abrir la bóveda.' : null

  if (isLoading) return <div className="flex justify-center py-4"><Spinner /></div>
  if (isError || !boveda) {
    return (
      <div className="rounded-xl border border-dashed border-gray-200 dark:border-gray-700 p-6 text-center">
        <p className="text-sm text-gray-500 dark:text-gray-400">No hay bóveda abierta para esta cosecha.</p>
        {!showForm ? (
          <Button className="mt-3" size="sm" onClick={() => setShowForm(true)}>
            <FontAwesomeIcon icon={faCoins} className="h-4 w-4" aria-hidden="true" />
            Abrir Bóveda de Financiamiento
          </Button>
        ) : (
          <form
            className="mt-4 space-y-3 text-left"
            onSubmit={(e) => {
              e.preventDefault()
              const data = {
                cosecha_id: cosechaId,
                plazo_dias: Number(form.plazo_dias),
                porcentaje_reserva: Number(form.porcentaje_reserva),
                porcentaje_rendimiento: Number(form.porcentaje_rendimiento),
              }
              setPendingData(data)
              setConfirmOpen(true)
            }}
          >
            <Input
              label="Plazo (días)"
              type="number"
              min="1"
              value={form.plazo_dias}
              onChange={(e) => setForm((f) => ({ ...f, plazo_dias: e.target.value }))}
              required
              helperText="Tiempo para alcanzar la meta de financiamiento"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="% Reserva"
                type="number"
                min="0"
                max="100"
                value={form.porcentaje_reserva}
                onChange={(e) => setForm((f) => ({ ...f, porcentaje_reserva: e.target.value }))}
                helperText="Fondo de protección"
              />
              <Input
                label="% Rendimiento"
                type="number"
                min="0"
                max="100"
                value={form.porcentaje_rendimiento}
                onChange={(e) => setForm((f) => ({ ...f, porcentaje_rendimiento: e.target.value }))}
                helperText="Retorno para inversores"
              />
            </div>
            {abrirBoveda.isPending && (
              <div className="space-y-2" aria-live="polite">
                <ProgressBar />
                <p className="text-xs text-primary-600 dark:text-primary-400">
                  ⛓️ Desplegando contratos en blockchain… Esto puede tardar.
                </p>
              </div>
            )}
            {abrirError && (
              <p role="alert" className="rounded-lg bg-red-50 dark:bg-red-900/20 px-3 py-2 text-xs text-red-700 dark:text-red-400">
                {abrirError}
              </p>
            )}
            <div className="flex gap-2">
              <Button type="button" variant="secondary" size="sm" onClick={() => setShowForm(false)}>
                Cancelar
              </Button>
              <Button type="submit" size="sm" isLoading={abrirBoveda.isPending}>
                Abrir Bóveda
              </Button>
            </div>
          </form>
        )}

        <ConfirmDialog
          open={confirmOpen}
          title="¿Abrir bóveda de financiamiento?"
          description="Esta operación desplegará 2 contratos en blockchain y tiene costo de gas. La acción no es reversible."
          confirmLabel="Sí, abrir bóveda"
          onConfirm={() => {
            setConfirmOpen(false)
            if (pendingData) {
              abrirBoveda.mutate(pendingData, { onSuccess: () => setShowForm(false) })
            }
          }}
          onCancel={() => setConfirmOpen(false)}
        />
      </div>
    )
  }

  const pct = boveda.metaFinanciamiento > 0
    ? Math.min((boveda.totalRecaudado / boveda.metaFinanciamiento) * 100, 100)
    : 0

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Estado de la Bóveda</h3>
        <Badge status={boveda.estado} />
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Meta" value={`$${boveda.metaFinanciamiento.toLocaleString()}`} />
        <StatCard label="Recaudado" value={`$${boveda.totalRecaudado.toFixed(0)}`} />
        <StatCard label="Rendimiento" value={`${boveda.porcentajeRendimiento}%`} />
        <StatCard label="Plazo" value={`${boveda.plazoDias} días`} />
      </div>
      <div>
        <div
          className="h-3 w-full rounded-full bg-gray-100 dark:bg-gray-700"
          role="progressbar"
          aria-valuenow={Math.round(pct)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`${pct.toFixed(1)}% financiado`}
        >
          <div
            className="h-3 rounded-full bg-primary-500 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-1 text-right text-xs text-primary-600 dark:text-primary-400 font-semibold">
          {pct.toFixed(1)}% financiado
        </p>
      </div>
      {boveda.vaultAddress && (
        <p className="font-mono text-xs text-gray-400 dark:text-gray-500" title={boveda.vaultAddress}>
          Vault: {boveda.vaultAddress.slice(0, 12)}...{boveda.vaultAddress.slice(-6)}
        </p>
      )}
    </div>
  )
}

function InvertirForm({ cosechaId }: { cosechaId: number }) {
  const [monto, setMonto] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const invertir = useInvertir()

  const invertirError = invertir.isError && isAxiosError(invertir.error)
    ? (invertir.error.response?.data?.detail ?? 'Error al procesar la inversión.')
    : invertir.isError ? 'Error al procesar la inversión.' : null

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!monto || Number(monto) <= 0) return
    setConfirmOpen(true)
  }

  function confirmarInversion() {
    setConfirmOpen(false)
    invertir.mutate({ cosecha_id: cosechaId, monto_usdc: Number(monto) }, {
      onSuccess: () => setMonto(''),
    })
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Input
          label="Monto USDC"
          type="number"
          min="1"
          step="0.01"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          placeholder="ej. 500"
          required
          aria-required="true"
          helperText="Mínimo 1 USDC"
        />
        {invertir.isPending && (
          <div aria-live="polite" className="space-y-1">
            <ProgressBar />
            <p className="text-xs text-primary-600 dark:text-primary-400">⛓️ Procesando transacción…</p>
          </div>
        )}
        {invertirError && (
          <p role="alert" className="rounded-lg bg-red-50 dark:bg-red-900/20 px-3 py-2 text-xs text-red-700 dark:text-red-400">
            {invertirError}
          </p>
        )}
        <Button
          type="submit"
          isLoading={invertir.isPending}
          disabled={!monto || Number(monto) <= 0}
        >
          <FontAwesomeIcon icon={faChartLine} className="h-4 w-4" aria-hidden="true" />
          {invertir.isPending ? 'Procesando…' : 'Invertir'}
        </Button>
      </form>

      <ConfirmDialog
        open={confirmOpen}
        title={`¿Confirmar inversión de $${monto} USDC?`}
        description="Esta operación ejecutará una transacción en blockchain comprometiendo tus fondos USDC. Recibirás tokens bCROP a cambio."
        confirmLabel="Sí, invertir"
        onConfirm={confirmarInversion}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  )
}

function ListarNFTPanel({ cosechaId, tokenId }: { cosechaId: number; tokenId: number }) {
  const [precio, setPrecio] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const crearListing = useCrearListing()
  const { data: listings } = useListings()
  const activeListing = listings?.data.find((l) => l.cosechaId === cosechaId && l.estado === 'ACTIVE')

  if (activeListing) {
    return (
      <div className="flex items-center justify-between rounded-lg bg-primary-50 dark:bg-primary-900/20 px-4 py-3">
        <div>
          <p className="text-sm font-medium text-primary-700 dark:text-primary-300">
            NFT listado en marketplace
          </p>
          <p className="text-xs text-primary-500">{activeListing.precio?.toFixed(4)} {activeListing.currency}</p>
        </div>
        <Link to={`/marketplace/${activeListing.id}`}>
          <Button size="sm" variant="secondary">
            <FontAwesomeIcon icon={faStore} className="h-4 w-4" />
            Ver en marketplace
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-3">
        <Input
          label="Precio (ETH)"
          type="number"
          min="0.0001"
          step="0.0001"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
          placeholder="ej. 0.05"
          helperText="Precio de venta en ETH para el marketplace Rare Protocol"
        />
        {crearListing.isError && (
          <p className="text-xs text-red-600 dark:text-red-400">
            Error al crear listing.
          </p>
        )}
        <Button
          size="sm"
          disabled={!precio}
          isLoading={crearListing.isPending}
          onClick={() => setConfirmOpen(true)}
        >
          <FontAwesomeIcon icon={faTag} className="h-4 w-4" />
          Listar en marketplace
        </Button>
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title={`¿Listar NFT #${tokenId} por ${precio} ETH?`}
        description="El NFT aparecerá en el marketplace de Rare Protocol. Podrás cancelar el listing en cualquier momento."
        confirmLabel="Sí, listar"
        onConfirm={() => {
          setConfirmOpen(false)
          crearListing.mutate({ cosechaId, precio: parseFloat(precio), currency: 'ETH' })
        }}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  )
}

export function CosechaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const cosechaId = Number(id)
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const { data: cosecha, isLoading, isError } = useCosecha(cosechaId)
  const { data: inversiones } = useInversionesPorCosecha(cosechaId)

  if (isLoading) return <div className="flex justify-center py-16"><Spinner /></div>
  if (isError || !cosecha) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 dark:text-gray-400">Cosecha no encontrada.</p>
        <Button variant="secondary" className="mt-4" onClick={() => navigate(-1)}>Volver</Button>
      </div>
    )
  }

  const isOwner = user?.id === cosecha.propietarioId

  const cosechaContext: CosechaContext = {
    id: cosecha.id,
    tipo_grano: cosecha.tipoGrano,
    hectareas: cosecha.hectareas,
    capital_requerido: cosecha.capitalRequerido,
    estado: cosecha.estado,
    rendimiento_kg: cosecha.rendimientoKg,
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-3xl space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold capitalize text-gray-900 dark:text-gray-100">
              🌾 {cosecha.tipoGrano}
            </h1>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              ID #{cosecha.id} · Farm {cosecha.farmId?.slice(0, 8)}...
            </p>
          </div>
          <Badge status={cosecha.estado} />
        </div>

        {/* Cosecha info */}
        <Card>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Hectáreas</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{cosecha.hectareas}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Rendimiento est.</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{cosecha.rendimientoKg.toLocaleString()} kg</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Capital req.</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">${cosecha.capitalRequerido.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400 dark:text-gray-500">Fecha cosecha</p>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{cosecha.fechaCosecha}</p>
            </div>
          </div>
          {cosecha.nftTokenId != null && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 px-3 py-2">
              <span aria-hidden="true">🪙</span>
              <p className="text-sm font-medium text-primary-700 dark:text-primary-300">
                NFT Token #{cosecha.nftTokenId}
              </p>
              {cosecha.txHashMint && (
                <span className="font-mono text-xs text-primary-500 dark:text-primary-400">
                  TX: {cosecha.txHashMint.slice(0, 10)}...
                </span>
              )}
            </div>
          )}
        </Card>

        {/* Bóveda */}
        <Card header={<h2 className="font-semibold text-gray-700 dark:text-gray-300">💰 Bóveda DeFi</h2>}>
          <BovedaPanel cosechaId={cosechaId} />
        </Card>

        {/* Invertir (solo no-owner) */}
        {!isOwner && (
          <Card header={<h2 className="font-semibold text-gray-700 dark:text-gray-300">📈 Realizar Inversión</h2>}>
            <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
              Deposita USDC y recibe tokens bCROP que representan tu participación.
            </p>
            <InvertirForm cosechaId={cosechaId} />
          </Card>
        )}

        {/* Inversiones existentes */}
        {(inversiones ?? []).length > 0 && (
          <Card header={<h2 className="font-semibold text-gray-700 dark:text-gray-300">Inversiones registradas</h2>}>
            <div className="space-y-2">
              {(inversiones ?? []).map((inv, i) => (
                <div
                  key={inv.id}
                  className="flex items-center justify-between rounded-lg bg-gray-50 dark:bg-gray-800/50 p-3 text-sm animate-slide-up"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">${inv.montoUsdc} USDC</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      {inv.bcropRecibido} bCROP · {inv.txHashDeposit?.slice(0, 10)}...
                    </p>
                  </div>
                  <Badge status={inv.reclamado ? 'LIQUIDATED' : 'ACTIVE'} />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Rare Protocol NFT Marketplace */}
        {isOwner && cosecha.nftTokenId != null && (
          <Card header={
            <h2 className="font-semibold text-gray-700 dark:text-gray-300">
              <FontAwesomeIcon icon={faStore} className="mr-2 h-4 w-4 text-violet-500" />
              Marketplace NFT · Rare Protocol
            </h2>
          }>
            <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
              Lista este NFT de cosecha en el marketplace powered by Rare Protocol / SuperRare.
            </p>
            <ListarNFTPanel cosechaId={cosechaId} tokenId={cosecha.nftTokenId} />
          </Card>
        )}

        {/* Vista satelital NASA NDVI */}
        <Card header={<h2 className="font-semibold text-gray-700 dark:text-gray-300">🛰️ Vista Satelital · Chainlink / NASA</h2>}>
          <SateliteWidget
            lat={cosecha.latitud ?? undefined}
            lng={cosecha.longitud ?? undefined}
            tipoGrano={cosecha.tipoGrano}
          />
        </Card>

        {/* AgroAI con contexto de esta cosecha */}
        <Card header={<h2 className="font-semibold text-gray-700 dark:text-gray-300">🤖 AgroAI — Análisis de cosecha</h2>}>
          <p className="mb-3 text-xs text-gray-400 dark:text-gray-500">
            AgroAI conoce los datos de esta cosecha. Pregúntale sobre riesgos, rendimiento o estrategia.
          </p>
          <ChatAssistant cosechaContext={cosechaContext} />
        </Card>
      </div>
    </PageTransition>
  )
}
