"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PlusCircle } from "lucide-react";
import type { Todo, Category } from "@/services/todo-service";
import TodoItem from "./todo-item";
import { TodoService } from "@/services/todo-service";
import { toast } from "@/components/ui/use-toast";

interface TodoListProps {
  todos: Todo[];
  categories: Category[];
  onTodosChange?: (todos: Todo[]) => void;
}

export default function TodoList({
  todos,
  categories,
  onTodosChange,
}: TodoListProps) {
  const [newTodo, setNewTodo] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddTodo = async () => {
    if (!newTodo.trim() || !selectedCategoryId) return;

    setIsSubmitting(true);
    try {
      const newTodoItem = await TodoService.addTodo({
        content: newTodo,
        completed: false,
        category_id: selectedCategoryId,
      });

      const updatedTodos = [...todos, newTodoItem];
      onTodosChange?.(updatedTodos);
      setNewTodo("");
      setSelectedCategoryId("");

      toast({
        title: "Tarefa adicionada",
        description: "Sua tarefa foi adicionada com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar a tarefa",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTodo = async (id: string) => {
    try {
      const updatedTodo = await TodoService.toggleTodoCompleted(id);
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? updatedTodo : todo
      );
      onTodosChange?.(updatedTodos);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a tarefa",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      const success = await TodoService.deleteTodo(id);

      if (success) {
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        onTodosChange?.(updatedTodos);

        toast({
          title: "Tarefa excluída",
          description: "Sua tarefa foi excluída com sucesso",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a tarefa",
        variant: "destructive",
      });
    }
  };

  const handleEditTodo = async (id: string, content: string) => {
    try {
      const updatedTodo = await TodoService.updateTodo(id, { content });
      const updatedTodos = todos.map((todo) =>
        todo.id === id ? { ...todo, content } : todo
      );
      onTodosChange?.(updatedTodos);

      toast({
        title: "Tarefa atualizada",
        description: "Sua tarefa foi atualizada com sucesso",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a tarefa",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Adicionar nova tarefa..."
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          className="border-blue-200 focus-visible:ring-blue-500"
          disabled={isSubmitting}
        />
        <Select
          value={selectedCategoryId}
          onValueChange={setSelectedCategoryId}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={handleAddTodo}
          disabled={isSubmitting || !newTodo.trim() || !selectedCategoryId}
        >
          <PlusCircle className="h-5 w-5 mr-1" />
          <span>Adicionar</span>
        </Button>
      </div>

      <AnimatePresence>
        {todos.length === 0 ? (
          <div className="text-center py-8 text-blue-500">
            Nenhuma tarefa encontrada. Adicione uma nova!
          </div>
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
                  category={categories.find((c) => c.id === todo.category_id)}
                  onToggle={handleToggleTodo}
                  onDelete={handleDeleteTodo}
                  onEdit={handleEditTodo}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
