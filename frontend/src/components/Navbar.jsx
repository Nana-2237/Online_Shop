import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { ShoppingCart, Package, User, LogOut, LogIn, Shield, Home, Users } from 'lucide-react'

export default function Navbar() {
  const { token, user, logout } = useAuth()
  const navigate = useNavigate()
  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-md flex items-center gap-1 transition ${
      isActive
        ? 'bg-blue-50 text-blue-700 shadow-sm ring-1 ring-blue-100'
        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
    }`

  const handleLogout = () => {
    logout()
    navigate('/products')
  }

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold text-blue-600">
              Gaming Shop
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <NavLink to="/" end className={linkClass}>
              <Home size={18} /> Home
            </NavLink>
            <NavLink to="/products" className={linkClass}>
              <Package size={18} /> Products
            </NavLink>
            {token && (
              <>
                <NavLink to="/cart" className={linkClass}>
                  <ShoppingCart size={18} /> Cart
                </NavLink>
                <NavLink to="/orders" className={linkClass}>
                  <User size={18} /> Orders
                </NavLink>
                {user?.is_admin && (
                  <>
                    <NavLink to="/admin/products" className={linkClass}>
                      <Shield size={18} /> Admin Products
                    </NavLink>
                    <NavLink to="/admin/users" className={linkClass}>
                      <Users size={18} /> Accounts
                    </NavLink>
                  </>
                )}
                <span className="text-sm text-gray-500">{user?.email}</span>
                <button
                  onClick={handleLogout}
                  className="text-gray-700 hover:text-blue-600 flex items-center gap-1"
                >
                  <LogOut size={18} /> Logout
                </button>
              </>
            )}
            {!token && (
              <NavLink to="/login" className={linkClass}>
                <LogIn size={18} /> Login
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
