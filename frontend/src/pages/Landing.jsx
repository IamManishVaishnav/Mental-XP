import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const features = [
  {
    icon: '📈',
    label: 'Daily Mood Tracking',
    desc: 'Log how you feel each day. Spot patterns, catch burnout early, and see your progress over time.',
    color: 'bg-forest-50 dark:bg-forest-900/20 border-forest-100 dark:border-forest-900/40',
    iconBg: 'bg-forest-100 dark:bg-forest-900/40',
  },
  {
    icon: '⭐',
    label: 'Mental Quests',
    desc: 'Guided breathing, gratitude journaling, and cognitive reframing — science-backed exercises that actually work.',
    color: 'bg-amber-50 dark:bg-amber-900/15 border-amber-100 dark:border-amber-900/30',
    iconBg: 'bg-amber-100 dark:bg-amber-900/40',
  },
  {
    icon: '🏆',
    label: 'XP & Rewards',
    desc: 'Earn XP, level up, and unlock real discount coupons from top wellness partners for your consistency.',
    color: 'bg-sage-50 dark:bg-sage-900/15 border-sage-100 dark:border-sage-900/30',
    iconBg: 'bg-sage-100 dark:bg-sage-900/40',
  },
]

const LeafIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
)

export default function Landing() {
  const navigate = useNavigate()
  const { token } = useAuth()

  return (
    <div className="min-h-screen bg-[var(--cream)]">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-forest-500 flex items-center justify-center shadow-sm">
            <LeafIcon />
          </div>
          <span className="font-display font-semibold text-xl text-[var(--ink)] tracking-tight">
            Mental<span className="text-forest-500">XP</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          {token ? (
            <button onClick={() => navigate('/dashboard')} className="btn-primary btn-sm">
              Go to Dashboard →
            </button>
          ) : (
            <>
              <button onClick={() => navigate('/login')} className="btn-ghost">Sign in</button>
              <button onClick={() => navigate('/signup')} className="btn-primary btn-sm">Get started</button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-8 pt-16 pb-20 text-center">

        {/* Eyebrow badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-forest-50 dark:bg-forest-900/25 border border-forest-200 dark:border-forest-900/40 text-forest-600 dark:text-forest-400 text-xs font-semibold mb-8 animate-fade-up">
          <span className="w-1.5 h-1.5 rounded-full bg-forest-500 animate-pulse-soft" />
          Gamified Mental Wellness for Teams
        </div>

        <h1 className="font-display font-semibold text-5xl md:text-6xl text-[var(--ink)] leading-[1.1] max-w-3xl mx-auto mb-6 animate-fade-up delay-75">
          Build the habit of<br />
          <em className="not-italic text-forest-500">feeling better</em>, every day
        </h1>

        <p className="text-lg text-ink-light max-w-xl mx-auto mb-10 leading-relaxed animate-fade-up delay-150">
          Track your mood, complete daily mental wellness quests, earn XP,
          and unlock real rewards — all in one warm, focused platform.
        </p>

        <div className="flex items-center justify-center gap-3 animate-fade-up delay-200">
          <button
            onClick={() => navigate('/signup')}
            className="btn-primary btn-lg"
          >
            Start your journey
          </button>
          <button
            onClick={() => navigate('/login')}
            className="btn-secondary btn-lg"
          >
            Sign in
          </button>
        </div>

        {/* Soft divider */}
        <div className="flex items-center gap-3 justify-center mt-14 mb-12 animate-fade-up delay-300">
          <div className="h-px flex-1 max-w-[120px] bg-ink-faint" />
          <span className="text-xs text-ink-muted font-medium">What you get</span>
          <div className="h-px flex-1 max-w-[120px] bg-ink-faint" />
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto stagger">
          {features.map((f) => (
            <div
              key={f.label}
              className={`rounded-2xl border p-6 text-left hover:-translate-y-1 hover:shadow-card transition-all duration-200 ${f.color}`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4 ${f.iconBg}`}>
                {f.icon}
              </div>
              <h3 className="font-semibold text-[var(--ink)] text-sm mb-2">{f.label}</h3>
              <p className="text-xs text-ink-light leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer strip */}
      <footer className="border-t border-[var(--card-border)] py-6 px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <p className="text-xs text-ink-muted">
            © {new Date().getFullYear()} MentalXP — Built for human flourishing
          </p>
          <p className="text-xs text-ink-muted">
            <a href="https://mentalxp.vercel.app" className="hover:text-forest-500 transition-colors">mentalxp.vercel.app</a>
          </p>
        </div>
      </footer>
    </div>
  )
}
