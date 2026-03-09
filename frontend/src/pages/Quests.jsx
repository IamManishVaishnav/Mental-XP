import { useState, useEffect } from 'react'
import { getQuests, completeQuest } from '../services/questService'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'

const CATEGORIES = {
  breathing: { label: 'Breathing',       color: 'bg-forest-50 dark:bg-forest-900/20 border-forest-200 dark:border-forest-900/40',  dot: 'bg-forest-500',  badge: 'badge-forest', accent: 'text-forest-600 dark:text-forest-400' },
  gratitude:  { label: 'Gratitude',       color: 'bg-amber-50 dark:bg-amber-900/15 border-amber-200 dark:border-amber-900/30',      dot: 'bg-amber-500',   badge: 'badge-amber',  accent: 'text-amber-600 dark:text-amber-400' },
  reframe:    { label: 'Reframing',       color: 'bg-sage-50 dark:bg-sage-900/15 border-sage-200 dark:border-sage-900/30',          dot: 'bg-sage-500',    badge: 'badge-sage',   accent: 'text-sage-600 dark:text-sage-400' },
}

const DIFFICULTY = {
  easy:   { label: 'Easy',   cls: 'badge-forest' },
  medium: { label: 'Medium', cls: 'badge-amber' },
  hard:   { label: 'Hard',   cls: 'badge-red' },
}

