export default function SearchFilter({ search, setSearch, category, setCategory }) {
  const categories = ['all', 'electronics', 'audio', 'wearables']

  return (
    <div className="mb-8 flex flex-col md:flex-row gap-4">
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </option>
        ))}
      </select>
    </div>
  )
}