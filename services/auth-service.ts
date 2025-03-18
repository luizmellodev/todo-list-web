import { apiCall, API_BASE_URL } from "./api"

export interface User {
  id: string
  username: string
  name?: string
  email?: string
  disabled?: boolean
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface RegisterData {
  username: string
  password: string
  name: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

let currentUser: User | null = null

export const AuthService = {
  async login(credentials: LoginCredentials): Promise<User | null> {
    try {
      const formData = new URLSearchParams();
      formData.append("username", credentials.username);
      formData.append("password", credentials.password);

      const response = await fetch(`${API_BASE_URL}/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error("Falha na autenticação");
      }

      const tokenData: TokenResponse = await response.json();

      if (!tokenData?.access_token) {
        throw new Error("Token inválido recebido do servidor");
      }

      localStorage.setItem("auth_token", tokenData.access_token);

      const userData = await this.fetchCurrentUser();
      if (userData) {
        currentUser = userData;
        return userData;
      }

      throw new Error("Não foi possível obter dados do usuário");
    } catch (error) {
      console.error("Erro no login:", error);
      localStorage.removeItem("auth_token");
      currentUser = null;
      return null;
    }
  },

  async register(data: RegisterData): Promise<User | null> {
    try {
      const response = await apiCall<User>("/register", "POST", data, true);
      return await this.login({
        username: data.username,
        password: data.password,
      });
    } catch (error) {
      console.error("Erro no registro:", error);
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem("auth_token");
    currentUser = null;
    window.location.href = '/';
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem("auth_token");
  },

  async fetchCurrentUser(): Promise<User | null> {
    try {
      if (!this.isAuthenticated()) {
        return null;
      }

      const user = await apiCall<User>("/users/me", "GET");
      currentUser = user;
      return user;
    } catch (error) {
      console.error("Erro ao obter dados do usuário:", error);
      return null;
    }
  },

  getCurrentUser(): User | null {
    return currentUser;
  },
};