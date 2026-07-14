import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { token } = useAuth()

  useEffect(() => {
    api.orders.list(token)
      .then(async res => {
        if (res.ok) setOrders(await res.json())
        else setError('Failed to load orders')
      })
      .catch(() => setError('Failed to load orders'))
      .finally(() => setLoading(false))
  }, [token])

  if (loading) return <div className="text-center py-10">Loading...</div>
  if (error) return <div className="text-center py-10 text-red-600">{error}</div>

  if (orders.length === 0) return <div className="text-center py-10 text-gray-600">No orders yet.</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="font-semibold">Order #{order.id}</p>
                <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
              </div>
              <span className="text-xl font-bold text-blue-600">${order.total.toFixed(2)}</span>
            </div>
            <div className="text-sm text-gray-600 mb-2 capitalize">Status: {order.status}</div>
            <ul className="divide-y">
              {order.items.map((item) => (
                <li key={item.id} className="py-2 flex justify-between">
                  <span>{item.product?.name} x {item.quantity}</span>
                  <span>${(item.unit_price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
