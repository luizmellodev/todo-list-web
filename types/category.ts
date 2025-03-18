import { Todo } from "./todo"

// Modificando a interface Category para corresponder ao backend
export interface Category {
  id: string
  name: string
  user_id?: string
  created_at?: string
  todos: Todo[]
  // Esses campos são apenas para o frontend web
  color?: string
}

export interface UpdateCategory {
  name?: string
}

// Interface para o mapeamento visual (apenas frontend)
export interface CategoryVisualMap {
  [categoryId: string]: {
    color: string
    icon: string
  }
}

