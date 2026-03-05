import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Shop.css'

interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
  description: string
  rating: number
}

interface ShopProps {
  user: { email: string } | null
  cart: number[]
  onAddToCart: (productId: number) => void
  onLogout: () => void
}

const PRODUCTS: Product[] = [
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

function Shop({ user, cart, onAddToCart, onLogout }: ShopProps) {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  const categories = ['All', ...Array.from(new Set(PRODUCTS.map(p => p.category)))]
  const filteredProducts = selectedCategory === 'All' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === selectedCategory)

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  const goToProfile = () => {
    navigate('/profile')
  }

  const cartTotal = cart.reduce((sum, productId) => {
    const product = PRODUCTS.find(p => p.id === productId)
    return sum + (product?.price || 0)
  }, 0)

  return (
    <div className="shop-container">
      <header className="shop-header">
        <div className="header-content">
          <h1 className="shop-title">ShopHub</h1>
          <div className="header-actions">
            <span className="user-email">Welcome, {user?.email}</span>
            <button className="profile-link" onClick={goToProfile}>My Profile</button>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      <div className="shop-content">
        <aside className="sidebar">
          <h2 className="sidebar-title">Categories</h2>
          <div className="category-list">
            {categories.map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="cart-section">
            <h3 className="cart-title">Cart</h3>
            <p className="cart-items">Items: {cart.length}</p>
            <p className="cart-total">Total: ${cartTotal.toFixed(2)}</p>
            {cart.length > 0 && (
              <button className="checkout-btn">Checkout</button>
            )}
          </div>
        </aside>

        <main className="products-section">
          <h2 className="products-title">{selectedCategory} Products</h2>
          <div className="products-grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="product-card">
                <div className="product-image-wrapper">
                  <img src={product.image} alt={product.name} className="product-image" />
                  <span className="product-badge">{product.category}</span>
                </div>
                
                <div className="product-content">
                  <h3 className="product-name">{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  
                  <div className="product-rating">
                    <span className="rating-stars">{'⭐'.repeat(Math.floor(product.rating))}</span>
                    <span className="rating-value">({product.rating})</span>
                  </div>
                  
                  <div className="product-footer">
                    <p className="product-price">${product.price.toFixed(2)}</p>
                    <button 
                      className="add-cart-btn"
                      onClick={() => onAddToCart(product.id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Shop
