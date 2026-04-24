// Quests.jsx — complete rewrite with interactive quest components
import { useState, useEffect } from 'react'
import { getQuests, completeQuest } from '../services/questService'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import QuestShell from '../components/quests/QuestShell'
import BreathingTimer from '../components/quests/Breathingtimer'
import JournalEntry from '../components/quests/Journalentry'
import CBTForm from '../components/quests/Cbtform'
import GroundingChecklist from '../components/quests/Groundingchecklist'

// ── Design tokens per category ──────────────────────────────────────────────
const CATEGORIES = {
  breathing: {
    label: 'Breathing',
    color: 'bg-forest-50 dark:bg-forest-900/20 border-forest-200 dark:border-forest-900/40',
    dot: 'bg-forest-500',
    badge: 'badge-forest',
    accent: 'text-forest-600 dark:text-forest-400',
    icon: '🌬️',
  },
  gratitude: {
    label: 'Gratitude',
    color: 'bg-amber-50 dark:bg-amber-900/15 border-amber-200 dark:border-amber-900/30',
    dot: 'bg-amber-500',
    badge: 'badge-amber',
    accent: 'text-amber-600 dark:text-amber-400',
    icon: '🙏',
  },
  reframe: {
    label: 'Reframing',
    color: 'bg-sage-50 dark:bg-sage-900/15 border-sage-200 dark:border-sage-900/30',
    dot: 'bg-sage-500',
    badge: 'badge-sage',
    accent: 'text-sage-600 dark:text-sage-400',
    icon: '🔄',
  },
  grounding: {
    label: 'Grounding',
    color: 'bg-blue-50 dark:bg-blue-900/15 border-blue-200 dark:border-blue-900/30',
    dot: 'bg-blue-400',
    badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    accent: 'text-blue-600 dark:text-blue-400',
    icon: '⚓',
  },
  journal: {
    label: 'Journal',
    color: 'bg-purple-50 dark:bg-purple-900/15 border-purple-200 dark:border-purple-900/30',
    dot: 'bg-purple-400',
    badge: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    accent: 'text-purple-600 dark:text-purple-400',
    icon: '📓',
  },
}

const DIFFICULTY = {
  easy:   { label: 'Easy',   cls: 'badge-forest' },
  medium: { label: 'Medium', cls: 'badge-amber'  },
  hard:   { label: 'Hard',   cls: 'badge-red'    },
}

const ALL_FILTERS = ['all', 'breathing', 'gratitude', 'reframe', 'grounding', 'journal']

// ── Component router: returns the right interactive component ────────────────
function QuestComponent({ quest, onComplete }) {
  const { componentType, componentConfig, xpReward } = quest

  // Pass xpReward into BreathingTimer so it can show "+XP" on its done screen
  if (componentType === 'breathing_timer') {
    return (
      <BreathingTimer
        config={componentConfig}
        onComplete={onComplete}
        xpReward={xpReward}
      />
    )
  }
  if (componentType === 'journal_entry') {
    return <JournalEntry config={componentConfig} onComplete={onComplete} />
  }
  if (componentType === 'cbt_form') {
    return <CBTForm config={componentConfig} onComplete={onComplete} />
  }
  if (componentType === 'grounding_checklist') {
    return <GroundingChecklist config={componentConfig} onComplete={onComplete} />
  }

  // 'static' fallback — original read-and-click behaviour
  return <StaticQuestContent quest={quest} onComplete={onComplete} />
}

// Static fallback for any quest without an interactive component
function StaticQuestContent({ quest, onComplete }) {
  const [completing, setCompleting] = useState(false)
  const handleDone = async () => {
    setCompleting(true)
    await onComplete({})
    setCompleting(false)
  }
  return (
    <div className="space-y-4">
      <ol className="space-y-2.5">
        {quest.instructions.map((step, i) => (
          <li key={i} className="flex gap-3 text-sm text-ink-light leading-relaxed">
            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-forest-100 dark:bg-forest-900/30 text-forest-700 dark:text-forest-400 flex items-center justify-center text-2xs font-bold mt-0.5">
              {i + 1}
            </span>
            {step}
          </li>
        ))}
      </ol>
      <div className="flex items-center justify-between pt-2">
        <p className="text-xs text-ink-muted">Take your time with each step.</p>
        <button
          onClick={handleDone}
          disabled={completing}
          className="btn-primary btn-sm disabled:opacity-50"
        >
          {completing ? 'Completing…' : `Complete — +${quest.xpReward} XP`}
        </button>
      </div>
    </div>
  )
}

