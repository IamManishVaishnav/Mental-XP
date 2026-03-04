import { useState, useEffect } from 'react'
import { getQuests, completeQuest } from '../services/questService'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'

const CATEGORY_LABELS = {
  breathing: 'Mindfulness & Breathing',
  gratitude: 'Gratitude & Journaling',
  reframe: 'Cognitive Reframing',
}

const DIFFICULTY_STYLES = {
  easy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

const CATEGORY_STYLES = {
  breathing: 'border-l-4 border-accent',
  gratitude: 'border-l-4 border-secondary',
  reframe: 'border-l-4 border-primary',
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

  if (result) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="card max-w-sm w-full space-y-5 text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto">
          <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h2 className="font-display font-bold text-2xl text-textPrimary dark:text-white">Quest Complete</h2>
          <p className="text-textSecondary text-sm mt-1">{result.questTitle}</p>
        </div>
        <p className="text-sm text-primary font-semibold">{result.message}</p>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-primary/10 rounded-xl">
            <p className="text-xs text-textSecondary mb-1">XP</p>
            <p className="font-display font-bold text-lg text-primary">{result.xp}</p>
          </div>
          <div className="p-3 bg-secondary/10 rounded-xl">
            <p className="text-xs text-textSecondary mb-1">Level</p>
            <p className="font-display font-bold text-lg text-secondary">{result.level}</p>
          </div>
          <div className="p-3 bg-accent/10 rounded-xl">
            <p className="text-xs text-textSecondary mb-1">Streak</p>
            <p className="font-display font-bold text-lg text-accent">{result.streak}d</p>
          </div>
        </div>

        {result.leveledUp && (
          <div className="p-3 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-xl">
            <p className="font-display font-bold text-primary text-sm">Level Up!</p>
            <p className="text-xs text-textSecondary mt-0.5">You reached Level {result.level}. Check your Rewards tab for new coupons.</p>
          </div>
        )}

        {result.newCoupons?.length > 0 && (
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl text-left">
            <p className="font-semibold text-emerald-700 dark:text-emerald-400 text-sm mb-1">
              {result.newCoupons.length} new reward{result.newCoupons.length > 1 ? 's' : ''} unlocked
            </p>
            {result.newCoupons.map((c, i) => (
              <p key={i} className="text-xs text-textSecondary">{c.discountPercent}% off — {c.partner}</p>
            ))}
          </div>
        )}

        <div className="flex gap-3">
          <button onClick={() => navigate('/dashboard')} className="btn-primary flex-1 text-sm">
            View Dashboard
          </button>
          <button onClick={() => setResult(null)} className="btn-secondary flex-1 text-sm">
            More Quests
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl text-textPrimary dark:text-white">Mental Quests</h1>
          <p className="text-textSecondary mt-1">Complete quests to earn XP, level up, and unlock rewards</p>
        </div>
        {completedCount > 0 && (
          <div className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-xl">
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              {completedCount} completed today
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['all', 'breathing', 'gratitude', 'reframe'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              filter === f
                ? 'bg-primary text-white shadow-glow'
                : 'bg-white dark:bg-slate-800 text-textSecondary border border-slate-200 dark:border-slate-700 hover:border-primary/40'
            }`}
          >
            {f === 'all' ? 'All Quests' : CATEGORY_LABELS[f]}
          </button>
        ))}
      </div>

      {/* Quest list */}
      <div className="space-y-3">
        {filtered.map(quest => (
          <div
            key={quest._id}
            className={`card ${CATEGORY_STYLES[quest.category]} hover:shadow-card transition-all duration-200 ${quest.completedToday ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="font-display font-bold text-textPrimary dark:text-white">{quest.title}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFFICULTY_STYLES[quest.difficulty]}`}>
                    {quest.difficulty.charAt(0).toUpperCase() + quest.difficulty.slice(1)}
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-textSecondary">
                    {quest.durationMinutes} min
                  </span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    +{quest.xpReward} XP
                  </span>
                </div>
                <p className="text-sm text-textSecondary">{quest.description}</p>
              </div>

              <div className="flex-shrink-0">
                {quest.completedToday ? (
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl">
                    <svg className="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Done</span>
                  </div>
                ) : (
                  <button
                    onClick={() => setActiveQuest(activeQuest?._id === quest._id ? null : quest)}
                    className="btn-primary text-sm"
                  >
                    {activeQuest?._id === quest._id ? 'Close' : 'Start Quest'}
                  </button>
                )}
              </div>
            </div>

            {/* Expanded instructions */}
            {activeQuest?._id === quest._id && (
              <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-700 space-y-4">
                <h4 className="font-display font-semibold text-textPrimary dark:text-white text-sm">
                  Instructions
                </h4>
                <ol className="space-y-2">
                  {quest.instructions.map((step, i) => (
                    <li key={i} className="flex gap-3 text-sm text-textSecondary dark:text-slate-400">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center mt-0.5">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
                <div className="flex items-center justify-between pt-2">
                  <p className="text-xs text-textSecondary">
                    Take your time. Complete each step mindfully.
                  </p>
                  <button
                    onClick={() => handleComplete(quest)}
                    disabled={completing === quest._id}
                    className="btn-primary text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {completing === quest._id ? 'Completing...' : `Mark Complete — +${quest.xpReward} XP`}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}