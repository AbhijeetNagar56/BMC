import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Profile.css'

interface OrderItem {
  id: number
  productId: number
  productName: string
  price: number
  quantity: number
  date: string
}

interface ProfileProps {
  user: { email: string } | null
  cart: number[]
  products: any[]
  onLogout: () => void
}

function Profile({ user, cart, products, onLogout }: ProfileProps) {
  const navigate = useNavigate()
  const [orders] = useState<OrderItem[]>([
    {
      id: 1,
      productId: 5,
      productName: 'Mechanical Keyboard',
      price: 129.99,
      quantity: 1,
      date: '2025-02-20'
    },
    {
      id: 2,
      productId: 2,
      productName: 'Smart Watch',
      price: 199.99,
      quantity: 1,
      date: '2025-02-15'
    },
    {
      id: 3,
      productId: 1,
      productName: 'Wireless Headphones',
      price: 89.99,
      quantity: 2,
      date: '2025-02-10'
    }
  ])

  const currentCartTotal = cart.reduce((sum, productId) => {
    const product = products.find(p => p.id === productId)
    return sum + (product?.price || 0)
  }, 0)

  const totalBilled = orders.reduce((sum, order) => {
    return sum + (order.price * order.quantity)
  }, 0)

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  const goBackToShop = () => {
    navigate('/shop')
  }

  return (
    <div className="profile-container">
      <header className="profile-header">
        <div className="profile-header-content">
          <button className="back-btn" onClick={goBackToShop}>← Back to Shop</button>
          <h1 className="profile-title">My Profile</h1>
          <button className="profile-logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="profile-content">
        <div className="profile-main">
          {/* User Info Card */}
          <div className="user-card">
            <div className="user-avatar">
              <span className="avatar-icon">👤</span>
            </div>
            <div className="user-info">
              <h2 className="user-email">{user?.email}</h2>
              <p className="user-status">Premium Member</p>
            </div>
          </div>

          {/* Billing Summary */}
          <div className="billing-section">
            <h2 className="section-title">Billing Summary</h2>
            <div className="billing-grid">
              <div className="billing-card">
                <div className="billing-label">Total Spent</div>
                <div className="billing-amount">${totalBilled.toFixed(2)}</div>
                <div className="billing-subtext">{orders.length} orders completed</div>
              </div>
              <div className="billing-card">
                <div className="billing-label">Current Cart</div>
                <div className="billing-amount">${currentCartTotal.toFixed(2)}</div>
                <div className="billing-subtext">{cart.length} items in cart</div>
              </div>
              <div className="billing-card">
                <div className="billing-label">Average Order</div>
                <div className="billing-amount">
                  ${orders.length > 0 ? (totalBilled / orders.length).toFixed(2) : '0.00'}
                </div>
                <div className="billing-subtext">Per transaction</div>
              </div>
            </div>
          </div>

          {/* Order History */}
          <div className="orders-section">
            <h2 className="section-title">Order History</h2>
            {orders.length > 0 ? (
              <div className="orders-list">
                {orders.map((order) => (
                  <div key={order.id} className="order-item">
                    <div className="order-header">
                      <div className="order-product">
                        <h3 className="order-product-name">{order.productName}</h3>
                        <p className="order-date">{new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <div className="order-details">
                        <div className="order-qty">
                          <span className="qty-label">Qty:</span>
                          <span className="qty-value">{order.quantity}</span>
                        </div>
                        <div className="order-price">
                          <span className="price-label">Price:</span>
                          <span className="price-value">${(order.price * order.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="order-status">
                      <span className="status-badge delivered">✓ Delivered</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-orders">
                <p>No orders yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Stats */}
        <aside className="profile-sidebar">
          <div className="stats-card">
            <h3 className="stats-title">Your Stats</h3>
            <div className="stat-item">
              <span className="stat-label">Total Orders</span>
              <span className="stat-value">{orders.length}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Items Purchased</span>
              <span className="stat-value">
                {orders.reduce((sum, order) => sum + order.quantity, 0)}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Total Spent</span>
              <span className="stat-value">${totalBilled.toFixed(2)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Cart Items</span>
              <span className="stat-value">{cart.length}</span>
            </div>
          </div>

          <button className="checkout-profile-btn" onClick={goBackToShop}>
            Continue Shopping
          </button>
        </aside>
      </div>
    </div>
  )
}

export default Profile
