"use client"

import { motion } from "framer-motion"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Trash2, Circle, Briefcase, User, ShoppingBag, Heart, BookOpen } from "lucide-react"
import type { Todo, Category } from "@/lib/data"
import { Badge } from "@/components/ui/badge"

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  category?: Category
}

export default function TodoItem({ todo, onToggle, onDelete, category }: TodoItemProps) {
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
          onCheckedChange={() => onToggle(todo.id)}
          className="border-blue-400 data-[state=checked]:bg-blue-600"
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
        onClick={() => onDelete(todo.id)}
        className="text-blue-700 hover:text-red-600 hover:bg-red-50"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </motion.div>
  )
}

