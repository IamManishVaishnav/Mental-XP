import { getLevelProgress } from '../utils/xpUtils'

export default function XPBar({ xp, level }) {
  const progress = getLevelProgress(xp, level)
  const required = level * 100

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-white font-display font-bold text-sm">L{level}</span>
          </div>
          <div>
            <p className="font-display font-bold text-textPrimary dark:text-white">Level {level}</p>
            <p className="text-xs text-textSecondary">{xp} / {required} XP</p>
          </div>
        </div>
        <span className="text-2xl font-display font-bold text-primary">{progress}%</span>
      </div>
      <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-700"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-xs text-textSecondary mt-2">{required - xp} XP to Level {level + 1}</p>
    </div>
  )
}