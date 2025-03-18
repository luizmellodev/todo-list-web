"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import type { Category } from "@/types/category"
import { availableColors, availableIcons } from "@/services/category-visual-service"
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

interface CreateCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (category: Omit<Category, "id">) => Promise<boolean>
}

export default function CreateCategoryDialog({ open, onOpenChange, onSave }: CreateCategoryDialogProps) {
  const [name, setName] = useState("")
  const [color, setColor] = useState(availableColors[0].value)
  const [icon, setIcon] = useState(availableIcons[0].value)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Map icon names to components
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

  const handleSubmit = async () => {
    if (!name.trim()) return

    setIsSubmitting(true)

    const success = await onSave({
      name,
      color,
      icon,
    })

    if (success) {
      // Reset form
      setName("")
      setColor(availableColors[0].value)
      setIcon(availableIcons[0].value)
      onOpenChange(false)
    }

    setIsSubmitting(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Categoria</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome da Categoria</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Trabalho, Pessoal, Estudos..."
            />
          </div>

          <div className="grid gap-2">
            <Label>Cor (apenas para visualização web)</Label>
            <RadioGroup value={color} onValueChange={setColor} className="flex flex-wrap gap-2">
              {availableColors.map((colorOption) => (
                <div key={colorOption.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={colorOption.value} id={`color-${colorOption.value}`} className="sr-only" />
                  <Label
                    htmlFor={`color-${colorOption.value}`}
                    className={`w-8 h-8 rounded-full cursor-pointer flex items-center justify-center ${
                      color === colorOption.value ? "ring-2 ring-offset-2 ring-blue-500" : ""
                    }`}
                  >
                    <div className={`w-6 h-6 rounded-full ${colorOption.value}`}></div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="grid gap-2">
            <Label>Ícone (apenas para visualização web)</Label>
            <RadioGroup value={icon} onValueChange={setIcon} className="flex flex-wrap gap-2">
              {availableIcons.map((iconOption) => {
                const IconComponent = getIconComponent(iconOption.value)
                return (
                  <div key={iconOption.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={iconOption.value} id={`icon-${iconOption.value}`} className="sr-only" />
                    <Label
                      htmlFor={`icon-${iconOption.value}`}
                      className={`w-10 h-10 rounded-full cursor-pointer flex items-center justify-center bg-gray-100 ${
                        icon === iconOption.value ? "ring-2 ring-offset-2 ring-blue-500" : ""
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </Label>
                  </div>
                )
              })}
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !name.trim()}>
            {isSubmitting ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

