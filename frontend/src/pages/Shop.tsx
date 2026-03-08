import {
  BadgePercent,
  CirclePlus,
  LayoutDashboard,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  UserCircle2,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Product, User } from '../App'

interface ShopProps {
  user: User | null
  products: Product[]
  cart: string[]
  onAddToCart: (productId: string) => void
  onCheckout: () => Promise<string | null>
  onAddProduct: (payload: {
    name: string
    price: string
    image: string
    category: string
    description: string
    rating: string
  }) => Promise<string | null>
}

const defaultProductForm = {
  name: '',
  price: '',
  image: '',
  category: '',
  description: '',
  rating: '',
}

function Shop({ user, products, cart, onAddToCart, onCheckout, onAddProduct }: ShopProps) {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [checkoutError, setCheckoutError] = useState('')
  const [checkoutSuccess, setCheckoutSuccess] = useState('')
  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [newProduct, setNewProduct] = useState(defaultProductForm)
  const [productFormError, setProductFormError] = useState('')
  const [productFormSuccess, setProductFormSuccess] = useState('')
  const [isCreatingProduct, setIsCreatingProduct] = useState(false)

  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))]
  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory)

  const cartTotal = cart.reduce((sum, productId) => {
    const product = products.find((p) => p.id === productId)
    return sum + (product?.price || 0)
  }, 0)

  const topRatedProduct = useMemo(
    () => [...products].sort((a, b) => b.rating - a.rating)[0],
    [products],
  )

  const goToProfile = () => {
    navigate('/profile')
  }

  const handleCheckout = async () => {
    setCheckoutError('')
    setCheckoutSuccess('')
    setIsCheckingOut(true)

    const error = await onCheckout()

    setIsCheckingOut(false)
    if (error) {
      setCheckoutError(error)
      return
    }

    setCheckoutSuccess('Order confirmed successfully')
  }

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProductFormError('')
    setProductFormSuccess('')

    if (Object.values(newProduct).some((value) => !value.trim())) {
      setProductFormError('Please fill all product fields')
      return
    }

    setIsCreatingProduct(true)
    const error = await onAddProduct(newProduct)
    setIsCreatingProduct(false)

    if (error) {
      setProductFormError(error)
      return
    }

    setNewProduct(defaultProductForm)
    setProductFormSuccess('Product added to shop')
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <h1 className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
            <ShoppingBag size={22} /> ShopHub
          </h1>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-slate-600 sm:block">{user?.email}</span>
            <button
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              onClick={goToProfile}
            >
              <UserCircle2 size={16} /> My Profile
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto mt-6 max-w-7xl px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 via-orange-500 to-amber-400 p-6 text-white shadow-lg">
          <div className="absolute -right-6 -top-8 h-28 w-28 rounded-full bg-white/20" />
          <div className="absolute -bottom-12 right-24 h-32 w-32 rounded-full bg-white/10" />
          <div className="relative">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              <BadgePercent size={14} /> Mega Sale Week
            </p>
            <h2 className="mt-3 text-2xl font-black sm:text-3xl">Up to 40% off on top accessories</h2>
            <p className="mt-2 text-sm text-white/90">
              Limited-time deals on keyboards, headsets, and productivity gear.
              {topRatedProduct ? ` Try best-rated: ${topRatedProduct.name}.` : ''}
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[320px_1fr]">
        <aside className="space-y-5">
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Categories</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                    selectedCategory === category
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-500">
              <ShoppingCart size={15} /> Cart Summary
            </h3>
            <p className="mt-3 text-sm text-slate-600">Items: {cart.length}</p>
            <p className="text-lg font-bold text-slate-900">${cartTotal.toFixed(2)}</p>
            {checkoutError && <p className="mt-2 text-sm text-red-600">{checkoutError}</p>}
            {checkoutSuccess && <p className="mt-2 text-sm text-emerald-700">{checkoutSuccess}</p>}
            <button
              disabled={cart.length === 0 || isCheckingOut}
              onClick={handleCheckout}
              className="mt-4 w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:bg-emerald-300"
            >
              {isCheckingOut ? 'Confirming...' : 'Checkout'}
            </button>
          </div>

          {user?.role === 'admin' && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-amber-900">
                <LayoutDashboard size={15} /> Admin: Add Product
              </h3>
              <form className="mt-3 space-y-2" onSubmit={handleProductSubmit}>
                <input
                  className="w-full rounded-md border border-amber-300 px-3 py-2 text-sm"
                  placeholder="Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, name: e.target.value }))}
                />
                <input
                  className="w-full rounded-md border border-amber-300 px-3 py-2 text-sm"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, price: e.target.value }))}
                />
                <input
                  className="w-full rounded-md border border-amber-300 px-3 py-2 text-sm"
                  placeholder="Image URL"
                  value={newProduct.image}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, image: e.target.value }))}
                />
                <input
                  className="w-full rounded-md border border-amber-300 px-3 py-2 text-sm"
                  placeholder="Category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, category: e.target.value }))}
                />
                <input
                  className="w-full rounded-md border border-amber-300 px-3 py-2 text-sm"
                  placeholder="Rating (0-5)"
                  value={newProduct.rating}
                  onChange={(e) => setNewProduct((prev) => ({ ...prev, rating: e.target.value }))}
                />
                <textarea
                  className="w-full rounded-md border border-amber-300 px-3 py-2 text-sm"
                  placeholder="Description"
                  rows={2}
                  value={newProduct.description}
                  onChange={(e) =>
                    setNewProduct((prev) => ({ ...prev, description: e.target.value }))
                  }
                />
                {productFormError && <p className="text-xs text-red-700">{productFormError}</p>}
                {productFormSuccess && <p className="text-xs text-emerald-700">{productFormSuccess}</p>}
                <button
                  type="submit"
                  disabled={isCreatingProduct}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 px-3 py-2 text-sm font-semibold text-white hover:bg-amber-500 disabled:bg-amber-300"
                >
                  <CirclePlus size={16} /> {isCreatingProduct ? 'Adding...' : 'Add Product'}
                </button>
              </form>
            </div>
          )}
        </aside>

        <main>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-2xl font-bold">{selectedCategory} Products</h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
              <Sparkles size={14} /> {filteredProducts.length} products
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <img src={product.image} alt={product.name} className="h-44 w-full object-cover" />
                <div className="p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h3 className="text-base font-bold text-slate-900">{product.name}</h3>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {product.category}
                    </span>
                  </div>
                  <p className="line-clamp-2 text-sm text-slate-600">{product.description}</p>
                  <p className="mt-2 text-xs text-amber-600">{'★'.repeat(Math.floor(product.rating))} ({product.rating})</p>
                  <div className="mt-4 flex items-center justify-between">
                    <p className="text-xl font-black text-slate-900">${product.price.toFixed(2)}</p>
                    <button
                      className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                      onClick={() => onAddToCart(product.id)}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Shop
