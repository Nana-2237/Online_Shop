import { useEffect, useState } from 'react'
import { api } from '../api.js'
import { useAuth } from '../context/AuthContext.jsx'

const emptyForm = {
  email: '',
  full_name: '',
  password: '',
  is_active: true,
  is_admin: false,
}

export default function AdminUsers() {
  const { token, user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const loadUsers = async () => {
    setError('')
    try {
      const res = await api.adminUsers.list(token)
      if (!res.ok) throw new Error('Failed to load users')
      setUsers(await res.json())
    } catch {
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const startEdit = (account) => {
    setEditingId(account.id)
    setForm({
      email: account.email,
      full_name: account.full_name,
      password: '',
      is_active: account.is_active,
      is_admin: account.is_admin,
    })
    setMessage('')
    setError('')
  }

  const submitUser = async (event) => {
    event.preventDefault()
    setMessage('')
    setError('')

    const payload = {
      email: form.email,
      full_name: form.full_name,
      is_active: form.is_active,
      is_admin: form.is_admin,
    }

    if (form.password) payload.password = form.password

    try {
      const res = editingId
        ? await api.adminUsers.update(token, editingId, payload)
        : await api.adminUsers.create(token, { ...payload, password: form.password })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.detail || 'Failed to save user')
      }

      setMessage(editingId ? 'User updated' : 'User created')
      resetForm()
      loadUsers()
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteUser = async (account) => {
    if (!confirm(`Delete ${account.email}?`)) return
    setMessage('')
    setError('')

    try {
      const res = await api.adminUsers.remove(token, account.id)
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.detail || 'Failed to delete user')
      }
      setMessage('User deleted')
      loadUsers()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <div className="text-center py-10">Loading users...</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Accounts</h1>
        <p className="text-gray-600">View, create, edit, activate, deactivate and delete user accounts.</p>
      </div>

      {message && <div className="rounded bg-green-100 p-3 text-green-700">{message}</div>}
      {error && <div className="rounded bg-red-100 p-3 text-red-700">{error}</div>}

      <form onSubmit={submitUser} className="rounded-lg bg-white p-5 shadow space-y-4">
        <h2 className="text-lg font-semibold">{editingId ? 'Edit account' : 'Create account'}</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <input
            type="email"
            required
            placeholder="Email"
            value={form.email}
            onChange={(event) => updateField('email', event.target.value)}
            className="rounded border px-3 py-2"
          />
          <input
            required
            placeholder="Full name"
            value={form.full_name}
            onChange={(event) => updateField('full_name', event.target.value)}
            className="rounded border px-3 py-2"
          />
          <input
            type="password"
            required={!editingId}
            placeholder={editingId ? 'New password optional' : 'Password'}
            value={form.password}
            onChange={(event) => updateField('password', event.target.value)}
            className="rounded border px-3 py-2"
          />
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(event) => updateField('is_active', event.target.checked)}
              />
              Active
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_admin}
                onChange={(event) => updateField('is_admin', event.target.checked)}
              />
              Admin
            </label>
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            {editingId ? 'Save changes' : 'Create user'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="rounded bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300">
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="overflow-hidden rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Active</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Admin</th>
              <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((account) => (
              <tr key={account.id}>
                <td className="px-4 py-3 text-sm text-gray-600">{account.id}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{account.email}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{account.full_name}</td>
                <td className="px-4 py-3 text-sm">{account.is_active ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3 text-sm">{account.is_admin ? 'Yes' : 'No'}</td>
                <td className="px-4 py-3 text-right text-sm">
                  <button onClick={() => startEdit(account)} className="mr-3 text-blue-600 hover:text-blue-800">
                    Edit
                  </button>
                  <button
                    onClick={() => deleteUser(account)}
                    disabled={account.id === currentUser?.id}
                    className="text-red-600 hover:text-red-800 disabled:cursor-not-allowed disabled:text-gray-400"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
