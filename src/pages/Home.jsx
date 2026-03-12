import { useState, useEffect, useMemo } from "react"
import ProductCard from "../components/ProductCard"
import SearchFilter from "../components/SearchFilter"

export default function Home() {
  const [products, setProducts] = useState([])
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}products.json`, {
          cache: "force-cache"
        })

        if (!response.ok) {
          throw new Error("Failed to load products")
        }

        const data = await response.json()
        setProducts(data)
      } catch (err) {
        console.error("Error loading products:", err)
        setError("Failed to load products")
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [])

  // filtriranje optimizovano
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())

      const matchesCategory =
        category === "all" || product.category === category

      return matchesSearch && matchesCategory
    })
  }, [products, search, category])

  if (loading) {
    return (
      <div className="text-center py-8 text-lg">
        Loading products...
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        {error}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        Our Products
      </h1>

      <SearchFilter
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
      />

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600">
          No products found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}