// ── Main Quests page ─────────────────────────────────────────────────────────
export default function Quests() {
  const [quests, setQuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeQuestId, setActiveQuestId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
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

  // Called by interactive components when user finishes the activity
  const handleQuestComplete = async (completionData) => {
    const quest = quests.find(q => q._id === activeQuestId)
    if (!quest) return
    setSubmitting(true)
    setError('')
    try {
      const res = await completeQuest(quest._id, completionData)
      setActiveQuestId(null)
      setResult({ ...res.data, questTitle: quest.title, questCategory: quest.category })
      await fetchQuests()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete quest')
    } finally {
      setSubmitting(false)
    }
  }

  const handleStartQuest = (questId) => {
    setError('')
    setActiveQuestId(prev => (prev === questId ? null : questId))
    // Scroll to quest card
    setTimeout(() => {
      document.getElementById(`quest-${questId}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  const filtered = filter === 'all' ? quests : quests.filter(q => q.category === filter)
  const completedCount = quests.filter(q => q.completedToday).length
  const totalQuests = quests.length

  if (loading) return <LoadingSpinner />

  // ── Quest complete celebration screen ────────────────────────────────────
  if (result) {
    const cat = CATEGORIES[result.questCategory] || CATEGORIES.gratitude
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="card max-w-sm w-full text-center space-y-5 animate-scale-in shadow-lifted">
          {/* Icon */}
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto text-3xl ${
            cat.color.split(' ').slice(0, 2).join(' ')
          }`}>
            {cat.icon}
          </div>

          <div>
            <h2 className="font-display font-semibold text-2xl text-[var(--ink)]">Quest Complete!</h2>
            <p className="text-ink-muted text-sm mt-1">{result.questTitle}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'XP',     value: result.xp,            bgCls: 'bg-forest-50 dark:bg-forest-900/20', textCls: 'text-forest-600 dark:text-forest-400' },
              { label: 'Level',  value: result.level,          bgCls: 'bg-amber-50 dark:bg-amber-900/15',   textCls: 'text-amber-600 dark:text-amber-400'   },
              { label: 'Streak', value: `${result.streak}d`,   bgCls: 'bg-sage-50 dark:bg-sage-900/15',     textCls: 'text-sage-600 dark:text-sage-400'     },
            ].map(s => (
              <div key={s.label} className={`rounded-xl p-3 ${s.bgCls}`}>
                <p className="text-2xs text-ink-muted mb-0.5">{s.label}</p>
                <p className={`font-display font-semibold text-lg ${s.textCls}`}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Category streak */}
          {result.categoryStreak > 1 && (
            <div className={`px-4 py-3 rounded-xl border ${cat.color}`}>
              <p className={`text-sm font-semibold ${cat.accent}`}>
                {cat.icon} {result.categoryStreak}-day {cat.label} streak!
              </p>
            </div>
          )}

          {/* Level up */}
          {result.leveledUp && (
            <div className="px-4 py-3 rounded-xl bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800/50">
              <p className="font-semibold text-amber-700 dark:text-amber-300 text-sm">🎉 Level Up!</p>
              <p className="text-xs text-ink-muted mt-0.5">You reached Level {result.level}. Check your Rewards tab!</p>
            </div>
          )}

          {/* New coupons */}
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
  }

  // ── Main list ────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-fade-up">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-semibold text-3xl text-[var(--ink)]">Mental Quests</h1>
          <p className="text-ink-muted text-sm mt-1">
            Complete quests to earn XP, level up, and unlock rewards
          </p>
        </div>
        {completedCount > 0 && (
          <div className="flex flex-col items-end gap-1">
            <span className="badge badge-forest text-xs px-3 py-1">
              ✓ {completedCount}/{totalQuests} today
            </span>
            {/* Mini progress bar */}
            <div className="w-24 h-1 bg-ink-faint rounded-full overflow-hidden">
              <div
                className="h-full bg-forest-500 rounded-full transition-all duration-700"
                style={{ width: `${(completedCount / totalQuests) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Category filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {ALL_FILTERS.map(f => {
          const cat = f !== 'all' ? CATEGORIES[f] : null
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-150 ${
                filter === f
                  ? 'bg-forest-500 text-white border-forest-500 shadow-sm'
                  : 'bg-[var(--card-bg)] text-ink-muted border-[var(--card-border)] hover:border-forest-300 hover:text-forest-600'
              }`}
            >
              {cat && <span>{cat.icon}</span>}
              {f === 'all' ? 'All Quests' : cat.label}
            </button>
          )
        })}
      </div>

      {/* Quest count */}
      <p className="text-xs text-ink-muted -mt-2">
        {filtered.length} quest{filtered.length !== 1 ? 's' : ''} {filter !== 'all' ? `in ${CATEGORIES[filter]?.label}` : 'available'}
      </p>

      {/* Quest cards */}
      <div className="space-y-4">
        {filtered.map((quest) => {
          const cat = CATEGORIES[quest.category] || CATEGORIES.gratitude
          const diff = DIFFICULTY[quest.difficulty]
          const isActive = activeQuestId === quest._id

          return (
            <div
              key={quest._id}
              id={`quest-${quest._id}`}
              className={`card border transition-all duration-300 ${
                quest.completedToday
                  ? 'opacity-60 border-[var(--card-border)]'
                  : isActive
                  ? `${cat.color} shadow-lifted`
                  : 'border-[var(--card-border)] hover:shadow-card hover:-translate-y-0.5'
              }`}
            >
              {/* Quest header row */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  {/* Category icon pill */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-lg ${
                    cat.color.split(' ').slice(0, 2).join(' ')
                  }`}>
                    {cat.icon}
                  </div>

                  <div className="flex-1">
                    {/* Badge row */}
                    <div className="flex items-center gap-1.5 flex-wrap mb-1.5">
                      <span className={`badge ${cat.badge} text-2xs`}>
                        {cat.label}
                      </span>
                      <span className={`badge ${diff.cls} text-2xs`}>{diff.label}</span>
                      <span className="badge badge-gray text-2xs">{quest.durationMinutes} min</span>
                      <span className="badge badge-amber text-2xs">+{quest.xpReward} XP</span>
                    </div>
                    <h3 className="font-semibold text-[var(--ink)] leading-snug">{quest.title}</h3>
                    <p className="text-sm text-ink-muted mt-0.5 leading-relaxed">{quest.description}</p>
                  </div>
                </div>

                {/* Action button */}
                <div className="flex-shrink-0 mt-1">
                  {quest.completedToday ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-forest-100 dark:bg-forest-900/30 rounded-full">
                      <svg className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-xs font-semibold text-forest-700 dark:text-forest-400">Done</span>
                    </div>
                  ) : isActive ? (
                    <button
                      onClick={() => setActiveQuestId(null)}
                      className="btn-ghost btn-sm"
                    >
                      ✕ Close
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartQuest(quest._id)}
                      className="btn-primary btn-sm"
                    >
                      Start →
                    </button>
                  )}
                </div>
              </div>

              {/* Interactive quest area — expands when active */}
              {isActive && !quest.completedToday && (
                <div className="mt-5 pt-5 border-t border-[var(--card-border)] animate-fade-in">
                  {submitting ? (
                    <div className="flex items-center justify-center py-8 gap-3 text-ink-muted">
                      <span className="w-5 h-5 border-2 border-forest-300 border-t-forest-600 rounded-full animate-spin" />
                      <span className="text-sm">Saving your quest…</span>
                    </div>
                  ) : (
                    <QuestShell quest={quest} onCancel={() => setActiveQuestId(null)}>
                      <QuestComponent
                        quest={quest}
                        onComplete={handleQuestComplete}
                      />
                    </QuestShell>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="text-center py-12 space-y-2">
          <p className="text-2xl">🔍</p>
          <p className="font-semibold text-[var(--ink)]">No quests in this category yet</p>
          <p className="text-sm text-ink-muted">Check back soon — more are coming</p>
        </div>
      )}
    </div>
  )
}