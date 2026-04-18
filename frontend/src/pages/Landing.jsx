import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";

const LeafIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-white">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
)
const CheckIcon = () => (
  <svg className="w-3.5 h-3.5 text-forest-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
  </svg>
)

const problems = [
  { emoji: '😶', title: 'Nobody talks about it', desc: "Employees struggle silently. There's no easy, low-pressure way to signal how they're really doing." },
  { emoji: '📋', title: 'Surveys don\'t work', desc: 'Annual wellness surveys are too infrequent, too long, and never lead to visible action.' },
  { emoji: '🔥', title: 'Burnout gets ignored', desc: 'Managers only notice when someone quits or breaks down — by then the damage is already done.' },
]

const steps = [
  { num: '01', icon: '📝', title: 'Log your mood', desc: 'Every day, employees rate how they feel from 1–10 and add an optional note. Takes under a minute.' },
  { num: '02', icon: '🧠', title: 'Complete a quest', desc: 'Pick a guided exercise — breathing, gratitude journaling, or cognitive reframing. Follow the steps at your own pace.' },
  { num: '03', icon: '⚡', title: 'Earn XP & level up', desc: 'Each completed quest adds XP. Level up to unlock real discount coupons from wellness partners.' },
  { num: '04', icon: '🎁', title: 'Get rewarded', desc: 'Streaks and milestones unlock coupons from Calm, Headspace, BetterHelp and more.' },
]

const employeeView = [
  'Daily mood check-in (1–10 scale)',
  'Browse and complete mental quests',
  'Track XP, level, and streak',
  'View and copy earned reward coupons',
  'Receive alerts from admin',
]
const adminView = [
  'See all employees and their mood trends',
  'Burnout risk flagged automatically',
  'Send personalised check-in alerts',
  'Add or deactivate employee accounts',
  'Export full team data as CSV',
]

