import { apiCall, handleApiError } from "./api"
import type { Category } from "@/types/category"
import { CategoryVisualService } from "./category-visual-service"

// Dados iniciais para simulação (apenas os dados que viriam do backend)
let categories: Category[] = [
  {
    id: "work",
    name: "Trabalho",
  },
  {
    id: "personal",
    name: "Pessoal",
  },
  {
    id: "shopping",
    name: "Compras",
  },
  {
    id: "health",
    name: "Saúde",
  },
  {
    id: "education",
    name: "Educação",
  },
]

// Exportamos as cores e ícones do serviço visual
export const { getAvailableColors, getAvailableIcons } = CategoryVisualService
export const availableColors = CategoryVisualService.getAvailableColors()
export const availableIcons = CategoryVisualService.getAvailableIcons()

export const CategoryService = {
  // Obter todas as categorias
  async getAllCategories(): Promise<Category[]> {
    try {
      // Simula uma chamada de API
      await apiCall<void>("/categories", "GET")

      // Adiciona as informações visuais às categorias
      return categories.map((category) => {
        const visual = CategoryVisualService.getCategoryVisual(category.id)
        return {
          ...category,
          color: visual.color,
          icon: visual.icon,
        }
      })
    } catch (error) {
      handleApiError(error, "Falha ao carregar categorias")
      return []
    }
  },

  // Obter uma categoria por ID
  async getCategoryById(id: string): Promise<Category | null> {
    try {
      // Simula uma chamada de API
      await apiCall<void>(`/categories/${id}`, "GET")

      const category = categories.find((cat) => cat.id === id)

      if (!category) {
        throw new Error("Categoria não encontrada")
      }

      // Adiciona as informações visuais à categoria
      const visual = CategoryVisualService.getCategoryVisual(category.id)
      return {
        ...category,
        color: visual.color,
        icon: visual.icon,
      }
    } catch (error) {
      handleApiError(error, "Falha ao carregar categoria")
      return null
    }
  },

  // Adicionar uma nova categoria
  async addCategory(category: Omit<Category, "id">): Promise<Category> {
    try {
      // Gera um ID baseado no nome (slug)
      const id = category.name
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, "-")

      // Separa os dados visuais dos dados que vão para o backend
      const { color, icon, ...backendData } = category

      const newCategory: Category = {
        ...backendData,
        id,
      }

      // Simula uma chamada de API (enviando apenas os dados relevantes para o backend)
      await apiCall<Category>("/categories", "POST", newCategory)

      // Atualiza o estado local
      categories = [...categories, newCategory]

      // Salva as informações visuais localmente
      if (color && icon) {
        CategoryVisualService.setCategoryVisual(id, color, icon)
      }

      // Retorna a categoria completa com as informações visuais
      const visual = CategoryVisualService.getCategoryVisual(id)
      return {
        ...newCategory,
        color: visual.color,
        icon: visual.icon,
      }
    } catch (error) {
      handleApiError(error, "Falha ao adicionar categoria")
      throw error
    }
  },

  // Atualizar uma categoria
  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    try {
      // Separa os dados visuais dos dados que vão para o backend
      const { color, icon, ...backendUpdates } = updates

      // Simula uma chamada de API (enviando apenas os dados relevantes para o backend)
      await apiCall<void>(`/categories/${id}`, "PATCH", backendUpdates)

      // Atualiza o estado local
      categories = categories.map((category) => (category.id === id ? { ...category, ...backendUpdates } : category))

      // Atualiza as informações visuais localmente
      if (color && icon) {
        CategoryVisualService.setCategoryVisual(id, color, icon)
      }

      const updatedCategory = categories.find((category) => category.id === id)

      if (!updatedCategory) {
        throw new Error("Categoria não encontrada")
      }

      // Retorna a categoria completa com as informações visuais
      const visual = CategoryVisualService.getCategoryVisual(id)
      return {
        ...updatedCategory,
        color: visual.color,
        icon: visual.icon,
      }
    } catch (error) {
      handleApiError(error, "Falha ao atualizar categoria")
      throw error
    }
  },

  // Excluir uma categoria
  async deleteCategory(id: string): Promise<boolean> {
    try {
      // Simula uma chamada de API
      await apiCall<void>(`/categories/${id}`, "DELETE")

      // Atualiza o estado local
      categories = categories.filter((category) => category.id !== id)

      return true
    } catch (error) {
      handleApiError(error, "Falha ao excluir categoria")
      return false
    }
  },
}

