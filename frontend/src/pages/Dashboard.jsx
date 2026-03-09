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

const moodScoreColor = (s) => {
  if (s >= 8) return 'bg-forest-500'
  if (s >= 6) return 'bg-forest-400'
  if (s >= 4) return 'bg-amber-500'
  return 'bg-red-500'
}

export default function Dashboard() {
  const { data, loading, error } = useDashboard()
  const { user } = useAuth()
  const [tab, setTab] = useState('Overview')
  const [dismissedAlerts, setDismissedAlerts] = useState(false)
  const [dismissedBurnout, setDismissedBurnout] = useState(false)
  const navigate = useNavigate()

  if (loading) return <LoadingSpinner />
  if (error) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="card text-center max-w-sm"><p className="text-ink-muted text-sm">{error}</p></div>
    </div>
  )

  const unreadAlerts = data?.alerts?.filter(a => !a.read) || []
  const activeRewards = data?.rewards?.filter(r => !r.isUsed && new Date(r.expiresAt) > new Date()) || []
  const usedRewards = data?.rewards?.filter(r => r.isUsed) || []
  const expiredRewards = data?.rewards?.filter(r => !r.isUsed && new Date(r.expiresAt) <= new Date()) || []

  return (
    <div className="space-y-6">

      {/* Page header */}
      <div className="animate-fade-up">
        <h1 className="font-display font-semibold text-3xl text-[var(--ink)]">
          Good to see you, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-ink-muted text-sm mt-1">Here's your mental wellness overview</p>
      </div>

      {/* Admin alerts */}
      {user?.role !== 'admin' && unreadAlerts.length > 0 && !dismissedAlerts && (
        <div className="rounded-2xl bg-forest-50 dark:bg-forest-900/15 border border-forest-200 dark:border-forest-900/40 p-4 animate-fade-up">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-1.5">
              <h4 className="font-semibold text-forest-700 dark:text-forest-300 text-sm">
                {unreadAlerts.length} new alert{unreadAlerts.length > 1 ? 's' : ''} from your admin
              </h4>
              {unreadAlerts.map((alert, i) => (
                <p key={i} className="text-xs text-ink-light pl-3 border-l-2 border-forest-300 dark:border-forest-700">
                  {alert.message}
                </p>
              ))}
            </div>
            <button onClick={() => setDismissedAlerts(true)} className="text-ink-muted hover:text-ink text-xs font-semibold flex-shrink-0 transition-colors">
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Burnout banner */}
      {user?.role !== 'admin' && data?.burnoutRisk && !dismissedBurnout && (
        <BurnoutBanner onDismiss={() => setDismissedBurnout(true)} />
      )}

      {/* Mood reminder */}
      {user?.role !== 'admin' && !data?.loggedToday && (
        <div className="rounded-2xl bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800/50 p-4 flex items-center justify-between gap-4 animate-fade-up">
          <div>
            <h4 className="font-semibold text-amber-800 dark:text-amber-300 text-sm">Mood not logged today</h4>
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5">
              Log your mood to keep your streak alive and track your wellness trends.
            </p>
          </div>
          <button onClick={() => navigate('/mood')} className="btn-amber btn-sm flex-shrink-0">
            Log now →
          </button>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="XP Earned"     value={data?.xp}            sub={`Level ${data?.level}`}                                           icon="⚡" color="forest" />
        <StatCard label="Day Streak"    value={`${data?.streak}d`}  sub="Keep it going 🔥"                                                icon="🔥" color="amber" />
        <StatCard label="Active Rewards" value={activeRewards.length} sub={activeRewards.length > 0 ? 'See Rewards tab' : 'Level up to earn'} icon="🎁" color={activeRewards.length > 0 ? 'amber' : 'forest'} />
      </div>

      {/* XP bar */}
      <XPBar xp={data?.xp} level={data?.level} rewards={data?.rewards} />

      {/* Tabs */}
      <div className="flex gap-0 border-b border-[var(--card-border)]">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={tab === t ? 'tab-active' : 'tab-default'}
          >
            {t}
            {t === 'Rewards' && activeRewards.length > 0 && (
              <span className="ml-1.5 badge badge-amber">{activeRewards.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {tab === 'Overview' && <MoodChart moods={data?.last7Moods} />}

      {/* Tab: Mood History */}
      {tab === 'Mood History' && (
        <div className="card animate-fade-up">
          {data?.last7Moods?.length === 0 ? (
            <div className="text-center py-12">
              <span className="text-3xl block mb-3">😶</span>
              <p className="text-ink-muted text-sm">No mood entries yet. Log your first mood to get started.</p>
            </div>
          ) : (
            <div>
              {data.last7Moods.map((mood, idx) => (
                <div
                  key={mood._id}
                  className={`flex items-center justify-between py-3.5 ${idx < data.last7Moods.length - 1 ? 'border-b border-[var(--card-border)]' : ''}`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-display font-semibold text-sm text-white flex-shrink-0 ${moodScoreColor(mood.moodScore)}`}>
                      {mood.moodScore}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[var(--ink)]">{getMoodLabel(mood.moodScore)}</p>
                      {mood.text && <p className="text-xs text-ink-muted truncate max-w-xs mt-0.5">{mood.text}</p>}
                    </div>
                  </div>
                  <span className="text-xs text-ink-muted flex-shrink-0">
                    {new Date(mood.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Rewards */}
      {tab === 'Rewards' && (
        <div className="space-y-5 animate-fade-up">
          {data?.rewards?.length === 0 ? (
            <div className="card text-center py-14">
              <span className="text-4xl block mb-3">🎁</span>
              <p className="font-semibold text-[var(--ink)] mb-1">No rewards yet</p>
              <p className="text-sm text-ink-muted max-w-xs mx-auto">
                Complete quests and level up to unlock discount coupons from our wellness partners.
              </p>
            </div>
          ) : (
            <>
              {activeRewards.length > 0 && (
                <div>
                  <p className="section-label mb-3">Active rewards</p>
                  <div className="grid grid-cols-2 gap-3">
                    {activeRewards.map(r => <RewardCard key={r._id} reward={r} status="active" />)}
                  </div>
                </div>
              )}
              {usedRewards.length > 0 && (
                <div>
                  <p className="section-label mb-3">Used</p>
                  <div className="grid grid-cols-2 gap-3">
                    {usedRewards.map(r => <RewardCard key={r._id} reward={r} status="used" />)}
                  </div>
                </div>
              )}
              {expiredRewards.length > 0 && (
                <div>
                  <p className="section-label mb-3">Expired</p>
                  <div className="grid grid-cols-2 gap-3">
                    {expiredRewards.map(r => <RewardCard key={r._id} reward={r} status="expired" />)}
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
  const handleCopy = () => { navigator.clipboard.writeText(reward.code); setCopied(true); setTimeout(() => setCopied(false), 2000) }

  return (
    <div className={`card transition-all ${
      status === 'active'   ? 'ring-1 ring-forest-200 dark:ring-forest-900/40' :
      status === 'used'     ? 'opacity-55' :
                              'opacity-45'
    }`}>
      <div className="flex items-start justify-between mb-2.5">
        <div>
          <p className="font-display font-semibold text-2xl text-forest-600 dark:text-forest-400">
            {reward.discountPercent}% <span className="text-lg">off</span>
          </p>
          <p className="text-xs text-ink-muted mt-0.5">{reward.partner}</p>
        </div>
        <span className={`badge ${
          status === 'active' ? 'badge-forest' :
          status === 'used'   ? 'badge-gray'   : 'badge-red'
        }`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      </div>

      <p className="text-xs text-ink-light leading-relaxed mb-3">{reward.description}</p>

      <div className="flex items-center gap-2 px-3 py-2 bg-cream-warm dark:bg-ink-faint/20 rounded-xl">
        <code className="flex-1 text-xs font-mono font-bold text-[var(--ink)] tracking-wider truncate">
          {reward.code}
        </code>
        {status === 'active' && (
          <button onClick={handleCopy} className="text-xs font-semibold text-forest-600 dark:text-forest-400 hover:text-forest-700 flex-shrink-0 transition-colors">
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        )}
      </div>

      <p className="text-2xs text-ink-muted mt-2">
        {status === 'active'  && `Expires ${new Date(reward.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`}
        {status === 'used'    && reward.usedAt && `Used ${new Date(reward.usedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
        {status === 'expired' && 'This reward has expired'}
      </p>
    </div>
  )
}
