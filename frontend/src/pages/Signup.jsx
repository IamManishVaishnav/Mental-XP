import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signup as signupService } from '../services/authService'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (form.password.length < 6) { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    try {
      const res = await signupService(form)
      login(res.data.token, res.data.user)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold font-display">MX</span>
          </div>
          <h1 className="font-display font-bold text-3xl text-textPrimary dark:text-white">Create your account</h1>
          <p className="text-textSecondary mt-2">Start leveling up your mental wellness</p>
        </div>

        <div className="card">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-textPrimary dark:text-slate-200 mb-1.5">Full Name</label>
              <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="Alex Johnson" className="input" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-textPrimary dark:text-slate-200 mb-1.5">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="input" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-textPrimary dark:text-slate-200 mb-1.5">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" className="input" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full mt-2 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-textSecondary mt-6 text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}