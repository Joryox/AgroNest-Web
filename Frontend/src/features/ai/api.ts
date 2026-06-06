import { apiClient } from '@/lib/axios'

export interface ChatMessage {
  rol: 'user' | 'assistant'
  contenido: string
}

export interface CosechaContext {
  id?: number
  tipo_grano?: string
  hectareas?: number
  capital_requerido?: number
  estado?: string
  rendimiento_kg?: number
}

export interface ChatRequest {
  mensaje: string
  historial: ChatMessage[]
  contexto_cosecha?: CosechaContext
}

export interface ChatResponse {
  respuesta: string
}

export const aiApi = {
  chat: (data: ChatRequest): Promise<ChatResponse> =>
    apiClient.post<ChatResponse>('/ai/chat', data).then((r) => r.data),
}
