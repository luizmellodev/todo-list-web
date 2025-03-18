import { toast } from "@/components/ui/use-toast"

export const API_BASE_URL = "http://localhost:8000"

interface ApiError extends Error {
  status?: number;
  data?: any;
}

type ApiResponse<T> = {
  data?: T;
  error?: ApiError;
  status: number;
}

export async function apiCall<T>(
  endpoint: string, 
  method = "GET", 
  data?: any, 
  isPublic = false
): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint}`
    console.log(`📡 Requisição ${method} para ${url}`)

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      "Accept": "application/json",
    }

    if (!isPublic) {
      const token = localStorage.getItem("auth_token")
      if (!token) {
        throw Object.assign(new Error("Não autenticado"), { status: 401 })
      }
      headers["Authorization"] = `Bearer ${token}`
    }

    const requestOptions: RequestInit = {
      method,
      headers,
      credentials: 'include',
      mode: 'cors',
    }

    if (data && method !== "GET") {
      requestOptions.body = JSON.stringify(data)
      console.log("📦 Dados enviados:", data)
    }

    const response = await fetch(url, requestOptions)
    console.log(`📥 Resposta recebida: ${response.status} ${response.statusText}`)

    const apiResponse: ApiResponse<T> = {
      status: response.status
    }

    if (!response.ok) {
      const error: ApiError = new Error(response.statusText)
      error.status = response.status

      try {
        const errorData = await response.json()
        error.data = errorData
        error.message = errorData.detail || errorData.message || response.statusText
      } catch (e) {
        console.warn("⚠️ Não foi possível extrair detalhes do erro:", e)
      }

      if (response.status === 401) {
        localStorage.removeItem("auth_token")
        if (window.location.pathname !== "/") {
          window.location.href = "/"
        }
        error.message = "Sessão expirada. Por favor, faça login novamente."
      }

      throw error
    }

    if (response.status === 204 || response.headers.get("content-length") === "0") {
      return {} as T
    }

    const contentType = response.headers.get("content-type")

    if (!contentType) {
      console.log("ℹ️ Resposta sem content-type, retornando objeto vazio")
      return {} as T
    }

    if (contentType.includes("application/json")) {
      try {
        const data = await response.json()
        console.log("📦 Dados recebidos:", data)
        return data as T
      } catch (e) {
        console.error("❌ Erro ao parsear JSON:", e)
        return {} as T
      }
    }

    try {
      const text = await response.text()
      if (!text) return {} as T

      try {
        return JSON.parse(text) as T
      } catch {
        return { text } as unknown as T
      }
    } catch (e) {
      console.error("❌ Erro ao processar resposta:", e)
      return {} as T
    }

  } catch (error: any) {
    if (error.message === "Não autenticado") {
      if (window.location.pathname !== "/") {
        window.location.href = "/"
      }
      return {} as T
    }

    if (error.name === "TypeError" && error.message.includes("Failed to fetch")) {
      throw Object.assign(
        new Error("Falha na conexão com o servidor. Verifique sua conexão com a internet."),
        { status: 0 }
      )
    }

    console.error("❌ Erro na API:", {
      message: error.message,
      status: error.status,
      data: error.data
    })
    
    throw error
  }
}

export function handleApiError(error: any, customMessage?: string) {
  console.error("❌ Erro detalhado da API:", {
    error,
    message: error?.message,
    status: error?.status,
    data: error?.data,
    customMessage,
  })

  if (!error) {
    toast({
      title: "Erro",
      description: customMessage || "Ocorreu um erro inesperado",
      variant: "destructive",
    })
    return null
  }

  let errorMessage = customMessage || error.message || "Ocorreu um erro inesperado"
  
  switch (error.status) {
    case 400:
      errorMessage = "Dados inválidos. Por favor, verifique as informações."
      break
    case 401:
      errorMessage = "Sessão expirada. Por favor, faça login novamente."
      break
    case 403:
      errorMessage = "Você não tem permissão para realizar esta ação."
      break
    case 404:
      errorMessage = "Recurso não encontrado."
      break
    case 429:
      errorMessage = "Muitas tentativas. Por favor, aguarde um momento."
      break
    case 500:
      errorMessage = "Erro interno do servidor. Tente novamente mais tarde."
      break
  }

  toast({
    title: `Erro ${error.status || ''}`,
    description: errorMessage,
    variant: "destructive",
  })

  return null
}