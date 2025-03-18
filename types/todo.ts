export interface Todo {
  id: string
  content: string
  completed: boolean
  category_id: string
  username?: string
  created_at?: string
}

export interface UpdateTodo {
  content?: string
  completed?: boolean
  category_id?: string
}

export interface DeleteTodosRequest {
  ids: string[]
}

