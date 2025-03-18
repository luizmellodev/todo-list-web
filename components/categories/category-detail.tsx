"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
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
} from "lucide-react";
import type { Category } from "@/types/category";
import { CategoryService } from "@/services/category-service";
import { toast } from "@/components/ui/use-toast";
import TodoList from "@/components/todos/todo-list";
import LoadingSpinner from "@/components/ui/loading-spinner";

interface CategoryDetailProps {
  categoryId: string;
}

export default function CategoryDetail({ categoryId }: CategoryDetailProps) {
  const router = useRouter();
  const [category, setCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [categoryData, categoriesData] = await Promise.all([
          CategoryService.getCategoryById(categoryId),
          CategoryService.getAllCategories(localStorage.getItem("token")),
        ]);

        if (!categoryData) {
          toast({
            title: "Erro",
            description: "Categoria não encontrada",
            variant: "destructive",
          });
          router.push("/todos");
          return;
        }

        setCategory(categoryData);
        setCategories(categoriesData);
      } catch (error) {
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [categoryId, router]);

  const goBack = () => {
    router.push("/todos");
  };

  // Map category icons to Lucide components
  const getIconComponent = (iconName: string | undefined) => {
    switch (iconName) {
      case "Briefcase":
        return Briefcase;
      case "User":
        return User;
      case "ShoppingBag":
        return ShoppingBag;
      case "Heart":
        return Heart;
      case "BookOpen":
        return BookOpen;
      case "Home":
        return Home;
      case "Plane":
        return Plane;
      case "DollarSign":
        return DollarSign;
      case "Music":
        return Music;
      case "Smartphone":
        return Smartphone;
      default:
        return Circle;
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

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
                  <div
                    className={`p-2 rounded-full ${category.color} bg-opacity-20`}
                  >
                    <div className={`h-5 w-5 ${category.color} text-white`} />
                  </div>
                  <CardTitle className="text-2xl font-bold text-blue-700">
                    {category.name}
                  </CardTitle>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {category && categories.length > 0 && (
              <TodoList categoryId={category.id} categories={categories} />
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}
