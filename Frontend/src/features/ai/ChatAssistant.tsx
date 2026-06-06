import { useState, useRef, useEffect, type KeyboardEvent } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRobot, faXmark, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { aiApi, type ChatMessage, type CosechaContext } from './api'

interface ChatAssistantProps {
  cosechaContext?: CosechaContext
}

export function ChatAssistant({ cosechaContext }: ChatAssistantProps) {
  const [open, setOpen] = useState(false)
  const [historial, setHistorial] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    if (open) inputRef.current?.focus()
  }, [open, historial])

  async function send() {
    const mensaje = input.trim()
    if (!mensaje || isLoading) return
    setInput('')
    const userMsg: ChatMessage = { rol: 'user', contenido: mensaje }
    const nextHistorial = [...historial, userMsg]
    setHistorial(nextHistorial)
    setIsLoading(true)
    try {
      const resp = await aiApi.chat({ mensaje, historial, ...(cosechaContext ? { contexto_cosecha: cosechaContext } : {}) })
      setHistorial([...nextHistorial, { rol: 'assistant', contenido: resp.respuesta }])
    } catch {
      setHistorial([...nextHistorial, { rol: 'assistant', contenido: 'Lo siento, ocurrió un error. Por favor intenta de nuevo.' }])
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      void send()
    }
  }

  function handleClose() {
    setOpen(false)
    setHistorial([])
    setInput('')
  }

  return (
    <>
      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 flex w-80 sm:w-96 flex-col rounded-2xl bg-white dark:bg-gray-800 shadow-2xl ring-1 ring-gray-200 dark:ring-gray-700"
          style={{ height: '520px' }}
          role="dialog"
          aria-label="AgroAI Asistente"
        >
          {/* Header */}
          <div className="flex shrink-0 items-center gap-3 rounded-t-2xl bg-primary-600 px-4 py-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
              <FontAwesomeIcon icon={faRobot} className="h-4 w-4 text-white" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">AgroAI</p>
              <p className="text-xs text-primary-200">Asistente agrícola DeFi</p>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="rounded-md p-1 text-white/70 hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Cerrar chat"
            >
              <FontAwesomeIcon icon={faXmark} className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {historial.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <FontAwesomeIcon
                  icon={faRobot}
                  className="mb-3 h-10 w-10 text-primary-200 dark:text-primary-800"
                  aria-hidden="true"
                />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">¡Hola! Soy AgroAI</p>
                <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
                  Pregúntame sobre cosechas, inversiones o cualquier concepto de AgroNest.
                </p>
              </div>
            )}
            {historial.map((msg, i) => (
              <div key={i} className={`flex ${msg.rol === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[82%] rounded-2xl px-3 py-2 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.rol === 'user'
                      ? 'bg-primary-600 text-white rounded-br-sm'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-sm'
                  }`}
                >
                  {msg.contenido}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm bg-gray-100 dark:bg-gray-700 px-4 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-gray-500" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex shrink-0 gap-2 rounded-b-2xl border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Escribe tu pregunta… (Enter para enviar)"
              rows={1}
              disabled={isLoading}
              className="flex-1 resize-none rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700
                px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500
                focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20
                disabled:opacity-50"
              aria-label="Mensaje para AgroAI"
            />
            <button
              type="button"
              onClick={() => void send()}
              disabled={!input.trim() || isLoading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-white
                hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2
                disabled:opacity-50 disabled:pointer-events-none transition-colors"
              aria-label="Enviar mensaje"
            >
              <FontAwesomeIcon icon={faPaperPlane} className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      {/* Floating toggle button */}
      <button
        type="button"
        onClick={() => (open ? handleClose() : setOpen(true))}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white
          shadow-lg hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-500/50
          transition-all duration-200 hover:scale-105 active:scale-95"
        aria-label={open ? 'Cerrar AgroAI' : 'Abrir AgroAI Asistente'}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <FontAwesomeIcon
          icon={open ? faXmark : faRobot}
          className="h-6 w-6 transition-transform duration-200"
          aria-hidden="true"
        />
      </button>
    </>
  )
}
