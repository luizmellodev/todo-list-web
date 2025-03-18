"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Edit2, Check, X } from "lucide-react";
import type { Todo } from "@/types/todo";
import type { Category } from "@/types/category";
import { Badge } from "@/components/ui/badge";
import { TodoService } from "@/services/todo-service";
import { toast } from "@/components/ui/use-toast";

interface TodoItemProps {
  todo: Todo;
  category?: Category;
  onToggle?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, content: string) => void;
}

export default function TodoItem({
  todo,
  category,
  onToggle,
  onDelete,
  onEdit,
}: TodoItemProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(todo.content);

  const handleToggle = async () => {
    try {
      setIsLoading(true);
      if (onToggle) {
        onToggle(todo.id);
      } else {
        await TodoService.toggleTodoCompleted(todo.id);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a tarefa",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      if (onDelete) {
        onDelete(todo.id);
      } else {
        await TodoService.deleteTodo(todo.id);
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a tarefa",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async () => {
    if (editedContent.trim() === todo.content) {
      setIsEditing(false);
      return;
    }

    try {
      setIsLoading(true);
      if (onEdit) {
        onEdit(todo.id, editedContent);
      } else {
        await TodoService.updateTodo(todo.id, { content: editedContent });
      }
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível editar a tarefa",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryColor = (categoryName: string) => {
    const colors = [
      "bg-red-100",
      "bg-blue-100",
      "bg-green-100",
      "bg-yellow-100",
      "bg-purple-100",
      "bg-pink-100",
      "bg-indigo-100",
      "bg-gray-100",
    ];
    const index = categoryName.charCodeAt(0) % colors.length;
    return colors[index];
  };

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
          disabled={isLoading || isEditing}
        />
        {isEditing ? (
          <Input
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="flex-1"
            autoFocus
          />
        ) : (
          <span
            className={`${
              todo.completed ? "line-through text-blue-400" : "text-blue-900"
            } flex-1`}
          >
            {todo.content}
          </span>
        )}
        {category && (
          <Badge
            variant="secondary"
            className={`${getCategoryColor(category.name)} text-gray-800`}
          >
            {category.name}
          </Badge>
        )}
      </div>
      <div className="flex space-x-2">
        {isEditing ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleEdit}
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              disabled={isLoading}
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(false)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              disabled={isLoading}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
              disabled={isLoading}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
    </motion.div>
  );
}
