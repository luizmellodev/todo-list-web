"use client"

import { motion } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import {
  Trash2,
  Circle,
  Briefcase,
  User,
  ShoppingBag,
  Heart,
  BookOpen,
  Home,
  Plane,
  DollarSign,
  Music,
  Smartphone,
} from "lucide-react"
import type { Todo } from "@/types/todo"
import type { Category } from "@/types/category"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { TodoService } from "@/services/todo-service"
import { toast } from "@/components/ui/use-toast"

interface TodoItemProps {
  todo: Todo
  category?: Category
  onToggle?: (id: string) => void
  onDelete?: (id: string) => void
}

export default function TodoItem({ todo, category, onToggle, onDelete }: TodoItemProps) {
  const [isLoading, setIsLoading] = useState(false)

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
      case "Home":
        return Home
      case "Plane":
        return Plane
      case "DollarSign":
        return DollarSign
      case "Music":
        return Music
      case "Smartphone":
        return Smartphone
      default:
        return Circle
    }
  }

  const IconComponent = getIconComponent(category?.icon)

  const handleToggle = async () => {
    try {
      setIsLoading(true)

      // Se tiver um handler externo, use-o
      if (onToggle) {
        onToggle(todo.id)
        return
      }

      // Caso contrário, use o service diretamente
      await TodoService.toggleTodoCompleted(todo.id)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a tarefa",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setIsLoading(true)

      // Se tiver um handler externo, use-o
      if (onDelete) {
        onDelete(todo.id)
        return
      }

      // Caso contrário, use o service diretamente
      await TodoService.deleteTodo(todo.id)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a tarefa",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100 shadow-sm"
    >
      <div className="flex items-center space-x-3 flex-1">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={handleToggle}
          className="border-blue-400 data-[state=checked]:bg-blue-600"
          disabled={isLoading}
        />
        <span className={`${todo.completed ? "line-through text-blue-400" : "text-blue-900"} flex-1`}>{todo.text}</span>
        {category && (
          <Badge variant="outline" className={`${category.color} text-white`}>
            <IconComponent className="h-3 w-3 mr-1" />
            {category.name}
          </Badge>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDelete}
        className="text-blue-700 hover:text-red-600 hover:bg-red-50"
        disabled={isLoading}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </motion.div>
  )
}

