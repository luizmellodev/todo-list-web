"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TodoService, Category, Todo } from "@/services/todo-service";
import { toast } from "@/components/ui/use-toast";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import TodoList from "@/components/todos/todo-list";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function CategoryPage() {
  const router = useRouter();
  const params = useParams();
  const categoryId = params?.id as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCategory() {
      if (!categoryId) {
        router.push("/");
        return;
      }

      try {
        setIsLoading(true);
        const categories = await TodoService.fetchCategoriesWithTodos();
        const foundCategory = categories.find((cat) => cat.id === categoryId);

        if (foundCategory) {
          setCategory(foundCategory);
        } else {
          toast({
            title: "Categoria não encontrada",
            description: "A categoria solicitada não existe",
            variant: "destructive",
          });
          router.push("/");
        }
      } catch (error) {
        console.error("Erro ao buscar categoria:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados da categoria",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchCategory();
  }, [categoryId, router]);

  const handleTodosChange = async (updatedTodos: Todo[]) => {
    if (category) {
      setCategory({
        ...category,
        todos: updatedTodos,
      });
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
        <div className="max-w-4xl mx-auto pt-4">
          <Card className="bg-white shadow-md border-blue-100">
            <CardContent className="flex items-center justify-center py-8">
              <LoadingSpinner />
            </CardContent>
          </Card>
        </div>
      </main>
    );
  }

  if (!category) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto pt-4">
        <Card className="bg-white shadow-md border-blue-100">
          <CardHeader className="flex flex-row items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="text-blue-600"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <CardTitle className="text-2xl font-bold text-blue-700">
              {category.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {category.todos.length} tarefa(s) •{" "}
                  {category.todos.filter((todo) => todo.completed).length}{" "}
                  concluída(s)
                </div>
              </div>

              <TodoList
                todos={category.todos}
                categories={[category]}
                onTodosChange={handleTodosChange}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
