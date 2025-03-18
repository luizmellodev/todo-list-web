import TodoDashboard from "@/components/dashboard/todo-dashboard"

export default function TodosPage() {
  // Em um app real, você verificaria se o usuário está autenticado
  // Se não estiver, redirecionaria para a página de login
  // const isAuthenticated = await checkAuth();
  // if (!isAuthenticated) redirect("/");

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto pt-4">
        <TodoDashboard />
      </div>
    </main>
  )
}

