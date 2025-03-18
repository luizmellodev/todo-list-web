import CategoryDetail from "@/components/categories/category-detail"
import { CategoryService } from "@/services/category-service"

export async function generateStaticParams() {
  // Em um app real, você buscaria as categorias do backend
  const categories = await CategoryService.getAllCategories()

  return categories.map((category) => ({
    id: category.id,
  }))
}

export default function CategoryPage({ params }: { params: { id: string } }) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-white p-4">
      <div className="max-w-4xl mx-auto pt-4">
        <CategoryDetail categoryId={params.id} />
      </div>
    </main>
  )
}

