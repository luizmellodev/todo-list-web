"use client"

import { Button } from "@/components/ui/button"
import type { Category } from "@/types/category"
import { ScrollArea } from "@/components/ui/scroll-area"

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string
  onChange: (categoryId: string) => void
}

export default function CategoryFilter({ categories, selectedCategory, onChange }: CategoryFilterProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-2 pb-2">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          className="rounded-full"
          onClick={() => onChange("all")}
        >
          Todos
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            className={`rounded-full ${selectedCategory === category.id ? "" : "border-blue-200"}`}
            onClick={() => onChange(category.id)}
          >
            {category.name}
          </Button>
        ))}
      </div>
    </ScrollArea>
  )
}

