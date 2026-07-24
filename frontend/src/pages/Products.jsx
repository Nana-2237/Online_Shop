import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { trackEvent } from '../tracking.js'
import { ShoppingCart, AlertCircle, CheckCircle } from 'lucide-react'

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toast, setToast] = useState(null)
  const [cartQuantities, setCartQuantities] = useState({})
  const { token } = useAuth()

  useEffect(() => {
    api.products.list()
      .then(async res => {
        if (res.ok) {
          const data = await res.json()
          setProducts(data)
        } else setError('Failed to load products')
      })
      .catch(() => setError('Failed to load products'))
      .finally(() => setLoading(false))
  }, [token])

  useEffect(() => {
    if (!token) {
      setCartQuantities({})
      return
    }

    api.cart.get(token)
      .then(async res => {
        if (res.ok) {
          const cart = await res.json()
          const quantities = {}
          cart.items?.forEach(item => {
            quantities[item.product_id] = item.quantity
          })
          setCartQuantities(quantities)
        }
      })
      .catch(() => {})
  }, [token])

  const showToast = (text, type = 'success') => {
    setToast({ text, type })
    setTimeout(() => setToast(null), 2500)
  }

  const handleProductClick = (product) => {
    trackEvent(token, 'product_viewed', {
      product_id: product.id,
      product_name: product.name,
      category: product.category,
      price: product.price,
      element_id: `product-card-${product.id}`,
    })
  }

  const addToCart = async (product) => {
    const quantityInCart = cartQuantities[product.id] || 0
    if (quantityInCart >= product.stock) {
      showToast(`You already have all ${product.stock} available units of ${product.name} in your cart`, 'error')
      return
    }
    if (product.stock <= 0) {
      showToast(`${product.name} is out of stock`, 'error')
      return
    }
    trackEvent(token, 'product_clicked', {
      product_id: product.id,
      product_name: product.name,
      category: product.category,
      price: product.price,
      element_id: `product-card-${product.id}`,
    })
    if (!token) {
      showToast('Please login to add items to cart', 'error')
      return
    }
    try {
      const res = await api.cart.add(token, { product_id: product.id, quantity: 1 })
      if (res.ok) {
        trackEvent(token, 'cart_added', {
          product_id: product.id,
          product_name: product.name,
          category: product.category,
          price: product.price,
          quantity: 1,
        })
        setCartQuantities(current => ({
          ...current,
          [product.id]: (current[product.id] || 0) + 1,
        }))
        showToast(`${product.name} added to cart`)
      } else {
        const err = await res.json()
        showToast(err.detail || 'Failed to add to cart', 'error')
      }
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
        {products.map((product) => {
          const quantityInCart = cartQuantities[product.id] || 0
          const canAdd = product.stock > 0 && quantityInCart < product.stock

          return (
          <div
            key={product.id}
            onClick={() => handleProductClick(product)}
            className="bg-white rounded-lg shadow p-4 flex flex-col cursor-pointer hover:shadow-md transition-shadow"
          >
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="h-40 w-full object-cover rounded-md mb-4" />
            ) : (
              <div className="h-40 bg-gray-200 rounded-md mb-4 flex items-center justify-center text-gray-500">No image</div>
            )}
            <h2 className="text-lg font-semibold">{product.name}</h2>
            <p className="text-gray-600 text-sm mb-2">{product.category}</p>
            <p className="text-xs text-gray-500 mb-2">Stock: {product.stock} · In cart: {quantityInCart}</p>
            <p className="text-gray-700 text-sm mb-4 flex-1">{product.description}</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
              <button
                onClick={(event) => {
                  event.stopPropagation()
                  addToCart(product)
                }}
                disabled={!canAdd}
                className={`px-4 py-2 rounded-md flex items-center gap-2 ${!canAdd ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                <ShoppingCart size={18} /> {product.stock <= 0 ? 'Out of stock' : quantityInCart >= product.stock ? 'Max in cart' : 'Add'}
              </button>
            </div>
          </div>
          )
        })}
      </div>
    </div>
  )
}
