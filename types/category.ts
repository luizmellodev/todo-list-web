// Modificando a interface Category para separar dados do backend e dados visuais
export interface Category {
  id: string
  name: string
  // Esses campos são apenas para o frontend web
  color?: string
  icon?: string
}

// Interface para o mapeamento visual (apenas frontend)
export interface CategoryVisualMap {
  [categoryId: string]: {
    color: string
    icon: string
  }
}

