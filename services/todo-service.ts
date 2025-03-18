import { apiCall, handleApiError } from "./api"
import { v4 as uuidv4 } from "uuid"

export interface Todo {
  id: string
  content: string
  completed: boolean
  category_id: string
  username: string
  created_at?: string
}

export interface Category {
  id: string
  name: string
  todos: Todo[]
}

export interface DeleteTodosRequest {
  ids: string[]
}

export interface UpdateTodo {
  content?: string
  completed?: boolean
  category_id?: string
}

// Cache local para armazenar as categorias com todos
let categoriesCache: Category[] = [];

export const TodoService = {
  // Obter categorias com todos (novo método BFF)
  async fetchCategoriesWithTodos(): Promise<Category[]> {
    try {
      const categories = await apiCall<Category[]>("/categories_with_todos", "GET");
      categoriesCache = categories; // Atualiza o cache
      return categories;
    } catch (error) {
      handleApiError(error, "Falha ao carregar categorias e tarefas");
      return [];
    }
  },

  // Obter todos os todos
  async getAllTodos(): Promise<Todo[]> {
    try {
      if (categoriesCache.length === 0) {
        await this.fetchCategoriesWithTodos();
      }
      return categoriesCache.flatMap(category => category.todos);
    } catch (error) {
      handleApiError(error, "Falha ao carregar tarefas");
      return [];
    }
  },
  

  // Obter todos por categoria
  async getTodosByCategory(categoryId: string): Promise<Todo[]> {
    try {
      if (categoriesCache.length === 0) {
        await this.fetchCategoriesWithTodos();
      }
      const category = categoriesCache.find(c => c.id === categoryId);
      return category?.todos || [];
    } catch (error) {
      handleApiError(error, "Falha ao carregar tarefas da categoria");
      return [];
    }
  },

    // Dentro do TodoService
  async addCategory(category: Omit<Category, "id" | "todos">): Promise<Category> {
    try {
      const newCategory = await apiCall<Category>("/categories", "POST", category);
      this.clearCache(); // Limpa o cache para forçar uma nova busca
      return newCategory;
    } catch (error) {
      console.error("Erro ao adicionar categoria:", error);
      throw error;
    }
  },

  // Adicionar um novo todo
  async addTodo(todo: Omit<Todo, "id" | "created_at" | "username">): Promise<Todo> {
    try {
      const newTodo: Partial<Todo> = {
        ...todo,
        id: uuidv4(),
        created_at: new Date().toISOString().split("T")[0],
      };

      const createdTodo = await apiCall<Todo>("/todos", "POST", newTodo);
      
      // Atualiza o cache local
      const categoryIndex = categoriesCache.findIndex(c => c.id === todo.category_id);
      if (categoryIndex !== -1) {
        categoriesCache[categoryIndex].todos.push(createdTodo);
      }

      return createdTodo;
    } catch (error) {
      handleApiError(error, "Falha ao adicionar tarefa");
      throw error;
    }
  },

  // Atualizar um todo
  async updateTodo(id: string, updates: Partial<UpdateTodo>): Promise<Todo> {
    try {
      const updatedTodo = await apiCall<Todo>(`/todos/${id}`, "PUT", updates);

      // Atualiza o cache local
      categoriesCache = categoriesCache.map(category => ({
        ...category,
        todos: category.todos.map(todo => 
          todo.id === id ? { ...todo, ...updatedTodo } : todo
        )
      }));

      return updatedTodo;
    } catch (error) {
      handleApiError(error, "Falha ao atualizar tarefa");
      throw error;
    }
  },

  // Excluir um todo
  async deleteTodo(id: string): Promise<boolean> {
    try {
      const deleteRequest: DeleteTodosRequest = { ids: [id] };
      await apiCall<void>("/todos/", "DELETE", deleteRequest);

      // Atualiza o cache local
      categoriesCache = categoriesCache.map(category => ({
        ...category,
        todos: category.todos.filter(todo => todo.id !== id)
      }));

      return true;
    } catch (error) {
      handleApiError(error, "Falha ao excluir tarefa");
      return false;
    }
  },

  // Excluir múltiplos todos
  async deleteTodos(ids: string[]): Promise<boolean> {
    try {
      const deleteRequest: DeleteTodosRequest = { ids };
      await apiCall<void>("/todos/", "DELETE", deleteRequest);

      // Atualiza o cache local
      categoriesCache = categoriesCache.map(category => ({
        ...category,
        todos: category.todos.filter(todo => !ids.includes(todo.id))
      }));

      return true;
    } catch (error) {
      handleApiError(error, "Falha ao excluir tarefas");
      return false;
    }
  },

  // Marcar todo como concluído/não concluído
  async toggleTodoCompleted(id: string): Promise<Todo> {
    try {
      const todos = await this.getAllTodos();
      const todo = todos.find(t => t.id === id);

      if (!todo) {
        throw new Error("Tarefa não encontrada");
      }

      return await this.updateTodo(id, { completed: !todo.completed });
    } catch (error) {
      handleApiError(error, "Falha ao atualizar status da tarefa");
      throw error;
    }
  },

  // Método auxiliar para limpar o cache
  clearCache() {
    categoriesCache = [];
  },
};