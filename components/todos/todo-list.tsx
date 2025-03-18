"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import type { Todo } from "@/types/todo"
import type { Category } from "@/types/category"
import TodoItem from "./todo-item"
import { TodoService } from "@/services/todo-service"
import { toast } from "@/components/ui/use-toast"
import LoadingSpinner from "@/components/ui/loading-spinner"

interface TodoListProps {
  categoryId?: string
  categories: Category[]
}

export default function TodoList({ categoryId, categories }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTodo, setNewTodo] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Carrega os todos
  useEffect(() => {
    const loadTodos = async () => {
      setIsLoading(true)
      try {
        let data: Todo[]

        if (categoryId) {
          data = await TodoService.getTodosByCategory(categoryId)
        } else {
          data = await TodoService.getAllTodos()
        }

        setTodos(data)
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar as tarefas",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadTodos()
  }, [categoryId])

  // Adiciona um novo todo
  const handleAddTodo = async () => {
    if (!newTodo.trim()) return

    setIsSubmitting(true)
    try {
      const newTodoItem = await TodoService.addTodo({
        text: newTodo,
        completed: false,
        categoryId: categoryId || categories[0].id,
      })

      setTodos([...todos, newTodoItem])
      setNewTodo("")

      toast({
        title: "Tarefa adicionada",
        description: "Sua tarefa foi adicionada com sucesso",
      })
    } catch (error) {
      // Erro já tratado pelo service
    } finally {
      setIsSubmitting(false)
    }
  }

  // Toggle todo completed
  const handleToggleTodo = async (id: string) => {
    try {
      const updatedTodo = await TodoService.toggleTodoCompleted(id)

      setTodos(todos.map((todo) => (todo.id === id ? updatedTodo : todo)))
    } catch (error) {
      // Erro já tratado pelo service
    }
  }

  // Delete todo
  const handleDeleteTodo = async (id: string) => {
    try {
      const success = await TodoService.deleteTodo(id)

      if (success) {
        setTodos(todos.filter((todo) => todo.id !== id))

        toast({
          title: "Tarefa excluída",
          description: "Sua tarefa foi excluída com sucesso",
        })
      }
    } catch (error) {
      // Erro já tratado pelo service
    }
  }

  // Encontra a categoria de um todo
  const getCategoryForTodo = (todo: Todo) => {
    return categories.find((cat) => cat.id === todo.categoryId)
  }

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Adicionar nova tarefa..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAddTodo()}
          className="border-blue-200 focus-visible:ring-blue-500"
          disabled={isSubmitting}
        />
        <Button onClick={handleAddTodo} disabled={isSubmitting || !newTodo.trim()}>
          <PlusCircle className="h-5 w-5 mr-1" />
          <span>Adicionar</span>
        </Button>
      </div>

      <AnimatePresence>
        {todos.length === 0 ? (
          <div className="text-center py-8 text-blue-500">Nenhuma tarefa encontrada. Adicione uma nova!</div>
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
                  staggerChildren: 0.05,
                },
              },
            }}
          >
            {todos.map((todo) => (
              <motion.div
                key={todo.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <TodoItem
                  todo={todo}
                  category={getCategoryForTodo(todo)}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

