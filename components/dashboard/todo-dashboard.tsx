"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut } from "lucide-react"
import type { Category } from "@/types/category"
import type { Todo } from "@/types/todo"
import { CategoryService } from "@/services/category-service"
import { TodoService } from "@/services/todo-service"
import { AuthService } from "@/services/auth-service"
import { toast } from "@/components/ui/use-toast"
import TodoList from "@/components/todos/todo-list"
import CategoryList from "@/components/categories/category-list"
import CategoryFilter from "@/components/todos/category-filter"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function TodoDashboard() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [todos, setTodos] = useState<Todo[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)

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

  const handleLogout = async () => {
    const success = await AuthService.logout()
    if (success) {
      router.push("/")
    }
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  if (isLoading) {
    return (
      <Card className="bg-white shadow-md border-blue-100">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl font-bold text-blue-700">Carregando...</CardTitle>
        </CardHeader>
        <CardContent>
          <LoadingSpinner />
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card className="bg-white shadow-md border-blue-100">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-2xl font-bold text-blue-700">Minhas Tarefas</CardTitle>
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
                  categoryId={selectedCategory === "all" ? undefined : selectedCategory}
                  categories={categories}
                />
              </div>
            </TabsContent>

            <TabsContent value="categories">
              <CategoryList />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}

