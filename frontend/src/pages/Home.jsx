import { Link } from 'react-router-dom'
import { Gamepad2, Headphones, ShieldCheck, Truck } from 'lucide-react'

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 text-white shadow-xl">
        <div className="grid gap-8 px-8 py-14 md:grid-cols-2 md:px-12 md:py-20">
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-100">Gaming Shop</p>
            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
              Upgrade your setup with the best gaming gear.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-blue-100">
              Find gaming laptops, keyboards, mice, headsets, monitors, controllers and accessories for every player.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/products" className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 shadow hover:bg-blue-50">
                Shop products
              </Link>
              <Link to="/register" className="rounded-lg border border-white/40 px-6 py-3 font-semibold text-white hover:bg-white/10">
                Create account
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-72 w-72 rounded-full bg-white/10 p-8 shadow-2xl ring-1 ring-white/20 md:h-96 md:w-96">
              <div className="absolute inset-8 rounded-full bg-white/10" />
              <Gamepad2 className="relative h-full w-full text-white drop-shadow-2xl" />
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <Gamepad2 className="mb-4 h-9 w-9 text-blue-600" />
          <h2 className="font-bold text-gray-900">Gaming gear</h2>
          <p className="mt-2 text-sm text-gray-600">Products selected for performance and comfort.</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <Truck className="mb-4 h-9 w-9 text-blue-600" />
          <h2 className="font-bold text-gray-900">Fast checkout</h2>
          <p className="mt-2 text-sm text-gray-600">Add items to cart and place orders quickly.</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <ShieldCheck className="mb-4 h-9 w-9 text-blue-600" />
          <h2 className="font-bold text-gray-900">Secure account</h2>
          <p className="mt-2 text-sm text-gray-600">Login-protected cart and order history.</p>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
          <Headphones className="mb-4 h-9 w-9 text-blue-600" />
          <h2 className="font-bold text-gray-900">Accessories</h2>
          <p className="mt-2 text-sm text-gray-600">Complete your desk with headsets, mice and keyboards.</p>
        </div>
      </section>
    </div>
  )
}
