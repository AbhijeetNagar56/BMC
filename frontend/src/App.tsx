import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Profile from './pages/Profile'
import Shop from './pages/Shop'
import Signup from './pages/Signup'

export interface User {
  id: string
  email: string
  username: string
  role: 'user' | 'admin'
}

export interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  description: string
  rating: number
}

export interface OrderItem {
  productId: string
  productName: string
  unitPrice: number
  quantity: number
  lineTotal: number
}

export interface Order {
  id: string
  totalAmount: number
  status: string
  confirmedAt: string
  createdAt: string
  items: OrderItem[]
}

interface NewProductInput {
  name: string
  price: string
  image: string
  category: string
  description: string
  rating: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [cart, setCart] = useState<string[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  const fetchProducts = async () => {
    const response = await fetch(`${API_BASE_URL}/shop/products`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch products')
    }

    const data = await response.json()
    setProducts(data.products || [])
  }

  const fetchOrders = async () => {
    const response = await fetch(`${API_BASE_URL}/shop/orders/my`, {
      method: 'GET',
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Failed to fetch orders')
    }

    const data = await response.json()
    setOrders(data.orders || [])
  }

  useEffect(() => {
    const initialize = async () => {
      try {
        await fetchProducts()

        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          method: 'GET',
          credentials: 'include',
        })

        if (!response.ok) {
          setUser(null)
          setIsAuthenticated(false)
          setOrders([])
          return
        }

        const data = await response.json()
        setUser(data.user)
        setIsAuthenticated(true)
        await fetchOrders()
      } catch {
        setUser(null)
        setIsAuthenticated(false)
        setOrders([])
      } finally {
        setIsCheckingAuth(false)
      }
    }

    initialize()
  }, [])

  const handleLogin = async (identifier: string, password: string): Promise<string | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ identifier, password }),
      })

      const data = await response.json()
      if (!response.ok) {
        return data.message || 'Login failed'
      }

      setUser(data.user)
      setIsAuthenticated(true)
      await fetchOrders()
      return null
    } catch {
      return 'Unable to connect to server'
    }
  }

  const handleSignup = async (email: string, password: string): Promise<string | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      if (!response.ok) {
        return data.message || 'Signup failed'
      }

      setUser(data.user)
      setIsAuthenticated(true)
      setOrders([])
      return null
    } catch {
      return 'Unable to connect to server'
    }
  }

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    } catch {
      // Keep client state consistent regardless of server response.
    }

    setUser(null)
    setIsAuthenticated(false)
    setCart([])
    setOrders([])
  }

  const handleAddToCart = (productId: string) => {
    setCart((prev) => [...prev, productId])
  }

  const handleAddProduct = async (payload: NewProductInput): Promise<string | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/shop/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...payload,
          price: Number(payload.price),
          rating: Number(payload.rating),
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        return data.message || 'Unable to add product'
      }

      await fetchProducts()
      return null
    } catch {
      return 'Unable to connect to server'
    }
  }

  const handleCheckout = async (): Promise<string | null> => {
    if (cart.length === 0) {
      return 'Cart is empty'
    }

    const quantityMap = cart.reduce<Record<string, number>>((acc, productId) => {
      acc[productId] = (acc[productId] || 0) + 1
      return acc
    }, {})

    const items = Object.entries(quantityMap).map(([productId, quantity]) => ({
      productId,
      quantity,
    }))

    try {
      const response = await fetch(`${API_BASE_URL}/shop/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ items }),
      })

      const data = await response.json()
      if (!response.ok) {
        return data.message || 'Checkout failed'
      }

      setCart([])
      await fetchOrders()
      return null
    } catch {
      return 'Unable to connect to server'
    }
  }

  if (isCheckingAuth) {
    return <div className="p-10 text-center text-slate-700">Loading...</div>
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <Login onLogin={handleLogin} /> : <Navigate to="/shop" />}
        />
        <Route
          path="/signup"
          element={!isAuthenticated ? <Signup onSignup={handleSignup} /> : <Navigate to="/shop" />}
        />
        <Route
          path="/shop"
          element={
            isAuthenticated ? (
              <Shop
                user={user}
                cart={cart}
                products={products}
                onAddToCart={handleAddToCart}
                onAddProduct={handleAddProduct}
                onCheckout={handleCheckout}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/profile"
          element={
            isAuthenticated ? (
              <Profile
                user={user}
                cart={cart}
                products={products}
                orders={orders}
                onLogout={handleLogout}
              />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? '/shop' : '/login'} />} />
      </Routes>
    </Router>
  )
}

export default App
