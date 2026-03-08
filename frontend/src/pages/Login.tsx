import { Lock, ShieldCheck, User } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

interface LoginProps {
  onLogin: (identifier: string, password: string) => Promise<string | null>
}

function Login({ onLogin }: LoginProps) {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!identifier || !password) {
      setError('Please fill in all fields')
      return
    }

    setIsSubmitting(true)
    const loginError = await onLogin(identifier, password)
    setIsSubmitting(false)

    if (loginError) {
      setError(loginError)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-amber-50 to-orange-100 px-4 py-10">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-slate-900">Login</h1>
        <p className="mt-2 text-sm text-slate-600">Use email or username to continue.</p>

        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          <div className="flex items-center gap-2 font-semibold"><ShieldCheck size={14} /> Admin Login</div>
          <p className="mt-1">username: <span className="font-semibold">admin123</span> | password: <span className="font-semibold">admin123</span></p>
        </div>

        {error && <div className="mt-4 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Email or Username</span>
            <div className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 focus-within:border-slate-900">
              <User size={18} className="text-slate-500" />
              <input
                className="w-full bg-transparent text-sm outline-none"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="your@email.com or username"
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Password</span>
            <div className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 focus-within:border-slate-900">
              <Lock size={18} className="text-slate-500" />
              <input
                type="password"
                className="w-full bg-transparent text-sm outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-600">
          New here?{' '}
          <Link to="/signup" className="font-semibold text-slate-900 underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
