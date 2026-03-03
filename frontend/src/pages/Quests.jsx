import { useState } from 'react'
import { completeQuest } from '../services/questService'
import { useNavigate } from 'react-router-dom'

const QUESTS = [
  {
    type: 'breathing',
    icon: '🫁',
    title: 'Box Breathing',
    desc: 'Inhale 4s → Hold 4s → Exhale 4s → Hold 4s. Repeat 4 times.',
    duration: '4 min',
    color: 'from-accent/10 to-cyan-500/5 border-accent/20',
    badge: 'bg-accent/10 text-accent',
  },
  {
    type: 'gratitude',
    icon: '🙏',
    title: 'Gratitude Log',
    desc: 'Write down 3 things you are genuinely grateful for today — big or small.',
    duration: '5 min',
    color: 'from-secondary/10 to-purple-500/5 border-secondary/20',
    badge: 'bg-secondary/10 text-secondary',
  },
  {
    type: 'reframe',
    icon: '🧠',
    title: 'Thought Reframe',
    desc: 'Identify one negative thought and rewrite it with a balanced perspective.',
    duration: '6 min',
    color: 'from-primary/10 to-indigo-500/5 border-primary/20',
    badge: 'bg-primary/10 text-primary',
  },
]

export default function Quests() {
  const [completing, setCompleting] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleComplete = async (questType) => {
    setError('')
    setCompleting(questType)
    try {
      const res = await completeQuest(questType)
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete quest.')
    } finally {
      setCompleting(null)
    }
  }

  if (result) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="card text-center max-w-sm space-y-4">
        <div className="text-5xl">🎉</div>
        <h2 className="font-display font-bold text-2xl text-textPrimary dark:text-white">{result.message}</h2>
        <div className="grid grid-cols-3 gap-3 pt-2">
          <div className="p-3 bg-primary/10 rounded-xl">
            <p className="text-xs text-textSecondary">XP</p>
            <p className="font-display font-bold text-xl text-primary">{result.xp}</p>
          </div>
          <div className="p-3 bg-secondary/10 rounded-xl">
            <p className="text-xs text-textSecondary">Level</p>
            <p className="font-display font-bold text-xl text-secondary">{result.level}</p>
          </div>
          <div className="p-3 bg-accent/10 rounded-xl">
            <p className="text-xs text-textSecondary">Streak</p>
            <p className="font-display font-bold text-xl text-accent">{result.streak}🔥</p>
          </div>
        </div>
        <button onClick={() => navigate('/dashboard')} className="btn-primary w-full">View Dashboard</button>
        <button onClick={() => setResult(null)} className="btn-secondary w-full">Complete Another</button>
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display font-bold text-3xl text-textPrimary dark:text-white">Mental Quests</h1>
        <p className="text-textSecondary mt-1">Complete a quest to earn +10 XP and build your streak</p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {QUESTS.map((quest) => (
          <div key={quest.type} className={`card bg-gradient-to-br ${quest.color} hover:scale-[1.01] transition-transform duration-200`}>
            <div className="flex items-start gap-4">
              <div className="text-4xl">{quest.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-display font-bold text-textPrimary dark:text-white text-lg">{quest.title}</h3>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${quest.badge}`}>{quest.duration}</span>
                </div>
                <p className="text-textSecondary dark:text-slate-400 text-sm mb-4">{quest.desc}</p>
                <button
                  onClick={() => handleComplete(quest.type)}
                  disabled={completing !== null}
                  className="btn-primary text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {completing === quest.type ? 'Completing...' : 'Complete Quest → +10 XP'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800 dark:to-slate-800/50">
        <div className="flex items-center gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="font-display font-semibold text-textPrimary dark:text-white text-sm">Daily Tip</h4>
            <p className="text-xs text-textSecondary mt-0.5">Completing at least one quest per day maintains your streak and reduces burnout risk. Consistency is the key.</p>
          </div>
        </div>
      </div>
    </div>
  )
}