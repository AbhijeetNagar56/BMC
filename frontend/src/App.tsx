import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Shop from './pages/Shop'
import Profile from './pages/Profile'

const PRODUCTS = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    category: 'Electronics',
    description: 'Premium wireless headphones with noise cancellation',
    rating: 4.5
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    category: 'Electronics',
    description: 'Advanced smartwatch with fitness tracking',
    rating: 4.7
  },
  {
    id: 3,
    name: 'Laptop Backpack',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop',
    category: 'Accessories',
    description: 'Durable backpack perfect for laptops',
    rating: 4.3
  },
  {
    id: 4,
    name: 'USB-C Hub',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=400&h=300&fit=crop',
    category: 'Electronics',
    description: 'Multi-port USB-C hub for connectivity',
    rating: 4.4
  },
  {
    id: 5,
    name: 'Mechanical Keyboard',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1587829191301-e33b1c7f47c1?w=400&h=300&fit=crop',
    category: 'Electronics',
    description: 'RGB mechanical keyboard with custom switches',
    rating: 4.8
  },
  {
    id: 6,
    name: 'Wireless Mouse',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=300&fit=crop',
    category: 'Electronics',
    description: 'Ergonomic wireless mouse with precision tracking',
    rating: 4.2
  },
  {
    id: 7,
    name: '4K Monitor',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
    category: 'Electronics',
    description: 'Stunning 4K display monitor for professionals',
    rating: 4.6
  },
  {
    id: 8,
    name: 'Webcam HD',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=300&fit=crop',
    category: 'Electronics',
    description: 'Crystal clear HD webcam for video calls',
    rating: 4.1
  }
]

function App() {
  const API_BASE_URL = 'http://localhost:3000/api'
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ email: string } | null>(null)
  const [cart, setCart] = useState<number[]>([])
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          method: 'GET',
          credentials: 'include'
        })

        if (!response.ok) {
          setUser(null)
          setIsAuthenticated(false)
          return
        }

        const data = await response.json()
        setUser(data.user)
        setIsAuthenticated(true)
      } catch {
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogin = async (email: string, password: string): Promise<string | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()
      if (!response.ok) {
        return data.message || 'Login failed'
      }

      setUser(data.user)
      setIsAuthenticated(true)
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
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()
      if (!response.ok) {
        return data.message || 'Signup failed'
      }

      setUser(data.user)
      setIsAuthenticated(true)
      return null
    } catch {
      return 'Unable to connect to server'
    }
  }

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      })
    } catch {
      // Ensure client state is cleared even if logout request fails.
    }
    setUser(null)
    setIsAuthenticated(false)
    setCart([])
  }

  const handleAddToCart = (productId: number) => {
    setCart([...cart, productId])
  }

  if (isCheckingAuth) {
    return <div>Loading...</div>
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
          element={isAuthenticated ? <Shop user={user} cart={cart} onAddToCart={handleAddToCart} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/profile" 
          element={isAuthenticated ? <Profile user={user} cart={cart} products={PRODUCTS} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/shop" : "/login"} />} />
      </Routes>
    </Router>
  )
}

export default App
