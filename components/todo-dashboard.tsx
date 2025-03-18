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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function TodoDashboard() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    loadData();
  }, [router]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!AuthService.isAuthenticated()) {
        router.push("/");
        return;
      }

      const categoriesWithTodos = await TodoService.fetchCategoriesWithTodos();
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

      if (error.message?.includes("401")) {
        handleLogout();
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Limpa o cache do TodoService
      TodoService.clearCache();

      // Faz logout na API e limpa dados locais
      await AuthService.logout();

      // Redireciona para a página inicial
      router.push("/");

      toast({
        title: "Logout realizado",
        description: "Você foi desconectado com sucesso.",
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao fazer logout. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
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
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" disabled={isLoggingOut}>
                <LogOut className="h-5 w-5 text-blue-600" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmar Logout</AlertDialogTitle>
                <AlertDialogDescription>
                  Tem certeza que deseja sair? Você precisará fazer login
                  novamente para acessar suas tarefas.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleLogout}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Sair
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
                  onTodosChange={(updatedTodos) => {
                    setCategories((prevCategories) =>
                      prevCategories.map((category) => ({
                        ...category,
                        todos: category.todos
                          .map((todo) => {
                            const updatedTodo = updatedTodos.find(
                              (t) => t.id === todo.id
                            );
                            return updatedTodo || todo;
                          })
                          .filter((todo) =>
                            updatedTodos.some((t) => t.id === todo.id)
                          ),
                      }))
                    );
                  }}
                />
              </div>
            </TabsContent>

            <TabsContent value="categories">
              <CategoryList
                categories={categories}
                onCategoriesChange={setCategories}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
