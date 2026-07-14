import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { ShoppingCart, Package, User, LogOut, LogIn } from 'lucide-react'

export default function Navbar() {
  const { token, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/products')
  }

  return (
    <nav className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/products" className="text-xl font-bold text-blue-600">
              Gaming Shop
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/products" className="text-gray-700 hover:text-blue-600 flex items-center gap-1">
              <Package size={18} /> Products
            </Link>
            {token && (
              <>
                <Link to="/cart" className="text-gray-700 hover:text-blue-600 flex items-center gap-1">
                  <ShoppingCart size={18} /> Cart
                </Link>
                <Link to="/orders" className="text-gray-700 hover:text-blue-600 flex items-center gap-1">
                  <User size={18} /> Orders
                </Link>
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
              <Link to="/login" className="text-gray-700 hover:text-blue-600 flex items-center gap-1">
                <LogIn size={18} /> Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
