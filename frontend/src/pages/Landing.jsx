import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Landing() {
  const navigate = useNavigate()
  const { token } = useAuth()

  return (
    <div className="min-h-screen bg-surface dark:bg-dark flex flex-col">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-white font-bold font-display text-sm">MX</span>
          </div>
          <span className="font-display font-bold text-xl text-textPrimary dark:text-white">Mental XP</span>
        </div>
        <div className="flex items-center gap-3">
          {token ? (
            <button onClick={() => navigate('/dashboard')} className="btn-primary">Go to Dashboard</button>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="btn-secondary">Log In</button>
              <button onClick={() => navigate('/signup')} className="btn-primary">Get Started</button>
            </>
          )}
        </div>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-8">
          <span>⚡</span> Gamified Mental Wellness
        </div>
        <h1 className="font-display font-bold text-6xl text-textPrimary dark:text-white leading-tight max-w-3xl mb-6">
          Level Up Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Mental Health</span>
        </h1>
        <p className="text-xl text-textSecondary dark:text-slate-400 max-w-xl mb-10">
          Track your mood, complete daily quests, earn XP, and build resilience — all in one modern wellness platform.
        </p>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/signup')} className="btn-primary text-lg px-8 py-4">
            Start Your Journey
          </button>
          <button onClick={() => navigate('/login')} className="btn-secondary text-lg px-8 py-4">
            Sign In
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6 mt-20 max-w-2xl w-full">
          {[
            { icon: '😊', label: 'Daily Mood Tracking', desc: 'Log how you feel and spot patterns' },
            { icon: '🎮', label: 'Mental Quests', desc: 'Breathing, gratitude, reframing' },
            { icon: '⚡', label: 'XP & Levels', desc: 'Earn rewards for consistency' },
          ].map((f) => (
            <div key={f.label} className="card text-center hover:scale-105 transition-transform duration-200">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-display font-semibold text-textPrimary dark:text-white text-sm mb-1">{f.label}</h3>
              <p className="text-xs text-textSecondary">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}