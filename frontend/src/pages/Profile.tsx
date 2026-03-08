import { ArrowLeft, LogOut, Receipt, ShoppingCart, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Order, Product, User } from '../App'

interface ProfileProps {
  user: User | null
  cart: string[]
  products: Product[]
  orders: Order[]
  onLogout: () => void
}

function Profile({ user, cart, products, orders, onLogout }: ProfileProps) {
  const navigate = useNavigate()

  const currentCartTotal = cart.reduce((sum, productId) => {
    const product = products.find((p) => p.id === productId)
    return sum + (product?.price || 0)
  }, 0)

  const totalBilled = orders.reduce((sum, order) => sum + order.totalAmount, 0)
  const totalItemsPurchased = orders.reduce(
    (sum, order) => sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0),
    0,
  )

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-cyan-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <button
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => navigate('/shop')}
          >
            <ArrowLeft size={16} /> Back to Shop
          </button>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">My Profile</h1>
          <button
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-2 text-sm font-semibold text-white hover:bg-red-500"
            onClick={handleLogout}
          >
            <LogOut size={16} /> Logout
          </button>
        </header>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-slate-100 p-3 text-slate-700">
                  <UserRound size={24} />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">{user?.email}</p>
                  <p className="text-sm text-slate-500">{user?.role === 'admin' ? 'Administrator' : 'Customer'}</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Billing Summary</h2>
              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-lg bg-slate-100 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Total Spent</p>
                  <p className="text-xl font-black text-slate-900">${totalBilled.toFixed(2)}</p>
                </div>
                <div className="rounded-lg bg-slate-100 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Current Cart</p>
                  <p className="text-xl font-black text-slate-900">${currentCartTotal.toFixed(2)}</p>
                </div>
                <div className="rounded-lg bg-slate-100 p-3">
                  <p className="text-xs uppercase tracking-wide text-slate-500">Avg. Order</p>
                  <p className="text-xl font-black text-slate-900">
                    ${orders.length ? (totalBilled / orders.length).toFixed(2) : '0.00'}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Order History</h2>
              <div className="mt-4 space-y-3">
                {orders.length === 0 && <p className="text-sm text-slate-600">No orders yet.</p>}
                {orders.map((order) => (
                  <div key={order.id} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold text-slate-900">Order #{order.id.slice(-6).toUpperCase()}</p>
                      <p className="text-sm text-slate-500">
                        {new Date(order.confirmedAt).toLocaleDateString()} | {order.status}
                      </p>
                    </div>
                    <p className="mt-2 text-sm font-semibold text-slate-800">Total: ${order.totalAmount.toFixed(2)}</p>
                    <div className="mt-2 space-y-1">
                      {order.items.map((item) => (
                        <p key={`${order.id}-${item.productId}`} className="text-sm text-slate-600">
                          {item.productName} x {item.quantity} - ${item.lineTotal.toFixed(2)}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-base font-bold text-slate-900">Your Stats</h3>
            <div className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between"><span className="text-slate-600">Orders</span><span className="font-semibold">{orders.length}</span></div>
              <div className="flex items-center justify-between"><span className="text-slate-600">Items Purchased</span><span className="font-semibold">{totalItemsPurchased}</span></div>
              <div className="flex items-center justify-between"><span className="text-slate-600">Total Spent</span><span className="font-semibold">${totalBilled.toFixed(2)}</span></div>
              <div className="flex items-center justify-between"><span className="text-slate-600">Cart Items</span><span className="font-semibold">{cart.length}</span></div>
            </div>

            <button
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
              onClick={() => navigate('/shop')}
            >
              <ShoppingCart size={16} /> Continue Shopping
            </button>
            <button
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={() => navigate('/shop')}
            >
              <Receipt size={16} /> Browse Deals
            </button>
          </aside>
        </section>
      </div>
    </div>
  )
}

export default Profile
