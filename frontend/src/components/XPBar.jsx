import { getLevelProgress } from '../utils/xpUtils'

const MILESTONE_REWARDS = {
  5: '15% off Headspace',
  10: '20% off BetterHelp',
  15: '25% off Mindvalley',
  20: '30% off Noom',
}

export default function XPBar({ xp, level, rewards = [] }) {
  const progress = getLevelProgress(xp, level)
  const required = level * 100
  const nextMilestone = [5, 10, 15, 20].find(m => m > level)
  const nextMilestoneReward = MILESTONE_REWARDS[nextMilestone]
  const unusedCoupons = rewards.filter(r => !r.isUsed && new Date(r.expiresAt) > new Date())

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">L{level}</span>
          </div>
          <div>
            <p className="font-display font-bold text-textPrimary dark:text-white">Level {level}</p>
            <p className="text-xs text-textSecondary">{xp} / {required} XP</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-display font-bold text-primary">{progress}%</p>
          <p className="text-xs text-textSecondary">{required - xp} XP to next level</p>
        </div>
      </div>

      <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-center justify-between pt-1">
        {unusedCoupons.length > 0 ? (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
              {unusedCoupons.length} reward{unusedCoupons.length > 1 ? 's' : ''} available in Rewards tab
            </p>
          </div>
        ) : (
          <div />
        )}
        {nextMilestone && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            <p className="text-xs text-textSecondary">
              Level {nextMilestone} unlocks{' '}
              <span className="font-semibold text-primary">{nextMilestoneReward}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}