// Este serviço gerencia apenas as preferências visuais das categorias no frontend
import type { CategoryVisualMap } from "@/types/category"

// Cores e ícones padrão para categorias
const defaultVisuals: CategoryVisualMap = {
  work: { color: "bg-blue-500", icon: "Briefcase" },
  personal: { color: "bg-green-500", icon: "User" },
  shopping: { color: "bg-purple-500", icon: "ShoppingBag" },
  health: { color: "bg-red-500", icon: "Heart" },
  education: { color: "bg-yellow-500", icon: "BookOpen" },
}

// Lista de cores disponíveis para categorias
export const availableColors = [
  { name: "Azul", value: "bg-blue-500" },
  { name: "Verde", value: "bg-green-500" },
  { name: "Roxo", value: "bg-purple-500" },
  { name: "Vermelho", value: "bg-red-500" },
  { name: "Amarelo", value: "bg-yellow-500" },
  { name: "Rosa", value: "bg-pink-500" },
  { name: "Indigo", value: "bg-indigo-500" },
  { name: "Laranja", value: "bg-orange-500" },
  { name: "Ciano", value: "bg-cyan-500" },
  { name: "Lime", value: "bg-lime-500" },
]

// Lista de ícones disponíveis para categorias
export const availableIcons = [
  { name: "Trabalho", value: "Briefcase" },
  { name: "Pessoal", value: "User" },
  { name: "Compras", value: "ShoppingBag" },
  { name: "Saúde", value: "Heart" },
  { name: "Educação", value: "BookOpen" },
  { name: "Casa", value: "Home" },
  { name: "Viagem", value: "Plane" },
  { name: "Finanças", value: "DollarSign" },
  { name: "Lazer", value: "Music" },
  { name: "Esporte", value: "Dumbbell" },
  { name: "Alimentação", value: "Utensils" },
  { name: "Tecnologia", value: "Smartphone" },
]

// Chave para armazenamento no localStorage
const STORAGE_KEY = "tarefas_category_visuals"

export const CategoryVisualService = {
  // Obter o mapeamento visual do localStorage ou usar o padrão
  getVisualMap(): CategoryVisualMap {
    if (typeof window === "undefined") {
      return defaultVisuals
    }

    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return defaultVisuals
    }

    try {
      return JSON.parse(stored)
    } catch (e) {
      console.error("Erro ao carregar mapeamento visual de categorias:", e)
      return defaultVisuals
    }
  },

  // Salvar o mapeamento visual no localStorage
  saveVisualMap(visualMap: CategoryVisualMap): void {
    if (typeof window === "undefined") {
      return
    }

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(visualMap))
    } catch (e) {
      console.error("Erro ao salvar mapeamento visual de categorias:", e)
    }
  },

  // Obter visual para uma categoria específica
  getCategoryVisual(categoryId: string): { color: string; icon: string } {
    const visualMap = this.getVisualMap()

    // Se a categoria já tem um visual definido, retorna
    if (visualMap[categoryId]) {
      return visualMap[categoryId]
    }

    // Caso contrário, cria um visual aleatório
    const randomColor = availableColors[Math.floor(Math.random() * availableColors.length)].value
    const randomIcon = availableIcons[Math.floor(Math.random() * availableIcons.length)].value

    // Salva o novo visual
    visualMap[categoryId] = { color: randomColor, icon: randomIcon }
    this.saveVisualMap(visualMap)

    return visualMap[categoryId]
  },

  // Definir visual para uma categoria
  setCategoryVisual(categoryId: string, color: string, icon: string): void {
    const visualMap = this.getVisualMap()
    visualMap[categoryId] = { color, icon }
    this.saveVisualMap(visualMap)
  },

  // Obter cores disponíveis
  getAvailableColors() {
    return availableColors
  },

  // Obter ícones disponíveis
  getAvailableIcons() {
    return availableIcons
  },
}

