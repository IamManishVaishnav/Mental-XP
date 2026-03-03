import { useDashboard } from '../hooks/useDashboard'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import StatCard from '../components/StatCard'
import XPBar from '../components/XPBar'
import MoodChart from '../components/MoodChart'
import BurnoutBanner from '../components/BurnoutBanner'
import LoadingSpinner from '../components/LoadingSpinner'
import { getMoodLabel } from '../utils/xpUtils'

export default function Dashboard() {
  const { data, loading, error } = useDashboard()
  const { user } = useAuth()
  const [dismissedAlerts, setDismissedAlerts] = useState(false)

  if (loading) return <LoadingSpinner />

  if (error) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="card text-center max-w-sm">
        <p className="text-4xl mb-3">⚠️</p>
        <p className="text-textSecondary">{error}</p>
      </div>
    </div>
  )

  const lastMood = data?.last7Moods?.[0]

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-display font-bold text-3xl text-textPrimary dark:text-white">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-textSecondary mt-1">Here's your mental wellness overview</p>
      </div>

      {data?.burnoutRisk && <BurnoutBanner />} 
      {data?.alerts?.filter(a => !a.read).length > 0 && !dismissedAlerts && (
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <h4 className="font-display font-bold text-primary flex items-center gap-2">
                🔔 You have {data.alerts.filter(a => !a.read).length} new alert{data.alerts.filter(a => !a.read).length > 1 ? 's' : ''} from your admin
              </h4>
              {data.alerts.filter(a => !a.read).map((alert, i) => (
                <p key={i} className="text-sm text-textSecondary dark:text-slate-400 pl-6">{alert.message}</p>
              ))}
            </div>
            <button
              onClick={() => setDismissedAlerts(true)}
              className="text-textSecondary hover:text-textPrimary dark:hover:text-white transition-colors text-lg leading-none flex-shrink-0"
              title="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="XP Earned" value={data?.xp} icon="⚡" sub={`Level ${data?.level}`} color="primary" />
        <StatCard label="Day Streak" value={`${data?.streak}🔥`} icon="📅" sub="Keep it going!" color="secondary" />
        <StatCard
          label="Last Mood"
          value={lastMood ? `${lastMood.moodScore}/10` : '—'}
          icon="😊"
          sub={lastMood ? getMoodLabel(lastMood.moodScore) : 'No entries yet'}
          color="accent"
        />
      </div>

      <XPBar xp={data?.xp} level={data?.level} />
      <MoodChart moods={data?.last7Moods} />

      {data?.last7Moods?.length > 0 && (
        <div className="card">
          <h3 className="font-display font-semibold text-textPrimary dark:text-white mb-4">Recent Mood Logs</h3>
          <div className="space-y-2">
            {data.last7Moods.map((mood) => (
              <div key={mood._id} className="flex items-center justify-between py-2.5 border-b border-slate-100 dark:border-slate-700 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center font-display font-bold text-primary text-sm">
                    {mood.moodScore}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-textPrimary dark:text-white">{getMoodLabel(mood.moodScore)}</p>
                    {mood.text && <p className="text-xs text-textSecondary truncate max-w-xs">{mood.text}</p>}
                  </div>
                </div>
                <span className="text-xs text-textSecondary">
                  {new Date(mood.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}