export default function Quests() {
  const [quests, setQuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeQuest, setActiveQuest] = useState(null)
  const [completing, setCompleting] = useState(null)
  const [result, setResult] = useState(null)
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()

  const fetchQuests = async () => {
    try {
      const res = await getQuests()
      setQuests(res.data.quests)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load quests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchQuests() }, [])

  const handleComplete = async (quest) => {
    setCompleting(quest._id)
    setError('')
    try {
      const res = await completeQuest(quest._id)
      setActiveQuest(null)
      setResult({ ...res.data, questTitle: quest.title })
      await fetchQuests()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete quest')
    } finally {
      setCompleting(null)
    }
  }

  const filtered = filter === 'all' ? quests : quests.filter(q => q.category === filter)
  const completedCount = quests.filter(q => q.completedToday).length

  if (loading) return <LoadingSpinner />

  // ── Quest complete screen ───────────────────────────────────
  if (result) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="card max-w-sm w-full text-center space-y-5 animate-scale-in shadow-lifted">
        <div className="w-14 h-14 rounded-2xl bg-forest-500 flex items-center justify-center mx-auto">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h2 className="font-display font-semibold text-2xl text-[var(--ink)]">Quest Complete!</h2>
          <p className="text-ink-muted text-sm mt-0.5">{result.questTitle}</p>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'XP',     value: result.xp,         color: 'bg-forest-50 dark:bg-forest-900/20 text-forest-600 dark:text-forest-400' },
            { label: 'Level',  value: result.level,      color: 'bg-amber-50 dark:bg-amber-900/15 text-amber-600 dark:text-amber-400' },
            { label: 'Streak', value: `${result.streak}d`, color: 'bg-sage-50 dark:bg-sage-900/15 text-sage-600 dark:text-sage-400' },
          ].map(s => (
            <div key={s.label} className={`rounded-xl p-3 ${s.color.split(' ').slice(0, 2).join(' ')}`}>
              <p className="text-2xs text-ink-muted mb-0.5">{s.label}</p>
              <p className={`font-display font-semibold text-lg ${s.color.split(' ').slice(2).join(' ')}`}>{s.value}</p>
            </div>
          ))}
        </div>

        {result.leveledUp && (
          <div className="px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800/50">
            <p className="font-semibold text-amber-700 dark:text-amber-300 text-sm">🎉 Level Up!</p>
            <p className="text-xs text-ink-muted mt-0.5">You reached Level {result.level}. Check your Rewards tab!</p>
          </div>
        )}

        {result.newCoupons?.length > 0 && (
          <div className="px-4 py-3 rounded-xl bg-forest-50 dark:bg-forest-900/20 border border-forest-200 dark:border-forest-900/40 text-left">
            <p className="font-semibold text-forest-700 dark:text-forest-300 text-sm mb-1">
              🎁 {result.newCoupons.length} new reward{result.newCoupons.length > 1 ? 's' : ''} unlocked
            </p>
            {result.newCoupons.map((c, i) => (
              <p key={i} className="text-xs text-ink-muted">{c.discountPercent}% off — {c.partner}</p>
            ))}
          </div>
        )}

        <div className="flex gap-2">
          <button onClick={() => navigate('/dashboard')} className="btn-primary flex-1">Dashboard</button>
          <button onClick={() => setResult(null)} className="btn-secondary flex-1">More Quests</button>
        </div>
      </div>
    </div>
  )

  // ── Main quest list ─────────────────────────────────────────
  return (
    <div className="space-y-6 animate-fade-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-semibold text-3xl text-[var(--ink)]">Mental Quests</h1>
          <p className="text-ink-muted text-sm mt-1">Complete quests to earn XP, level up, and unlock rewards</p>
        </div>
        {completedCount > 0 && (
          <div className="badge badge-forest text-xs px-3 py-1">
            ✓ {completedCount} done today
          </div>
        )}
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'breathing', 'gratitude', 'reframe'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-150 ${
              filter === f
                ? 'bg-forest-500 text-white border-forest-500 shadow-sm'
                : 'bg-[var(--card-bg)] text-ink-muted border-[var(--card-border)] hover:border-forest-300 hover:text-forest-600'
            }`}
          >
            {f === 'all' ? 'All Quests' : CATEGORIES[f].label}
          </button>
        ))}
      </div>

      {/* Quest cards */}
      <div className="space-y-3 stagger">
        {filtered.map((quest) => {
          const cat = CATEGORIES[quest.category]
          const diff = DIFFICULTY[quest.difficulty]
          const isActive = activeQuest?._id === quest._id

          return (
            <div
              key={quest._id}
              className={`card border transition-all duration-200 ${
                quest.completedToday
                  ? 'opacity-55 border-[var(--card-border)]'
                  : isActive
                  ? `${cat.color} shadow-card`
                  : `border-[var(--card-border)] hover:shadow-card hover:-translate-y-0.5`
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Tags row */}
                  <div className="flex items-center gap-1.5 flex-wrap mb-2">
                    <span className={`badge ${cat.badge}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
                      {cat.label}
                    </span>
                    <span className={`badge ${diff.cls}`}>{diff.label}</span>
                    <span className="badge badge-gray">{quest.durationMinutes} min</span>
                    <span className="badge badge-amber">+{quest.xpReward} XP</span>
                  </div>
                  <h3 className="font-semibold text-[var(--ink)]">{quest.title}</h3>
                  <p className="text-sm text-ink-muted mt-0.5 leading-relaxed">{quest.description}</p>
                </div>

                <div className="flex-shrink-0 mt-1">
                  {quest.completedToday ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-forest-100 dark:bg-forest-900/30 rounded-full">
                      <svg className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-xs font-semibold text-forest-700 dark:text-forest-400">Done</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveQuest(isActive ? null : quest)}
                      className={isActive ? 'btn-secondary btn-sm' : 'btn-primary btn-sm'}
                    >
                      {isActive ? 'Close' : 'Start'}
                    </button>
                  )}
                </div>
              </div>

              {/* Expanded instructions */}
              {isActive && (
                <div className="mt-5 pt-5 border-t border-[var(--card-border)] space-y-4 animate-fade-in">
                  <h4 className="font-semibold text-[var(--ink)] text-sm">Instructions</h4>
                  <ol className="space-y-2.5">
                    {quest.instructions.map((step, i) => (
                      <li key={i} className="flex gap-3 text-sm text-ink-light leading-relaxed">
                        <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-2xs font-bold mt-0.5 ${cat.badge === 'badge-forest' ? 'bg-forest-100 text-forest-700 dark:bg-forest-900/30 dark:text-forest-400' : cat.badge === 'badge-amber' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-sage-100 text-sage-700 dark:bg-sage-900/30 dark:text-sage-400'}`}>
                          {i + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                  <div className="flex items-center justify-between pt-1">
                    <p className="text-xs text-ink-muted">Take your time. Each step matters.</p>
                    <button
                      onClick={() => handleComplete(quest)}
                      disabled={completing === quest._id}
                      className="btn-primary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {completing === quest._id ? (
                        <span className="flex items-center gap-1.5">
                          <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Completing…
                        </span>
                      ) : `Complete — +${quest.xpReward} XP`}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
