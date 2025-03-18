"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import type { Category } from "@/types/category"
import type { Todo } from "@/types/todo"
import CategoryCard from "./category-card"
import { CategoryService } from "@/services/category-service"
import { TodoService } from "@/services/todo-service"
import { toast } from "@/components/ui/use-toast"
import LoadingSpinner from "@/components/ui/loading-spinner"
import CreateCategoryDialog from "./create-category-dialog"

export default function CategoryList() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [todos, setTodos] = useState<Todo[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  // Carrega categorias e todos
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const [categoriesData, todosData] = await Promise.all([
          CategoryService.getAllCategories(),
          TodoService.getAllTodos(),
        ])

        setCategories(categoriesData)
        setTodos(todosData)
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Navega para a página de detalhes da categoria
  const handleCategoryClick = (categoryId: string) => {
    router.push(`/categories/${categoryId}`)
  }

  // Conta o número de todos por categoria
  const getTodoCountForCategory = (categoryId: string) => {
    return todos.filter((todo) => todo.categoryId === categoryId).length
  }

  // Conta o número de todos concluídos por categoria
  const getCompletedTodoCountForCategory = (categoryId: string) => {
    return todos.filter((todo) => todo.categoryId === categoryId && todo.completed).length
  }

  // Adiciona uma nova categoria
  const handleAddCategory = async (category: Omit<Category, "id">) => {
    try {
      const newCategory = await CategoryService.addCategory(category)

      setCategories([...categories, newCategory])

      toast({
        title: "Categoria adicionada",
        description: "Sua categoria foi adicionada com sucesso",
      })

      return true
    } catch (error) {
      // Erro já tratado pelo service
      return false
    }
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-800">Categorias</h2>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)} className="border-blue-200 hover:bg-blue-50">
          <Plus className="h-4 w-4 mr-1" />
          Nova Categoria
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.length === 0 ? (
          <div className="text-center py-8 text-blue-500 col-span-2">Nenhuma categoria encontrada. Crie uma nova!</div>
        ) : (
          categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              todoCount={getTodoCountForCategory(category.id)}
              completedCount={getCompletedTodoCountForCategory(category.id)}
              onClick={() => handleCategoryClick(category.id)}
            />
          ))
        )}
      </div>

      <CreateCategoryDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSave={handleAddCategory} />
    </div>
  )
}

