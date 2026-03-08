import { Lock, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

interface SignupProps {
  onSignup: (email: string, password: string) => Promise<string | null>
}

function Signup({ onSignup }: SignupProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setIsSubmitting(true)
    const signupError = await onSignup(email, password)
    setIsSubmitting(false)

    if (signupError) {
      setError(signupError)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-rose-50 to-amber-100 px-4 py-10">
      <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
        <p className="mt-2 text-sm text-slate-600">Sign up to start shopping and placing orders.</p>

        {error && <div className="mt-4 rounded-lg bg-red-100 px-3 py-2 text-sm text-red-700">{error}</div>}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-slate-700">Email</span>
            <div className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 focus-within:border-slate-900">
              <Mail size={18} className="text-slate-500" />
              <input
                type="email"
                className="w-full bg-transparent text-sm outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
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
                placeholder="At least 6 characters"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-5 text-sm text-slate-600">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-slate-900 underline">
            Login here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
