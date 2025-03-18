"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut } from "lucide-react";
import { Category, Todo, TodoService } from "@/services/todo-service";
import { AuthService } from "@/services/auth-service";
import { toast } from "@/components/ui/use-toast";
import TodoList from "@/components/todos/todo-list";
import CategoryList from "@/components/categories/category-list";
import CategoryFilter from "@/components/todos/category-filter";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useAuth } from "@/components/auth-provider";

export default function TodoDashboard() {
  const router = useRouter();
  const { logout } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!AuthService.isAuthenticated()) {
          router.push("/");
          return;
        }

        const categoriesWithTodos =
          await TodoService.fetchCategoriesWithTodos();
        setCategories(categoriesWithTodos);
      } catch (error: any) {
        console.error("Erro ao carregar dados:", error);
        setError(error.message || "Erro ao carregar dados");

        toast({
          title: "Erro",
          description:
            "Não foi possível carregar os dados. Por favor, tente novamente.",
          variant: "destructive",
        });

        if (
          error.message &&
          (error.message.includes("Não autenticado") ||
            error.message.includes("Sessão expirada") ||
            error.message.includes("401"))
        ) {
          router.push("/");
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [router]);

  const handleTodosChange = (updatedTodos: Todo[]) => {
    setCategories((prevCategories) =>
      prevCategories.map((category) => ({
        ...category,
        todos: category.todos
          .map((todo) => {
            const updatedTodo = updatedTodos.find((t) => t.id === todo.id);
            return updatedTodo || todo;
          })
          .filter((todo) => updatedTodos.some((t) => t.id === todo.id)),
      }))
    );
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const handleCategoryChange = (updatedCate: string) => {
    setSelectedCategory(updatedCate);
  };
  const handleCategoriesChange = (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
  };

  if (isLoading) {
    return (
      <Card className="bg-white shadow-md border-blue-100">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl font-bold text-blue-700">
            Carregando...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSpinner />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-white shadow-md border-blue-100">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl font-bold text-red-700">
            Erro
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-red-500">{error}</div>
          <div className="flex justify-center mt-4">
            <Button onClick={() => window.location.reload()}>
              Tentar novamente
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const filteredTodos =
    selectedCategory === "all"
      ? categories.flatMap((category) => category.todos)
      : categories.find((category) => category.id === selectedCategory)
          ?.todos || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white shadow-md border-blue-100">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl font-bold text-blue-700">
            Minhas Tarefas
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5 text-blue-600" />
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="todos" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="categories">Categorias</TabsTrigger>
            </TabsList>

            <TabsContent value="todos">
              <div className="space-y-4">
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onChange={handleCategoryChange}
                />

                <TodoList
                  todos={filteredTodos}
                  categories={categories}
                  onTodosChange={handleTodosChange}
                />
              </div>
            </TabsContent>

            <TabsContent value="categories">
              <CategoryList
                categories={categories}
                onCategoriesChange={handleCategoriesChange}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
