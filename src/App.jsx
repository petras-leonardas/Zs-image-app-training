import { useState } from 'react'
import catalog from '../images/catalog.json'

function App() {
  const [selectedColor, setSelectedColor] = useState('All')
  const [selectedSize, setSelectedSize] = useState('All')

  // Map image filenames to resolved URLs using Vite's glob import
  const modules = import.meta.glob('../images/*.{jpg,jpeg,png,webp}', {
    eager: true,
    import: 'default',
  })
  const imageUrlByName = Object.entries(modules).reduce((acc, [path, url]) => {
    const name = path.split('/').pop()
    acc[name] = url
    return acc
  }, /** @type {Record<string, string>} */ ({}))

  const colors = ['All', ...Array.from(new Set(catalog.map((i) => i.color)))]
  const sizes = ['All', ...Array.from(new Set(catalog.map((i) => i.size)))]

  const filtered = catalog.filter(
    (i) => (selectedColor === 'All' || i.color === selectedColor) && (selectedSize === 'All' || i.size === selectedSize),
  )

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h1 className="text-4xl font-bold">Image Gallery</h1>
          <div className="flex flex-wrap gap-3">
            <label className="flex items-center gap-2 text-sm">
              <span className="font-medium">Color</span>
              <select 
                value={selectedColor} 
                onChange={(e) => setSelectedColor(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {colors.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <span className="font-medium">Size</span>
              <select 
                value={selectedSize} 
                onChange={(e) => setSelectedSize(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </header>

        <main>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item) => {
              const src = imageUrlByName[item.title]
              const alt = `${item.title} - ${item.color} - ${item.size}`
              return (
                <figure className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-colors" key={`${item.title}-${item.size}`}>
                  {src ? (
                    <img 
                      src={src} 
                      alt={alt} 
                      loading="lazy" 
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 flex items-center justify-center bg-gray-700 text-gray-400">
                      Image not found
                    </div>
                  )}
                  <figcaption className="p-4">
                    <div className="mb-2">
                      <span className="font-semibold text-sm">{item.title}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs">
                        {item.color}
                      </span>
                      <span className="inline-block px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs">
                        {item.size}
                      </span>
                    </div>
                  </figcaption>
                </figure>
              )
            })}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
