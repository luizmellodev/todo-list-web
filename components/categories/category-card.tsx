"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Category } from "@/types/category"
import {
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

interface CategoryCardProps {
  category: Category
  todoCount: number
  completedCount: number
  onClick: () => void
}

export default function CategoryCard({ category, todoCount, completedCount, onClick }: CategoryCardProps) {
  const progress = todoCount > 0 ? Math.round((completedCount / todoCount) * 100) : 0

  // Map category icons to Lucide components
  const getIconComponent = (iconName: string) => {
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

  const IconComponent = getIconComponent(category.icon)

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer"
      layout
    >
      <Card className="overflow-hidden border-blue-100 hover:shadow-md transition-shadow">
        <div className={`h-2 ${category.color}`} />
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-2 rounded-full ${category.color} bg-opacity-20`}>
              <IconComponent className={`h-6 w-6 ${category.color} text-white`} />
            </div>
            <h3 className="font-semibold text-lg text-blue-800">{category.name}</h3>
          </div>

          <div className="text-sm text-blue-600 mb-2">
            {completedCount} de {todoCount} tarefas completas
          </div>

          <Progress value={progress} className="h-2" />
        </CardContent>
        <CardFooter className="text-xs text-blue-500 pt-0">Clique para ver detalhes</CardFooter>
      </Card>
    </motion.div>
  )
}

