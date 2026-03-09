import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signup as signupService } from '../services/authService'
import { useAuth } from '../context/AuthContext'

const LeafIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
)

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
    <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center px-4">

      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-forest-100 dark:bg-forest-900/20 blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-amber-100 dark:bg-amber-900/10 blur-3xl" />
      </div>

      <div className="w-full max-w-sm relative animate-fade-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-5">
            <div className="w-10 h-10 rounded-xl bg-forest-500 flex items-center justify-center shadow-md">
              <LeafIcon />
            </div>
            <span className="font-display font-semibold text-xl text-[var(--ink)]">
              Mental<span className="text-forest-500">XP</span>
            </span>
          </div>
          <h1 className="font-display text-3xl font-semibold text-[var(--ink)]">Create your account</h1>
          <p className="text-ink-muted text-sm mt-1.5">Start building your wellness streak today</p>
        </div>

        <div className="card shadow-lifted">
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-ink-light mb-1.5 uppercase tracking-wide">Full Name</label>
              <input name="name" type="text" value={form.name} onChange={handleChange} placeholder="Alex Johnson" className="input" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-light mb-1.5 uppercase tracking-wide">Email</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" className="input" required />
            </div>
            <div>
              <label className="block text-xs font-semibold text-ink-light mb-1.5 uppercase tracking-wide">Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Min. 6 characters" className="input" required />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : 'Create account'}
            </button>
          </form>
        </div>

        <p className="text-center text-ink-muted text-sm mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-forest-600 dark:text-forest-400 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
