import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Shop from './pages/Shop'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<{ email: string } | null>(null)

  const handleLogin = (email: string) => {
    setUser({ email })
    setIsAuthenticated(true)
  }

  const handleSignup = (email: string) => {
    setUser({ email })
    setIsAuthenticated(true)
  }

  const handleLogout = () => {
    setUser(null)
    setIsAuthenticated(false)
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
          element={isAuthenticated ? <Shop user={user} onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route path="/" element={<Navigate to={isAuthenticated ? "/shop" : "/login"} />} />
      </Routes>
    </Router>
  )
}

export default App
