import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'
import { Pencil, Plus, Trash2, X } from 'lucide-react'

const emptyForm = {
  name: '',
  description: '',
  category: '',
  price: '',
  stock: '',
  image_url: '',
}

export default function AdminProducts() {
  const [products, setProducts] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const { token } = useAuth()

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await api.products.list()
      if (res.ok) setProducts(await res.json())
      else setError('Failed to load products')
    } catch {
      setError('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const submitProduct = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      image_url: form.image_url || null,
    }

    try {
      const res = editingId
        ? await api.products.update(token, editingId, payload)
        : await api.products.create(token, payload)

      if (!res.ok) {
        const err = await res.json()
        setError(err.detail || 'Failed to save product')
        return
      }

      setMessage(editingId ? 'Product updated' : 'Product created')
      resetForm()
      fetchProducts()
    } catch {
      setError('Failed to save product')
    }
  }

  const editProduct = (product) => {
    setEditingId(product.id)
    setForm({
      name: product.name,
      description: product.description || '',
      category: product.category,
      price: String(product.price),
      stock: String(product.stock),
      image_url: product.image_url || '',
    })
  }

  const deleteProduct = async (id) => {
    setError('')
    setMessage('')

    try {
      const res = await api.products.remove(token, id)
      if (!res.ok) {
        const err = await res.json()
        setError(err.detail || 'Failed to delete product')
        return
      }

      setMessage('Product deleted')
      fetchProducts()
    } catch {
      setError('Failed to delete product')
    }
  }

  if (loading) return <div className="text-center py-10">Loading...</div>

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6 lg:col-span-1">
        <h1 className="text-2xl font-bold mb-4">{editingId ? 'Edit Product' : 'Add Product'}</h1>
        {message && <div className="mb-4 bg-green-100 text-green-700 p-3 rounded">{message}</div>}
        {error && <div className="mb-4 bg-red-100 text-red-700 p-3 rounded">{error}</div>}
        <form onSubmit={submitProduct} className="space-y-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="w-full border rounded px-3 py-2" />
          <input name="category" value={form.category} onChange={handleChange} placeholder="Category" required className="w-full border rounded px-3 py-2" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full border rounded px-3 py-2" />
          <input name="price" value={form.price} onChange={handleChange} type="number" min="0" step="0.01" placeholder="Price" required className="w-full border rounded px-3 py-2" />
          <input name="stock" value={form.stock} onChange={handleChange} type="number" min="0" step="1" placeholder="Stock" required className="w-full border rounded px-3 py-2" />
          <input name="image_url" value={form.image_url} onChange={handleChange} placeholder="Image URL" className="w-full border rounded px-3 py-2" />
          <div className="flex gap-2">
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
              <Plus size={18} /> {editingId ? 'Update' : 'Create'}
            </button>
            {editingId && (
              <button type="button" onClick={resetForm} className="border px-4 py-2 rounded hover:bg-gray-100 flex items-center gap-2">
                <X size={18} /> Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-2xl font-bold">Products</h2>
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg shadow p-4 flex justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.category}</p>
              <p className="text-sm text-gray-700">${product.price.toFixed(2)} · Stock: {product.stock}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => editProduct(product)} className="text-blue-600 hover:text-blue-800 flex items-center gap-1">
                <Pencil size={18} /> Edit
              </button>
              <button onClick={() => deleteProduct(product.id)} className="text-red-600 hover:text-red-800 flex items-center gap-1">
                <Trash2 size={18} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
