"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LogOut, PlusCircle } from "lucide-react"
import { categories, todos as initialTodos, type Todo } from "@/lib/data"
import TodoItem from "@/components/todo-item"
import CategoryCard from "@/components/category-card"

export default function TodoDashboard() {
  const router = useRouter()
  const [todos, setTodos] = useState<Todo[]>(initialTodos)
  const [newTodo, setNewTodo] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const handleLogout = () => {
    router.push("/")
  }

  const addTodo = () => {
    if (!newTodo.trim()) return

    const newTodoItem: Todo = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
      categoryId: selectedCategory === "all" ? categories[0].id : selectedCategory,
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

  const navigateToCategory = (categoryId: string) => {
    router.push(`/categories/${categoryId}`)
  }

  const filteredTodos =
    selectedCategory === "all" ? todos : todos.filter((todo) => todo.categoryId === selectedCategory)

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
              <div className="flex space-x-2 mb-6">
                <Input
                  placeholder="Adicionar nova tarefa..."
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

              <div className="flex overflow-x-auto pb-2 mb-4 gap-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "outline"}
                  className="rounded-full"
                  onClick={() => setSelectedCategory("all")}
                >
                  Todos
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    className={`rounded-full ${selectedCategory === category.id ? "" : "border-blue-200"}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>

              <div className="space-y-3">
                {filteredTodos.length === 0 ? (
                  <div className="text-center py-8 text-blue-500">Nenhuma tarefa encontrada. Adicione uma nova!</div>
                ) : (
                  filteredTodos.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={toggleTodo}
                      onDelete={deleteTodo}
                      category={categories.find((c) => c.id === todo.categoryId)}
                    />
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="categories">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {categories.map((category) => (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    todoCount={todos.filter((todo) => todo.categoryId === category.id).length}
                    completedCount={todos.filter((todo) => todo.categoryId === category.id && todo.completed).length}
                    onClick={() => navigateToCategory(category.id)}
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}

