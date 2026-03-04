import { useState, useEffect } from 'react'
import { submitMood, getMoodHistory } from '../services/moodService'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'

const MOOD_LABELS = {
  1: 'Terrible', 2: 'Very Low', 3: 'Low', 4: 'Below Average',
  5: 'Neutral', 6: 'Okay', 7: 'Good', 8: 'Great', 9: 'Excellent', 10: 'Amazing'
}

const getMoodColor = (score) => {
  if (score >= 8) return 'bg-emerald-500'
  if (score >= 6) return 'bg-primary'
  if (score >= 4) return 'bg-amber-500'
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
      .then(res => {
        if (res.data.loggedToday) {
          setAlreadyLogged(true)
          setTodaysMood(res.data.moods[0])
        }
      })
      .catch(() => {})
      .finally(() => setChecking(false))
  }, [])

  const handleSubmit = async () => {
    if (!selected) { setError('Please select a mood score.'); return }
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
      <div className="card text-center max-w-sm space-y-3">
        <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto">
          <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-display font-bold text-2xl text-textPrimary dark:text-white">Mood Logged</h2>
        <p className="text-textSecondary text-sm">Redirecting to dashboard...</p>
      </div>
    </div>
  )

  if (alreadyLogged) return (
    <div className="max-w-md space-y-6">
      <div>
        <h1 className="font-display font-bold text-3xl text-textPrimary dark:text-white">Daily Mood Check</h1>
        <p className="text-textSecondary mt-1">Track how you feel each day</p>
      </div>
      <div className="card border-2 border-primary/20 bg-primary/5 text-center space-y-4 py-10">
        <div className={`w-14 h-14 rounded-2xl ${getMoodColor(todaysMood?.moodScore)} flex items-center justify-center mx-auto`}>
          <span className="text-white font-display font-bold text-xl">{todaysMood?.moodScore}</span>
        </div>
        <div>
          <h2 className="font-display font-bold text-xl text-textPrimary dark:text-white">
            Already logged today
          </h2>
          <p className="text-textSecondary text-sm mt-1">
            You logged <span className="font-semibold text-primary">{MOOD_LABELS[todaysMood?.moodScore]}</span> today.
            Come back tomorrow to log again.
          </p>
        </div>
        {todaysMood?.text && (
          <p className="text-sm text-textSecondary italic border-t border-slate-100 dark:border-slate-700 pt-4">
            "{todaysMood.text}"
          </p>
        )}
        <button onClick={() => navigate('/dashboard')} className="btn-primary w-full">
          Back to Dashboard
        </button>
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display font-bold text-3xl text-textPrimary dark:text-white">Daily Mood Check</h1>
        <p className="text-textSecondary mt-1">How are you feeling right now? Be honest with yourself.</p>
      </div>

      <div className="card">
        <h3 className="font-display font-semibold text-textPrimary dark:text-white mb-4">
          Select your mood score
        </h3>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((score) => (
            <button
              key={score}
              onClick={() => setSelected(score)}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all duration-150 hover:scale-105 ${
                selected === score
                  ? 'border-primary bg-primary/10 shadow-glow'
                  : 'border-slate-100 dark:border-slate-700 hover:border-primary/40'
              }`}
            >
              <div className={`w-6 h-6 rounded-full ${getMoodColor(score)} opacity-${selected === score ? '100' : '40'}`} />
              <span className="text-sm font-display font-bold text-textPrimary dark:text-white">{score}</span>
              <span className="text-xs text-textSecondary leading-tight text-center">{MOOD_LABELS[score]}</span>
            </button>
          ))}
        </div>

        {selected && (
          <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-xl flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg ${getMoodColor(selected)} flex items-center justify-center`}>
              <span className="text-white font-bold text-sm">{selected}</span>
            </div>
            <p className="font-semibold text-primary">{MOOD_LABELS[selected]} — {selected}/10</p>
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="font-display font-semibold text-textPrimary dark:text-white mb-1">
          Add a note
          <span className="text-textSecondary font-normal text-sm ml-2">Optional</span>
        </h3>
        <p className="text-xs text-textSecondary mb-3">What is contributing to how you feel today?</p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write anything on your mind..."
          rows={4}
          className="input resize-none"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading || !selected}
        className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {loading ? 'Logging mood...' : 'Log Mood'}
      </button>
    </div>
  )
}