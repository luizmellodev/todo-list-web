"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TodoDashboard from "@/components/dashboard/todo-dashboard";
import { AuthService } from "@/services/auth-service";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function TodosPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Verificando autenticação...");
        if (!AuthService.isAuthenticated()) {
          console.log("Não autenticado, redirecionando...");
          router.replace("/");
          return;
        }

        console.log("Autenticado, buscando usuário...");
        const user = await AuthService.fetchCurrentUser();
        if (!user) {
          console.log("Usuário não encontrado, fazendo logout...");
          AuthService.logout();
          return;
        }

        console.log("Usuário encontrado, carregando página...");
        setIsLoading(false);
      } catch (error) {
        console.error("Erro na verificação:", error);
        router.replace("/");
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4 flex items-center justify-center">
        <LoadingSpinner />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto pt-4">
        <TodoDashboard />
      </div>
    </main>
  );
}
