import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { Trash2, Plus, Minus } from 'lucide-react'

export default function Cart() {
  const [cart, setCart] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { token } = useAuth()
  const navigate = useNavigate()

  const fetchCart = async () => {
    try {
      const res = await api.cart.get(token)
      if (res.ok) setCart(await res.json())
      else setError('Failed to load cart')
    } catch {
      setError('Failed to load cart')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCart()
  }, [token])

  const updateQty = async (itemId, quantity) => {
    if (quantity < 1) return
    const res = await api.cart.update(token, itemId, { quantity })
    if (res.ok) fetchCart()
  }

  const removeItem = async (itemId) => {
    const res = await api.cart.remove(token, itemId)
    if (res.ok) fetchCart()
  }

  const placeOrder = async () => {
    const res = await api.orders.create(token)
    if (res.ok) {
      navigate('/orders')
    } else {
      const err = await res.json()
      setError(err.detail || 'Failed to place order')
    }
  }

  if (loading) return <div className="text-center py-10">Loading...</div>
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>

  if (!cart || !cart.items || cart.items.length === 0) {
    return <div className="text-center py-10 text-gray-600">Your cart is empty.</div>
  }

  const total = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Cart</h1>
      <div className="space-y-4">
        {cart.items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              {item.product?.image_url ? (
                <img src={item.product.image_url} alt={item.product.name} className="h-20 w-20 object-cover rounded" />
              ) : (
                <div className="h-20 w-20 bg-gray-200 rounded flex items-center justify-center text-xs">No image</div>
              )}
              <div>
                <h2 className="font-semibold">{item.product.name}</h2>
                <p className="text-gray-600">${item.product.price.toFixed(2)} each</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button onClick={() => updateQty(item.id, item.quantity - 1)} className="p-1 border rounded hover:bg-gray-100">
                  <Minus size={16} />
                </button>
                <span className="w-8 text-center">{item.quantity}</span>
                <button onClick={() => updateQty(item.id, item.quantity + 1)} className="p-1 border rounded hover:bg-gray-100">
                  <Plus size={16} />
                </button>
              </div>
              <span className="font-bold">${(item.product.price * item.quantity).toFixed(2)}</span>
              <button onClick={() => removeItem(item.id)} className="text-red-600 hover:text-red-800">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex justify-between items-center bg-white p-4 rounded-lg shadow">
        <span className="text-xl font-bold">Total: ${total.toFixed(2)}</span>
        <button
          onClick={placeOrder}
          className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 font-semibold"
        >
          Place Order
        </button>
      </div>
    </div>
  )
}
