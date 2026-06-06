import { useState } from 'react'
import { useNavigate } from 'react-router'
import { isAxiosError } from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIdCard, faCheckCircle, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { Button, Card, PageTransition } from '@/shared/components'
import { useWalletStore } from '@/features/wallet'
import { useIniciarOnboarding, useEtherfuseCustomer } from '../hooks'
import type { EtherfuseOnboardingResult } from '../types'

export function OnboardingPage() {
  const navigate = useNavigate()
  const metaMaskAddress = useWalletStore((s) => s.metaMaskAddress)
  const { data: cliente, isLoading: loadingCliente } = useEtherfuseCustomer()
  const iniciar = useIniciarOnboarding()
  const [result, setResult] = useState<EtherfuseOnboardingResult | null>(null)

  const error = iniciar.isError && isAxiosError(iniciar.error)
    ? (iniciar.error.response?.data?.detail ?? 'Error al iniciar el proceso KYC.')
    : iniciar.isError ? 'Error al iniciar el proceso KYC.' : null

  async function handleIniciar() {
    try {
      const res = await iniciar.mutateAsync(metaMaskAddress ?? undefined)
      setResult(res)
      if (res.presignedUrl) {
        window.open(res.presignedUrl, '_blank', 'noopener,noreferrer')
      }
    } catch { /* handled by isError */ }
  }

  if (loadingCliente) return null

  const yaRegistrado = cliente && cliente.kycStatus !== 'REJECTED'

  return (
    <PageTransition>
      <div className="mx-auto max-w-xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Verificación KYC — Etherfuse</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Conecta tu cuenta bancaria mexicana y empieza a operar CETES on-chain.
          </p>
        </div>

        {/* Pasos */}
        <ol className="space-y-4">
          {[
            { n: 1, label: 'Verifica tu identidad', desc: 'Completa el proceso KYC de Etherfuse (datos ficticios en sandbox).' },
            { n: 2, label: 'Vincula tu CLABE', desc: 'Conecta tu cuenta bancaria mexicana para depósitos y retiros.' },
            { n: 3, label: 'Compra CETES', desc: 'Convierte MXN en CETES tokenizados (bonos del gobierno mexicano).' },
            { n: 4, label: 'Genera rendimiento', desc: 'Tus CETES generan yield automáticamente mientras los mantienes.' },
          ].map(({ n, label, desc }) => (
            <li key={n} className="flex gap-4 rounded-xl bg-white dark:bg-gray-800 p-4 shadow-sm ring-1 ring-gray-200 dark:ring-gray-700">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/40 text-sm font-bold text-primary-700 dark:text-primary-300">
                {n}
              </span>
              <div>
                <p className="font-semibold text-gray-800 dark:text-gray-200">{label}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{desc}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Estado actual */}
        {yaRegistrado && (
          <Card>
            <div className="flex items-center gap-3">
              <FontAwesomeIcon icon={faCheckCircle} className="h-6 w-6 text-green-500" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-gray-100">KYC iniciado</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Estado: <span className="font-medium capitalize">{cliente.kycStatus}</span>
                  {' · '}ID: {cliente.customerId.slice(0, 8)}…
                </p>
              </div>
            </div>
            {cliente.kycStatus === 'PENDING' && (
              <p className="mt-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 px-3 py-2 text-sm text-amber-700 dark:text-amber-300">
                Completa el formulario KYC en la ventana que se abrió. En sandbox, puedes usar datos ficticios.
              </p>
            )}
            <div className="mt-4 flex gap-3">
              <Button size="sm" onClick={() => navigate('/etherfuse/onramp')}>
                Comprar CETES
              </Button>
              <Button variant="secondary" size="sm" onClick={() => navigate('/etherfuse/portfolio')}>
                Ver portafolio
              </Button>
            </div>
          </Card>
        )}

        {/* Resultado reciente */}
        {result && result.presignedUrl && !yaRegistrado && (
          <Card>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
              Se abrió la ventana de KYC. Si no se abrió automáticamente, haz clic aquí:
            </p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.open(result.presignedUrl!, '_blank', 'noopener,noreferrer')}
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} className="h-4 w-4" />
              Abrir formulario KYC
            </Button>
          </Card>
        )}

        {error && (
          <p role="alert" className="rounded-lg bg-red-50 dark:bg-red-900/20 px-4 py-3 text-sm text-red-700 dark:text-red-400">
            {error}
          </p>
        )}

        {!yaRegistrado && !result && (
          <div className="flex gap-3">
            <Button onClick={handleIniciar} isLoading={iniciar.isPending}>
              <FontAwesomeIcon icon={faIdCard} className="h-4 w-4" />
              Iniciar verificación KYC
            </Button>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Volver
            </Button>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
