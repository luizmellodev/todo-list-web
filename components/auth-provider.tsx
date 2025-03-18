"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { AuthService, type User } from "@/services/auth-service";
import { useRouter } from "next/navigation";
import LoadingSpinner from "./ui/loading-spinner";
import { toast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadUser = async () => {
      try {
        // Verifica se há um token
        if (!AuthService.isAuthenticated()) {
          setIsLoading(false);
          console.log("Usuário não autenticado");
          return;
        }

        // Carrega os dados do usuário
        const userData = await AuthService.fetchCurrentUser();
        setUser(userData);
      } catch (error: any) {
        console.error("Erro ao carregar usuário:", error);

        // Se houver um erro de autenticação, limpa o token e redireciona para login
        if (
          error.message &&
          (error.message.includes("Não autenticado") ||
            error.message.includes("Sessão expirada") ||
            error.message.includes("401"))
        ) {
          console.log("Sessão expirada. Redirecionando para login...");
          localStorage.removeItem("auth_token");
          toast({
            title: "Sessão expirada",
            description: "Por favor, faça login novamente.",
            variant: "destructive",
          });
          router.push("/");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, [router]);

  const logout = async () => {
    try {
      await AuthService.logout();
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      // Mesmo com erro, limpa o usuário e redireciona
      setUser(null);
      router.push("/");
    }
  };

  // Mostra um spinner enquanto carrega o usuário
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
