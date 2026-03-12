import { memo } from "react"

function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      
      <img
        src={product.image}
        alt={product.name}
        loading="lazy"
        decoding="async"
        className="w-full h-48 object-cover"
      />

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mt-1">
          {product.description}
        </p>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-xl font-bold text-gray-900">
            ${product.price}
          </span>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            Add to Cart
          </button>
        </div>
      </div>

    </div>
  )
}

export default memo(ProductCard)