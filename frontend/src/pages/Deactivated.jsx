import { useNavigate } from 'react-router-dom'

export default function Deactivated() {
  const navigate = useNavigate()
  return (
    <div className="min-h-screen bg-[var(--cream)] flex items-center justify-center px-4">
      <div className="card max-w-sm w-full text-center space-y-4 shadow-lifted animate-scale-in">
        <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto">
          <span className="text-2xl">🔒</span>
        </div>
        <div>
          <h2 className="font-display font-semibold text-2xl text-[var(--ink)]">Account Paused</h2>
          <p className="text-ink-muted text-sm mt-1.5 leading-relaxed">
            Your account has been temporarily deactivated. Please reach out to your admin if you think this is a mistake.
          </p>
        </div>
        <button onClick={() => { localStorage.clear(); navigate('/login') }} className="btn-secondary w-full">
          Back to sign in
        </button>
      </div>
    </div>
  )
}
