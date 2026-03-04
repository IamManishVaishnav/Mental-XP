import { useState } from 'react'
import { useDashboard } from '../hooks/useDashboard'
import { useAuth } from '../context/AuthContext'
import StatCard from '../components/StatCard'
import XPBar from '../components/XPBar'
import MoodChart from '../components/MoodChart'
import BurnoutBanner from '../components/BurnoutBanner'
import LoadingSpinner from '../components/LoadingSpinner'
import { getMoodLabel } from '../utils/xpUtils'
import { useNavigate } from 'react-router-dom'

const TABS = ['Overview', 'Mood History', 'Rewards']

export default function Dashboard() {
  const { data, loading, error } = useDashboard()
  const { user } = useAuth()
  const [tab, setTab] = useState('Overview')
  const [dismissedAlerts, setDismissedAlerts] = useState(false)
  const navigate = useNavigate()

  if (loading) return <LoadingSpinner />

  if (error) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="card text-center max-w-sm">
        <p className="text-textSecondary">{error}</p>
      </div>
    </div>
  )

  const unreadAlerts = data?.alerts?.filter(a => !a.read) || []
  const activeRewards = data?.rewards?.filter(r => !r.isUsed && new Date(r.expiresAt) > new Date()) || []
  const usedRewards = data?.rewards?.filter(r => r.isUsed) || []
  const expiredRewards = data?.rewards?.filter(r => !r.isUsed && new Date(r.expiresAt) <= new Date()) || []

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="font-display font-bold text-3xl text-textPrimary dark:text-white">
          Welcome back, {user?.name?.split(' ')[0]}
        </h1>
        <p className="text-textSecondary mt-1">Here is your mental wellness overview</p>
      </div>

      {/* Unread alert banner */}
      {unreadAlerts.length > 0 && !dismissedAlerts && (
        <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1">
              <h4 className="font-display font-bold text-primary">
                {unreadAlerts.length} new alert{unreadAlerts.length > 1 ? 's' : ''} from your admin
              </h4>
              {unreadAlerts.map((alert, i) => (
                <p key={i} className="text-sm text-textSecondary dark:text-slate-400 pl-2 border-l-2 border-primary/30">
                  {alert.message}
                </p>
              ))}
            </div>
            <button
              onClick={() => setDismissedAlerts(true)}
              className="text-textSecondary hover:text-textPrimary dark:hover:text-white transition-colors flex-shrink-0 text-sm font-semibold"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Burnout banner */}
      {data?.burnoutRisk && <BurnoutBanner />}

      {/* Mood reminder */}
      {!data?.loggedToday && (
        <div className="rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 p-4 flex items-center justify-between">
          <div>
            <h4 className="font-display font-bold text-amber-700 dark:text-amber-400 text-sm">
              Mood not logged today
            </h4>
            <p className="text-xs text-amber-600 dark:text-amber-500 mt-0.5">
              Log your daily mood to keep your streak and improve your wellness score.
            </p>
          </div>
          <button
            onClick={() => navigate('/mood')}
            className="btn-primary text-sm flex-shrink-0"
          >
            Log Mood
          </button>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="XP Earned" value={data?.xp} icon={null} iconText="XP" sub={`Level ${data?.level}`} color="primary" />
        <StatCard label="Day Streak" value={`${data?.streak} days`} iconText="streak" sub="Keep it going" color="secondary" />
        <StatCard
          label="Active Rewards"
          value={activeRewards.length}
          iconText="rewards"
          sub={activeRewards.length > 0 ? 'Tap Rewards tab to view' : 'Complete quests to earn'}
          color={activeRewards.length > 0 ? 'accent' : 'primary'}
        />
      </div>

      {/* XP Bar */}
      <XPBar xp={data?.xp} level={data?.level} rewards={data?.rewards} />

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-100 dark:border-slate-800">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
              tab === t
                ? 'border-primary text-primary'
                : 'border-transparent text-textSecondary hover:text-textPrimary dark:hover:text-white'
            }`}
          >
            {t}
            {t === 'Rewards' && activeRewards.length > 0 && (
              <span className="ml-1.5 bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">
                {activeRewards.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'Overview' && <MoodChart moods={data?.last7Moods} />}

      {/* Mood History Tab */}
      {tab === 'Mood History' && (
        <div className="card">
          {data?.last7Moods?.length === 0 ? (
            <p className="text-textSecondary text-center py-8">No mood entries yet. Log your first mood to get started.</p>
          ) : (
            <div className="space-y-0">
              {data.last7Moods.map((mood) => (
                <div
                  key={mood._id}
                  className="flex items-center justify-between py-3.5 border-b border-slate-100 dark:border-slate-700 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-display font-bold text-sm text-white ${
                      mood.moodScore >= 7 ? 'bg-emerald-500' :
                      mood.moodScore >= 4 ? 'bg-primary' : 'bg-red-500'
                    }`}>
                      {mood.moodScore}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-textPrimary dark:text-white">
                        {getMoodLabel(mood.moodScore)}
                      </p>
                      {mood.text && (
                        <p className="text-xs text-textSecondary truncate max-w-xs">{mood.text}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-textSecondary">
                    {new Date(mood.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Rewards Tab */}
      {tab === 'Rewards' && (
        <div className="space-y-4">
          {data?.rewards?.length === 0 ? (
            <div className="card text-center py-12">
              <p className="font-display font-bold text-textPrimary dark:text-white mb-2">No rewards yet</p>
              <p className="text-sm text-textSecondary">Complete quests and level up to earn discount coupons from our wellness partners.</p>
            </div>
          ) : (
            <>
              {activeRewards.length > 0 && (
                <div>
                  <h3 className="font-display font-semibold text-textPrimary dark:text-white mb-3 text-sm uppercase tracking-widest">
                    Active Rewards
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {activeRewards.map((reward) => (
                      <RewardCard key={reward._id} reward={reward} status="active" />
                    ))}
                  </div>
                </div>
              )}

              {usedRewards.length > 0 && (
                <div>
                  <h3 className="font-display font-semibold text-textSecondary mb-3 text-sm uppercase tracking-widest">
                    Used
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {usedRewards.map((reward) => (
                      <RewardCard key={reward._id} reward={reward} status="used" />
                    ))}
                  </div>
                </div>
              )}

              {expiredRewards.length > 0 && (
                <div>
                  <h3 className="font-display font-semibold text-textSecondary mb-3 text-sm uppercase tracking-widest">
                    Expired
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {expiredRewards.map((reward) => (
                      <RewardCard key={reward._id} reward={reward} status="expired" />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

function RewardCard({ reward, status }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(reward.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const statusStyles = {
    active: 'border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5',
    used: 'border-slate-200 dark:border-slate-700 opacity-60',
    expired: 'border-slate-200 dark:border-slate-700 opacity-50',
  }

  return (
    <div className={`card border-2 ${statusStyles[status]}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="font-display font-bold text-2xl text-primary">{reward.discountPercent}% off</p>
          <p className="text-xs text-textSecondary mt-0.5">{reward.partner}</p>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
          status === 'active' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
          status === 'used' ? 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400' :
          'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400'
        }`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <p className="text-sm text-textSecondary dark:text-slate-400 mb-3">{reward.description}</p>

      <div className="flex items-center gap-2 p-2 bg-slate-100 dark:bg-slate-900 rounded-lg">
        <code className="flex-1 text-xs font-mono font-bold text-textPrimary dark:text-white tracking-wider">
          {reward.code}
        </code>
        {status === 'active' && (
          <button
            onClick={handleCopy}
            className="text-xs font-semibold text-primary hover:text-indigo-700 transition-colors flex-shrink-0"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
      </div>

      <p className="text-xs text-textSecondary mt-2">
        {status === 'active' && `Expires ${new Date(reward.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
        {status === 'used' && `Used on ${new Date(reward.usedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
        {status === 'expired' && 'This reward has expired'}
      </p>
    </div>
  )
}