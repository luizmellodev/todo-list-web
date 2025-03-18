"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { PlusCircle, Trash2, LogOut } from "lucide-react"

interface Todo {
  id: string
  text: string
  completed: boolean
}

export default function TodoList() {
  const router = useRouter()
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // In a real app, you would fetch todos from your FastAPI backend
    // const fetchTodos = async () => {
    //   const response = await fetch("/api/todos");
    //   const data = await response.json();
    //   setTodos(data);
    //   setIsLoading(false);
    // };

    // For demo purposes, we'll use mock data
    setTimeout(() => {
      setTodos([
        { id: "1", text: "Comprar leite", completed: false },
        { id: "2", text: "Responder emails", completed: true },
        { id: "3", text: "Preparar apresentação", completed: false },
      ])
      setIsLoading(false)
    }, 1000)

    // fetchTodos();
  }, [])

  const addTodo = async () => {
    if (!newTodo.trim()) return

    const newTodoItem = {
      id: Date.now().toString(),
      text: newTodo,
      completed: false,
    }

    // Optimistic update
    setTodos([...todos, newTodoItem])
    setNewTodo("")

    // In a real app, you would save to your FastAPI backend
    // try {
    //   const response = await fetch("/api/todos", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify(newTodoItem),
    //   });
    //
    //   if (!response.ok) throw new Error("Failed to add todo");
    // } catch (error) {
    //   // Revert on error
    //   setTodos(todos);
    //   toast({
    //     title: "Failed to add todo",
    //     description: "Please try again.",
    //     variant: "destructive",
    //   });
    // }
  }

  const toggleTodo = async (id: string) => {
    const updatedTodos = todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo))

    // Optimistic update
    setTodos(updatedTodos)

    // In a real app, you would update your FastAPI backend
    // try {
    //   const todoToUpdate = updatedTodos.find(todo => todo.id === id);
    //   const response = await fetch(`/api/todos/${id}`, {
    //     method: "PATCH",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ completed: todoToUpdate?.completed }),
    //   });
    //
    //   if (!response.ok) throw new Error("Failed to update todo");
    // } catch (error) {
    //   // Revert on error
    //   setTodos(todos);
    //   toast({
    //     title: "Failed to update todo",
    //     description: "Please try again.",
    //     variant: "destructive",
    //   });
    // }
  }

  const deleteTodo = async (id: string) => {
    // Store current todos for potential rollback
    const previousTodos = [...todos]

    // Optimistic update
    setTodos(todos.filter((todo) => todo.id !== id))

    // In a real app, you would delete from your FastAPI backend
    // try {
    //   const response = await fetch(`/api/todos/${id}`, {
    //     method: "DELETE",
    //   });
    //
    //   if (!response.ok) throw new Error("Failed to delete todo");
    // } catch (error) {
    //   // Revert on error
    //   setTodos(previousTodos);
    //   toast({
    //     title: "Failed to delete todo",
    //     description: "Please try again.",
    //     variant: "destructive",
    //   });
    // }
  }

  const handleLogout = () => {
    // In a real app, you would call your logout API
    // fetch("/api/logout", { method: "POST" });
    router.push("/")
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card className="bg-white/80 backdrop-blur-sm border-amber-100">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold text-amber-800">Minhas Tarefas</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5 text-amber-700" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-6">
            <Input
              placeholder="Adicionar nova tarefa..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTodo()}
              className="border-amber-200 focus-visible:ring-amber-500"
            />
            <Button onClick={addTodo} className="bg-amber-600 hover:bg-amber-700">
              <PlusCircle className="h-5 w-5" />
            </Button>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-700"></div>
            </div>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {todos.map((todo) => (
                  <motion.div
                    key={todo.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100"
                  >
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                        className="border-amber-400 data-[state=checked]:bg-amber-600"
                      />
                      <span className={`${todo.completed ? "line-through text-amber-400" : "text-amber-900"}`}>
                        {todo.text}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteTodo(todo.id)}
                      className="text-amber-700 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>

              {todos.length === 0 && !isLoading && (
                <div className="text-center py-8 text-amber-500">Nenhuma tarefa ainda. Adicione uma nova!</div>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter className="text-sm text-amber-500 justify-center border-t border-amber-100 pt-4">
          {todos.filter((t) => t.completed).length} de {todos.length} tarefas completas
        </CardFooter>
      </Card>
    </motion.div>
  )
}

