import { useState, useEffect } from 'react'
import ProductCard from '../components/ProductCard'
import SearchFilter from '../components/SearchFilter'

export default function Home() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
  fetch(`${import.meta.env.BASE_URL}products.json`)
    .then(response => response.json())
    .then(data => {
      setProducts(data)
      setFilteredProducts(data)
      setLoading(false)
    })
    .catch(error => {
      console.error('Error loading products:', error)
      setLoading(false)
    })
}, [])

  useEffect(() => {
    let filtered = products

    if (search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (category !== 'all') {
      filtered = filtered.filter(product => product.category === category)
    }

    setFilteredProducts(filtered)
  }, [search, category, products])

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Our Products</h1>
      
      <SearchFilter
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
      />

      {filteredProducts.length === 0 ? (
        <p className="text-center text-gray-600">No products found.</p>
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