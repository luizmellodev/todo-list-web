"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, PlusCircle, Circle, Briefcase, User, ShoppingBag, Heart, BookOpen } from "lucide-react"
import { getCategory, getTodosByCategory, type Todo, type Category } from "@/lib/data"
import TodoItem from "@/components/todo-item"

interface CategoryDetailProps {
  categoryId: string
}

export default function CategoryDetail({ categoryId }: CategoryDetailProps) {
  const router = useRouter()
  const [category, setCategory] = useState<Category | undefined>(undefined)
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch from your FastAPI backend
    const loadData = async () => {
      setIsLoading(true)
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      const categoryData = getCategory(categoryId)
      const todosData = getTodosByCategory(categoryId)

      setCategory(categoryData)
      setTodos(todosData)
      setIsLoading(false)
    }

    loadData()
  }, [categoryId])

  const addTodo = () => {
    if (!newTodo.trim() || !category) return

    const newTodoItem: Todo = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
      categoryId: category.id,
    }

    setTodos([...todos, newTodoItem])
    setNewTodo("")
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const goBack = () => {
    router.push("/todos")
  }

  // Map category icons to Lucide components
  const getIconComponent = (iconName: string | undefined) => {
    switch (iconName) {
      case "Briefcase":
        return Briefcase
      case "User":
        return User
      case "ShoppingBag":
        return ShoppingBag
      case "Heart":
        return Heart
      case "BookOpen":
        return BookOpen
      default:
        return Circle
    }
  }

  const IconComponent = getIconComponent(category?.icon)

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-white shadow-md border-blue-100">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={goBack}>
                <ArrowLeft className="h-5 w-5 text-blue-600" />
              </Button>
              {category && (
                <>
                  <div className={`p-2 rounded-full ${category.color} bg-opacity-20`}>
                    <IconComponent className={`h-5 w-5 ${category.color} text-white`} />
                  </div>
                  <CardTitle className="text-2xl font-bold text-blue-700">{category.name}</CardTitle>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2 mb-6">
              <Input
                placeholder={`Adicionar tarefa em ${category?.name || "categoria"}...`}
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTodo()}
                className="border-blue-200 focus-visible:ring-blue-500"
              />
              <Button onClick={addTodo}>
                <PlusCircle className="h-5 w-5 mr-1" />
                <span>Adicionar</span>
              </Button>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
              </div>
            ) : (
              <motion.div
                className="space-y-3"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                {todos.length === 0 ? (
                  <div className="text-center py-8 text-blue-500">
                    Nenhuma tarefa nesta categoria. Adicione uma nova!
                  </div>
                ) : (
                  todos.map((todo, index) => (
                    <motion.div
                      key={todo.id}
                      variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      className="hero-animation-item"
                    >
                      <TodoItem todo={todo} onToggle={toggleTodo} onDelete={deleteTodo} category={category} />
                    </motion.div>
                  ))
                )}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}

