import { apiCall, handleApiError } from "./api"
import type { Todo } from "@/types/todo"

// Dados iniciais para simulação
let todos: Todo[] = [
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

export const TodoService = {
  // Obter todos os todos
  async getAllTodos(): Promise<Todo[]> {
    try {
      // Simula uma chamada de API
      await apiCall<void>("/todos", "GET")

      return [...todos]
    } catch (error) {
      handleApiError(error, "Falha ao carregar tarefas")
      return []
    }
  },

  // Obter todos por categoria
  async getTodosByCategory(categoryId: string): Promise<Todo[]> {
    try {
      // Simula uma chamada de API
      await apiCall<void>(`/todos?categoryId=${categoryId}`, "GET")

      return todos.filter((todo) => todo.categoryId === categoryId)
    } catch (error) {
      handleApiError(error, "Falha ao carregar tarefas da categoria")
      return []
    }
  },

  // Adicionar um novo todo
  async addTodo(todo: Omit<Todo, "id">): Promise<Todo> {
    try {
      const newTodo: Todo = {
        ...todo,
        id: Date.now().toString(),
      }

      // Simula uma chamada de API
      await apiCall<Todo>("/todos", "POST", newTodo)

      // Atualiza o estado local
      todos = [...todos, newTodo]

      return newTodo
    } catch (error) {
      handleApiError(error, "Falha ao adicionar tarefa")
      throw error
    }
  },

  // Atualizar um todo
  async updateTodo(id: string, updates: Partial<Todo>): Promise<Todo> {
    try {
      // Simula uma chamada de API
      await apiCall<void>(`/todos/${id}`, "PATCH", updates)

      // Atualiza o estado local
      todos = todos.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo))

      const updatedTodo = todos.find((todo) => todo.id === id)

      if (!updatedTodo) {
        throw new Error("Tarefa não encontrada")
      }

      return updatedTodo
    } catch (error) {
      handleApiError(error, "Falha ao atualizar tarefa")
      throw error
    }
  },

  // Excluir um todo
  async deleteTodo(id: string): Promise<boolean> {
    try {
      // Simula uma chamada de API
      await apiCall<void>(`/todos/${id}`, "DELETE")

      // Atualiza o estado local
      todos = todos.filter((todo) => todo.id !== id)

      return true
    } catch (error) {
      handleApiError(error, "Falha ao excluir tarefa")
      return false
    }
  },

  // Marcar todo como concluído/não concluído
  async toggleTodoCompleted(id: string): Promise<Todo> {
    try {
      const todo = todos.find((t) => t.id === id)

      if (!todo) {
        throw new Error("Tarefa não encontrada")
      }

      return await this.updateTodo(id, { completed: !todo.completed })
    } catch (error) {
      handleApiError(error, "Falha ao atualizar status da tarefa")
      throw error
    }
  },
}

