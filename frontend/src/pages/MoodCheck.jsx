import { useState, useEffect } from 'react'
import { submitMood, getMoodHistory } from '../services/moodService'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'

const MOODS = [
  { score: 1,  label: 'Terrible',      emoji: '😞' },
  { score: 2,  label: 'Very Low',      emoji: '😔' },
  { score: 3,  label: 'Low',           emoji: '😕' },
  { score: 4,  label: 'Below Average', emoji: '😐' },
  { score: 5,  label: 'Neutral',       emoji: '🙂' },
  { score: 6,  label: 'Okay',          emoji: '😊' },
  { score: 7,  label: 'Good',          emoji: '😄' },
  { score: 8,  label: 'Great',         emoji: '😁' },
  { score: 9,  label: 'Excellent',     emoji: '🤩' },
  { score: 10, label: 'Amazing',       emoji: '🌟' },
]

const scoreColor = (s) => {
  if (!s) return 'border-[var(--card-border)] bg-[var(--card-bg)]'
  if (s >= 8) return 'border-forest-400 bg-forest-50 dark:bg-forest-900/20'
  if (s >= 6) return 'border-forest-300 bg-forest-50/50 dark:bg-forest-900/10'
  if (s >= 4) return 'border-amber-400 bg-amber-50 dark:bg-amber-900/15'
  return 'border-red-400 bg-red-50 dark:bg-red-900/15'
}

const scoreDot = (s) => {
  if (s >= 8) return 'bg-forest-500'
  if (s >= 6) return 'bg-forest-400'
  if (s >= 4) return 'bg-amber-500'
  return 'bg-red-500'
}

export default function MoodCheck() {
  const [selected, setSelected] = useState(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [alreadyLogged, setAlreadyLogged] = useState(false)
  const [todaysMood, setTodaysMood] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getMoodHistory()
      .then(res => { if (res.data.loggedToday) { setAlreadyLogged(true); setTodaysMood(res.data.moods[0]) } })
      .catch(() => {})
      .finally(() => setChecking(false))
  }, [])

  const handleSubmit = async () => {
    if (!selected) { setError('Please select a mood score first.'); return }
    setError('')
    setLoading(true)
    try {
      await submitMood({ moodScore: selected, text })
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 1800)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log mood.')
    } finally {
      setLoading(false)
    }
  }

  if (checking) return <LoadingSpinner />

  if (success) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="card text-center max-w-xs space-y-4 animate-scale-in">
        <div className="w-14 h-14 rounded-full bg-forest-100 dark:bg-forest-900/30 flex items-center justify-center mx-auto">
          <svg className="w-7 h-7 text-forest-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div>
          <h2 className="font-display font-semibold text-2xl text-[var(--ink)]">Mood logged</h2>
          <p className="text-ink-muted text-sm mt-1">Heading back to your dashboard…</p>
        </div>
      </div>
    </div>
  )

  if (alreadyLogged) return (
    <div className="max-w-md space-y-5 animate-fade-up">
      <div>
        <h1 className="font-display font-semibold text-3xl text-[var(--ink)]">Daily Mood Check</h1>
        <p className="text-ink-muted text-sm mt-1">Track how you feel each day</p>
      </div>
      <div className="card ring-1 ring-forest-200 dark:ring-forest-900/40 text-center space-y-4 py-10">
        <div className={`w-14 h-14 rounded-2xl ${scoreDot(todaysMood?.moodScore)} flex items-center justify-center mx-auto text-2xl`}>
          <span>{MOODS.find(m => m.score === todaysMood?.moodScore)?.emoji}</span>
        </div>
        <div>
          <h2 className="font-display font-semibold text-xl text-[var(--ink)]">Already logged today</h2>
          <p className="text-ink-muted text-sm mt-1">
            You felt <span className="font-semibold text-forest-600 dark:text-forest-400">{MOODS.find(m => m.score === todaysMood?.moodScore)?.label}</span> ({todaysMood?.moodScore}/10). Come back tomorrow.
          </p>
        </div>
        {todaysMood?.text && (
          <p className="text-sm text-ink-light italic border-t border-[var(--card-border)] pt-4 px-4">
            "{todaysMood.text}"
          </p>
        )}
        <button onClick={() => navigate('/dashboard')} className="btn-primary w-full max-w-xs mx-auto">
          Back to Dashboard
        </button>
      </div>
    </div>
  )

  const selectedMood = MOODS.find(m => m.score === selected)

  return (
    <div className="max-w-2xl space-y-6 animate-fade-up">
      <div>
        <h1 className="font-display font-semibold text-3xl text-[var(--ink)]">How are you feeling?</h1>
        <p className="text-ink-muted text-sm mt-1">Be honest with yourself. This is just for you.</p>
      </div>

      {/* Score grid */}
      <div className="card">
        <h3 className="font-semibold text-[var(--ink)] text-sm mb-4">Select your mood score</h3>
        <div className="grid grid-cols-5 gap-2">
          {MOODS.map(({ score, label, emoji }) => (
            <button
              key={score}
              onClick={() => setSelected(score)}
              className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-xl border-2 transition-all duration-150 hover:scale-105 active:scale-95 ${
                selected === score
                  ? `${scoreColor(score)} shadow-soft`
                  : 'border-[var(--card-border)] hover:border-forest-300 dark:hover:border-forest-700'
              }`}
            >
              <span className={`text-xl transition-all ${selected === score ? 'scale-110' : 'opacity-60'}`}>{emoji}</span>
              <span className="text-xs font-bold text-[var(--ink)]">{score}</span>
              <span className="text-2xs text-ink-muted text-center leading-tight">{label}</span>
            </button>
          ))}
        </div>

        {/* Selected summary */}
        {selectedMood && (
          <div className={`mt-4 flex items-center gap-3 px-4 py-3 rounded-xl border ${scoreColor(selected)} transition-all animate-fade-in`}>
            <span className="text-2xl">{selectedMood.emoji}</span>
            <div>
              <p className="font-semibold text-[var(--ink)] text-sm">{selectedMood.label}</p>
              <p className="text-xs text-ink-muted">{selected}/10</p>
            </div>
          </div>
        )}
      </div>

      {/* Optional note */}
      <div className="card">
        <div className="flex items-baseline justify-between mb-1">
          <h3 className="font-semibold text-[var(--ink)] text-sm">Add a note</h3>
          <span className="text-2xs text-ink-muted">Optional</span>
        </div>
        <p className="text-xs text-ink-muted mb-3">What's on your mind today?</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write anything that's contributing to how you feel…"
          rows={4}
          className="input resize-none"
        />
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !selected}
        className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Logging mood…
          </span>
        ) : 'Log Mood'}
      </button>
    </div>
  )
}
