// This file simulates a database or API response
// In a real app, you would fetch this data from your FastAPI backend

export interface Todo {
  id: string
  text: string
  completed: boolean
  categoryId: string
}

export interface Category {
  id: string
  name: string
  color: string
  icon: string
}

export const categories: Category[] = [
  {
    id: "work",
    name: "Trabalho",
    color: "bg-blue-500",
    icon: "Briefcase",
  },
  {
    id: "personal",
    name: "Pessoal",
    color: "bg-green-500",
    icon: "User",
  },
  {
    id: "shopping",
    name: "Compras",
    color: "bg-purple-500",
    icon: "ShoppingBag",
  },
  {
    id: "health",
    name: "Saúde",
    color: "bg-red-500",
    icon: "Heart",
  },
  {
    id: "education",
    name: "Educação",
    color: "bg-yellow-500",
    icon: "BookOpen",
  },
]

export const todos: Todo[] = [
  { id: "1", text: "Preparar apresentação", completed: false, categoryId: "work" },
  { id: "2", text: "Responder emails", completed: true, categoryId: "work" },
  { id: "3", text: "Reunião com cliente", completed: false, categoryId: "work" },
  { id: "4", text: "Comprar leite", completed: false, categoryId: "shopping" },
  { id: "5", text: "Comprar frutas", completed: true, categoryId: "shopping" },
  { id: "6", text: "Agendar médico", completed: false, categoryId: "health" },
  { id: "7", text: "Correr 5km", completed: false, categoryId: "health" },
  { id: "8", text: "Ler livro", completed: false, categoryId: "education" },
  { id: "9", text: "Estudar React", completed: true, categoryId: "education" },
  { id: "10", text: "Ligar para mãe", completed: false, categoryId: "personal" },
  { id: "11", text: "Organizar fotos", completed: false, categoryId: "personal" },
]

export function getTodosByCategory(categoryId: string): Todo[] {
  return todos.filter((todo) => todo.categoryId === categoryId)
}

export function getAllTodos(): Todo[] {
  return todos
}

export function getCategory(categoryId: string): Category | undefined {
  return categories.find((category) => category.id === categoryId)
}

