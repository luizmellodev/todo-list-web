import { apiCall, handleApiError } from "./api"

export interface User {
  id: string
  username: string
  email?: string
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData extends LoginCredentials {
  confirmPassword?: string
  email?: string
}

// Simula um usuário logado
let currentUser: User | null = null

export const AuthService = {
  // Login
  async login(credentials: LoginCredentials): Promise<User | null> {
    try {
      // Remove confirmPassword antes de enviar para a API
      const { username, password } = credentials

      // Simula uma chamada de API
      const user = await apiCall<User>("/auth/login", "POST", {
        username,
        password,
      })

      // Armazena o usuário logado
      currentUser = {
        id: "user-1",
        username: username,
        email: `${username}@example.com`,
      }

      // Em um app real, aqui armazenaria o token JWT em localStorage ou cookies
      localStorage.setItem("auth_token", "fake-jwt-token")

      return currentUser
    } catch (error) {
      return handleApiError(error, "Falha ao fazer login")
    }
  },

  // Registro
  async register(data: RegisterData): Promise<User | null> {
    try {
      // Remove confirmPassword antes de enviar para a API
      const { username, password, email } = data

      // Simula uma chamada de API
      await apiCall<User>("/auth/register", "POST", {
        username,
        password,
        email,
      })

      return {
        id: "user-1",
        username,
        email,
      }
    } catch (error) {
      return handleApiError(error, "Falha ao registrar usuário")
    }
  },

  // Logout
  async logout(): Promise<boolean> {
    try {
      // Simula uma chamada de API
      await apiCall<void>("/auth/logout", "POST")

      // Limpa o usuário e token
      currentUser = null
      localStorage.removeItem("auth_token")

      return true
    } catch (error) {
      handleApiError(error, "Falha ao fazer logout")
      return false
    }
  },

  // Verifica se o usuário está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem("auth_token")
  },

  // Obtém o usuário atual
  getCurrentUser(): User | null {
    // Em um app real, decodificaria o token JWT ou faria uma chamada de API
    return currentUser
  },
}

