import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { ShoppingCart, AlertCircle, CheckCircle } from 'lucide-react'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)
  const { token } = useAuth()

  useEffect(() => {
    api.products.list()
      .then(async res => {
        if (res.ok) setProducts(await res.json())
        else setError('Failed to load products')
      })
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false))
  }, [])

  const showToast = (text, type = 'success') => {
    setToast({ text, type })
    setTimeout(() => setToast(null), 2500)
  }

  const addToCart = async (product) => {
    if (!token) {
      showToast('Please login to add items to cart', 'error')
      return
    }
    try {
      const res = await api.cart.add(token, { product_id: product.id, quantity: 1 })
      if (res.ok) showToast(`${product.name} added to cart`)
      else showToast('Failed to add to cart', 'error')
    } catch {
      showToast('Failed to add to cart', 'error')
    }
  }

  if (loading) return <div className="text-center py-10">Loading...</div>
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg ${toast.type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
          {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          <span className="font-medium">{toast.text}</span>
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow p-4 flex flex-col">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="h-40 w-full object-cover rounded-md mb-4" />
            ) : (
              <div className="h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center text-gray-500">No image</div>
            )}
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-gray-600 text-sm mb-2">{product.category}</p>
            <p className="text-gray-700 text-sm mb-4 flex-1">{product.description}</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
              <button
                onClick={() => addToCart(product)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <ShoppingCart size={18} /> Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
