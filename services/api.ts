// Base API service com configurações comuns para todas as chamadas
import { toast } from "@/components/ui/use-toast"

// Simula um delay para as chamadas de API
const API_DELAY = 500

// URL base da API (em um app real, viria de variáveis de ambiente)
export const API_BASE_URL = "https://api.tarefas.com"

// Função auxiliar para simular chamadas de API
export async function apiCall<T>(endpoint: string, method = "GET", data?: any): Promise<T> {
  // Simula o delay da rede
  await new Promise((resolve) => setTimeout(resolve, API_DELAY))

  // Simula uma chance de erro (10%)
  if (Math.random() < 0.1) {
    throw new Error("Falha na conexão com o servidor. Tente novamente.")
  }

  // Em um app real, aqui seria feita a chamada fetch real
  console.log(`${method} ${API_BASE_URL}${endpoint}`, data)

  // Retorna os dados simulados (em um app real, seria o resultado do fetch)
  return data as T
}

// Handler global de erros de API
export function handleApiError(error: any, customMessage?: string) {
  console.error("API Error:", error)

  toast({
    title: "Erro",
    description: customMessage || error.message || "Ocorreu um erro inesperado",
    variant: "destructive",
  })

  return null
}

