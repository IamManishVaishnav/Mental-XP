import { useState } from 'react'
import { submitMood } from '../services/moodService'
import { useNavigate } from 'react-router-dom'

const MOODS = [
  { score: 1, emoji: '😭', label: 'Terrible' },
  { score: 2, emoji: '😢', label: 'Very Low' },
  { score: 3, emoji: '😟', label: 'Low' },
  { score: 4, emoji: '😕', label: 'Below Okay' },
  { score: 5, emoji: '😐', label: 'Neutral' },
  { score: 6, emoji: '🙂', label: 'Okay' },
  { score: 7, emoji: '😊', label: 'Good' },
  { score: 8, emoji: '😄', label: 'Great' },
  { score: 9, emoji: '😁', label: 'Excellent' },
  { score: 10, emoji: '🤩', label: 'Amazing' },
]

export default function MoodCheck() {
  const [selected, setSelected] = useState(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!selected) { setError('Please select a mood score.'); return }
    setError('')
    setLoading(true)
    try {
      await submitMood({ moodScore: selected, text })
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log mood.')
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="card text-center max-w-sm">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="font-display font-bold text-2xl text-textPrimary dark:text-white mb-2">Mood Logged!</h2>
        <p className="text-textSecondary">Redirecting to dashboard...</p>
      </div>
    </div>
  )

  const selectedMood = MOODS.find(m => m.score === selected)

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display font-bold text-3xl text-textPrimary dark:text-white">Daily Mood Check</h1>
        <p className="text-textSecondary mt-1">How are you feeling right now?</p>
      </div>

      <div className="card">
        <h3 className="font-display font-semibold text-textPrimary dark:text-white mb-4">Select your mood (1–10)</h3>
        <div className="grid grid-cols-5 gap-3">
          {MOODS.map((mood) => (
            <button
              key={mood.score}
              onClick={() => setSelected(mood.score)}
              className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                selected === mood.score
                  ? 'border-primary bg-primary/10 shadow-glow'
                  : 'border-slate-100 dark:border-slate-700 hover:border-primary/40'
              }`}
            >
              <span className="text-2xl">{mood.emoji}</span>
              <span className="text-xs font-semibold text-textSecondary">{mood.score}</span>
            </button>
          ))}
        </div>

        {selectedMood && (
          <div className="mt-4 p-3 bg-primary/5 border border-primary/20 rounded-xl text-center">
            <p className="font-display font-semibold text-primary">{selectedMood.emoji} {selectedMood.label} — {selectedMood.score}/10</p>
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="font-display font-semibold text-textPrimary dark:text-white mb-3">Add a note <span className="text-textSecondary font-normal text-sm">(optional)</span></h3>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What's on your mind today? Any thoughts or context..."
          rows={4}
          className="input resize-none"
        />
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <button onClick={handleSubmit} disabled={loading || !selected} className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed">
        {loading ? 'Logging mood...' : 'Log Mood ✓'}
      </button>
    </div>
  )
}