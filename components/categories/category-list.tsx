"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Category, TodoService } from "@/services/todo-service";
import CategoryCard from "./category-card";
import { toast } from "@/components/ui/use-toast";
import CreateCategoryDialog from "./create-category-dialog";

interface CategoryListProps {
  categories: Category[];
  onCategoriesChange?: (categories: Category[]) => void;
}

export default function CategoryList({
  categories,
  onCategoriesChange,
}: CategoryListProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Navega para a página de detalhes da categoria
  const handleCategoryClick = (categoryId: string) => {
    router.push(`/categories/${categoryId}`);
  };

  // Adiciona uma nova categoria
  const handleAddCategory = async (
    category: Omit<Category, "id" | "todos">
  ) => {
    try {
      const newCategory = await TodoService.addCategory(category);
      const updatedCategories = [...categories, newCategory];
      onCategoriesChange?.(updatedCategories);

      toast({
        title: "Categoria adicionada",
        description: "Sua categoria foi adicionada com sucesso",
      });

      return true;
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a categoria",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-blue-800">Categorias</h2>
        <Button
          variant="outline"
          onClick={() => setIsDialogOpen(true)}
          className="border-blue-200 hover:bg-blue-50"
        >
          <Plus className="h-4 w-4 mr-1" />
          Nova Categoria
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.length === 0 ? (
          <div className="text-center py-8 text-blue-500 col-span-2">
            Nenhuma categoria encontrada. Crie uma nova!
          </div>
        ) : (
          categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              todoCount={category.todos.length}
              completedCount={
                category.todos.filter((todo) => todo.completed).length
              }
              onClick={() => handleCategoryClick(category.id)}
            />
          ))
        )}
      </div>

      <CreateCategoryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSave={handleAddCategory}
      />
    </div>
  );
}