const stack = [
  { name: 'React 19',      role: 'Frontend UI',        color: 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400' },
  { name: 'Vite',          role: 'Build tool',          color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' },
  { name: 'Tailwind CSS',  role: 'Styling',             color: 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400' },
  { name: 'Node.js',       role: 'Backend runtime',     color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' },
  { name: 'Express',       role: 'REST API',            color: 'bg-stone-100 dark:bg-stone-900/30 text-stone-700 dark:text-stone-400' },
  { name: 'MongoDB',       role: 'Database',            color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' },
  { name: 'Mongoose',      role: 'ODM',                 color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400' },
  { name: 'JWT',           role: 'Authentication',      color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' },
  { name: 'Chart.js',      role: 'Data visualisation',  color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400' },
  { name: 'Vercel',        role: 'Deployment',          color: 'bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400' },
]

export default function Landing() {
  const navigate = useNavigate()
  const { token } = useAuth()

  return (
    <div className="min-h-screen bg-[var(--cream)] font-body">

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 bg-[var(--cream)]/90 backdrop-blur-md border-b border-[var(--card-border)]">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-forest-500 flex items-center justify-center"><LeafIcon /></div>
            <span className="font-display font-semibold text-lg text-[var(--ink)] tracking-tight">
              Mental<span className="text-forest-500">XP</span>
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-ink-muted">
            <a href="#problem"    className="hover:text-[var(--ink)] transition-colors">Problem</a>
            <a href="#how"        className="hover:text-[var(--ink)] transition-colors">How it works</a>
            <a href="#roles"      className="hover:text-[var(--ink)] transition-colors">Features</a>
            <a href="#stack"      className="hover:text-[var(--ink)] transition-colors">Stack</a>
          </nav>
          <div className="flex items-center gap-2">
            {token ? (
              <button onClick={() => navigate('/dashboard')} className="btn-primary btn-sm">Dashboard →</button>
            ) : (
              <>
                <button onClick={() => navigate('/login')}  className="btn-ghost text-sm">Sign in</button>
                <button onClick={() => navigate('/signup')} className="btn-primary btn-sm">Try it out</button>
              </>
            )}
          </div>
        </div>
      </header>

{/* ── Hero ── */}
<section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
  <div className="flex items-center gap-16">

    {/* Left floating image */}
    <div className="hidden lg:block flex-shrink-0 w-64 h-80 rounded-3xl overflow-hidden shadow-lifted float-l ml-[-40px]">
      <img src={image1} alt="" className="w-full h-full object-cover" />
    </div>

    {/* Center text */}
    <div className="flex-1 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-50 dark:bg-forest-900/25 border border-forest-200 dark:border-forest-900/40 text-forest-600 dark:text-forest-400 text-xs font-semibold mb-7 animate-fade-up">
        <span className="w-1.5 h-1.5 rounded-full bg-forest-500 animate-pulse-soft" />
        Final Year Project · Full Stack Web App
      </div>
      <h1 className="font-display font-semibold text-5xl md:text-6xl text-[var(--ink)] leading-[1.08] mb-5 animate-fade-up delay-75">
        Mental wellness<br />
        <span className="text-forest-500">made into a habit</span>
      </h1>
      <p className="text-lg text-ink-light max-w-lg mx-auto mb-8 leading-relaxed animate-fade-up delay-150">
        MentalXP is a gamified wellness platform that helps employees track their
        mood daily, complete guided mental exercises, and earn real rewards for
        showing up for themselves.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 animate-fade-up delay-200">
        <button onClick={() => navigate('/signup')} className="btn-primary btn-lg">Try it yourself</button>
        <button onClick={() => navigate('/login')}  className="btn-secondary btn-lg">Sign in</button>
      </div>
    </div>

    {/* Right floating image */}


<div className="hidden lg:block flex-shrink-0 w-64 h-80 rounded-3xl overflow-hidden shadow-lifted float-r mr-[-40px]">
  <img src={image2} alt="illustration" className="w-full h-full object-cover" />
</div>

  </div>
</section>

      {/* ── Problem ── */}
      <section id="problem" className="bg-[#1C1C1C] py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-2xs font-bold uppercase tracking-widest text-stone-500 mb-2">The problem</p>
            <h2 className="font-display font-semibold text-3xl text-white">
              Mental health at work is broken
            </h2>
            <p className="text-stone-400 mt-3 max-w-lg mx-auto text-sm leading-relaxed">
              Most organisations either ignore employee mental health entirely,
              or treat it with tools that nobody actually uses.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {problems.map(p => (
              <div key={p.title} className="bg-white/5 border border-white/8 rounded-2xl p-6">
                <span className="text-3xl block mb-4">{p.emoji}</span>
                <h3 className="font-semibold text-white mb-2 text-sm">{p.title}</h3>
                <p className="text-stone-400 text-xs leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What it does ── */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <p className="section-label mb-2">What it does</p>
        <h2 className="font-display font-semibold text-3xl text-[var(--ink)] mb-4">
          Three things, done well
        </h2>
        <p className="text-ink-muted text-sm max-w-md mx-auto mb-10">
          MentalXP is intentionally focused. It does three things and does them right.
        </p>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: '📊', title: 'Track mood daily',      desc: 'A simple 1–10 score each day. Over time, patterns emerge — for both the employee and their manager.',         color: 'bg-forest-50 dark:bg-forest-900/20 border-forest-200 dark:border-forest-900/40' },
            { icon: '🧠', title: 'Complete mental quests', desc: 'Guided exercises in breathing, gratitude, and cognitive reframing — rooted in actual psychology research.',    color: 'bg-amber-50 dark:bg-amber-900/15 border-amber-200 dark:border-amber-900/30' },
            { icon: '🏆', title: 'Earn XP and rewards',   desc: 'Consistency is rewarded with XP, level-ups, and real discount coupons from wellness brands.',                 color: 'bg-sage-50 dark:bg-sage-900/15 border-sage-200 dark:border-sage-900/30' },
          ].map(f => (
            <div key={f.title} className={`card border text-left hover:shadow-lifted hover:-translate-y-0.5 transition-all duration-200 ${f.color}`}>
              <span className="text-3xl block mb-4">{f.icon}</span>
              <h3 className="font-semibold text-[var(--ink)] mb-2 text-sm">{f.title}</h3>
              <p className="text-xs text-ink-muted leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="bg-cream-warm dark:bg-[var(--cream-warm)] py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="section-label mb-2">How it works</p>
            <h2 className="font-display font-semibold text-3xl text-[var(--ink)]">The user journey</h2>
            <p className="text-ink-muted text-sm mt-3 max-w-sm mx-auto">
              From sign-up to rewards — here's what using MentalXP actually looks like.
            </p>
          </div>
          <div className="space-y-4 max-w-2xl mx-auto">
            {steps.map((step, i) => (
              <div key={step.num} className="flex items-start gap-5 card hover:shadow-lifted transition-all duration-200">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-11 h-11 rounded-xl bg-forest-500 flex items-center justify-center text-xl shadow-sm">
                    {step.icon}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="w-px h-4 bg-forest-200 dark:bg-forest-900/40 mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xs font-bold text-forest-500 tracking-widest">{step.num}</span>
                    <h3 className="font-semibold text-[var(--ink)] text-sm">{step.title}</h3>
                  </div>
                  <p className="text-xs text-ink-muted leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Employee vs Admin ── */}
      <section id="roles" className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <p className="section-label mb-2">Two roles, one platform</p>
          <h2 className="font-display font-semibold text-3xl text-[var(--ink)]">
            Built for employees <em className="not-italic text-forest-500">&</em> managers
          </h2>
          <p className="text-ink-muted text-sm mt-3 max-w-md mx-auto">
            The same app serves two different experiences depending on your role.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {/* Employee */}
          <div className="card border-forest-200 dark:border-forest-900/40">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-forest-100 dark:bg-forest-900/30 flex items-center justify-center text-xl">🙋</div>
              <div>
                <h3 className="font-semibold text-[var(--ink)]">Employee</h3>
                <p className="text-xs text-ink-muted">Focus on their own wellness</p>
              </div>
            </div>
            <ul className="space-y-2.5">
              {employeeView.map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-ink-light">
                  <CheckIcon />{item}
                </li>
              ))}
            </ul>
          </div>
          {/* Admin */}
          <div className="card border-amber-200 dark:border-amber-900/30">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-xl">👩‍💼</div>
              <div>
                <h3 className="font-semibold text-[var(--ink)]">Admin / HR Manager</h3>
                <p className="text-xs text-ink-muted">Oversee the whole team</p>
              </div>
            </div>
            <ul className="space-y-2.5">
              {adminView.map(item => (
                <li key={item} className="flex items-start gap-2 text-sm text-ink-light">
                  <CheckIcon />{item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section id="stack" className="bg-cream-warm dark:bg-[var(--cream-warm)] py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="section-label mb-2">Tech stack</p>
            <h2 className="font-display font-semibold text-3xl text-[var(--ink)]">Built with</h2>
            <p className="text-ink-muted text-sm mt-3 max-w-sm mx-auto">
              A modern full-stack JavaScript application — frontend, backend, and database.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {stack.map(s => (
              <div key={s.name} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] shadow-soft`}>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-lg ${s.color}`}>{s.name}</span>
                <span className="text-xs text-ink-muted">{s.role}</span>
              </div>
            ))}
          </div>

          {/* Architecture note */}
          <div className="mt-8 max-w-2xl mx-auto card text-center border-[var(--card-border)]">
            <p className="text-xs text-ink-muted leading-relaxed">
              <span className="font-semibold text-[var(--ink)]">Architecture:</span> React SPA on Vercel → REST API (Express on Node.js) → MongoDB Atlas.
              JWT-based auth with role middleware. Mongoose ODM for schema validation.
              Seed data auto-runs on first deploy.
            </p>
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-forest-500 py-16">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h2 className="font-display font-semibold text-4xl text-white mb-4">
            Give it a try
          </h2>
          <p className="text-forest-100 mb-8 leading-relaxed">
            Sign up, complete a quest, and see the full experience — including the admin dashboard.
            Everything is seeded and ready to go.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button onClick={() => navigate('/signup')} className="btn bg-white text-forest-700 hover:bg-forest-50 px-8 py-4 text-base font-semibold rounded-full shadow-lg transition-all duration-200">
              Create an account
            </button>
            <button onClick={() => navigate('/login')} className="btn border border-forest-300 text-white hover:bg-forest-600 px-8 py-4 text-base rounded-full transition-all duration-200">
              Sign in
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-[var(--card-border)] py-5 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-forest-500 flex items-center justify-center"><LeafIcon /></div>
            <span className="font-display text-sm font-semibold text-[var(--ink)]">Mental<span className="text-forest-500">XP</span></span>
          </div>
          <p className="text-xs text-ink-muted">Final Year Project · Full Stack · React + Node + MongoDB</p>
          <a href="https://mentalxp.vercel.app" className="text-xs text-ink-muted hover:text-forest-500 transition-colors">
            mentalxp.vercel.app
          </a>
        </div>
      </footer>
    </div>
  )
}
