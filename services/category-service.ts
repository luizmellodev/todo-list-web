import { apiCall, handleApiError } from "./api"
import type { Category, UpdateCategory } from "@/types/category"
import { CategoryVisualService } from "./category-visual-service"
import { v4 as uuidv4 } from "uuid"

export const CategoryService = {
  // Obter todas as categorias
  async getAllCategories(token: string | null): Promise<Category[]> {
    try {
      // Faz a requisição para obter todas as categorias
      const categories = await apiCall<Category[]>("/categories", "GET")

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
      // Obtém todas as categorias e filtra pelo ID
      const categories = await this.getAllCategories(localStorage.getItem("token"))
      const category = categories.find((cat) => cat.id === id)

      if (!category) {
        throw new Error("Categoria não encontrada")
      }

      return category
    } catch (error) {
      handleApiError(error, "Falha ao carregar categoria")
      return null
    }
  },

  // Adicionar uma nova categoria
  async addCategory(category: Omit<Category, "id" | "created_at" | "user_id">): Promise<Category> {
    try {
      // Separa os dados visuais dos dados que vão para o backend
      const { color, icon, ...backendData } = category

      // Prepara a categoria para envio
      const newCategory: Partial<Category> = {
        ...backendData,
        id: uuidv4(),
        created_at: new Date().toISOString().split("T")[0], // Formato YYYY-MM-DD
      }

      // Faz a requisição para adicionar a categoria
      const createdCategory = await apiCall<Category>("/categories", "POST", newCategory)

      // Salva as informações visuais localmente
      if (color && icon) {
        CategoryVisualService.setCategoryVisual(createdCategory.id, color, icon)
      }

      // Retorna a categoria completa com as informações visuais
      const visual = CategoryVisualService.getCategoryVisual(createdCategory.id)
      return {
        ...createdCategory,
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

      // Cria um objeto UpdateCategory com apenas os campos permitidos
      const updateData: UpdateCategory = {}
      if (backendUpdates.name) {
        updateData.name = backendUpdates.name
      }

      // Faz a requisição para atualizar a categoria
      const updatedCategory = await apiCall<Category>(`/categories/${id}`, "PUT", updateData)

      // Atualiza as informações visuais localmente
      if (color && icon) {
        CategoryVisualService.setCategoryVisual(id, color, icon)
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
      // Faz a requisição para excluir a categoria
      await apiCall<any>(`/categories/${id}`, "DELETE")
      return true
    } catch (error) {
      handleApiError(error, "Falha ao excluir categoria")
      return false
    }
  },
}

