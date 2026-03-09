import { useEffect, useRef } from 'react'
import { getLevelProgress } from '../utils/xpUtils'

const MILESTONES = { 5: '15% off Headspace', 10: '20% off BetterHelp', 15: '25% off Mindvalley', 20: '30% off Noom' }

export default function XPBar({ xp = 0, level = 1, rewards = [] }) {
  const barRef = useRef(null)
  const progress = getLevelProgress(xp, level)
  const required = level * 100
  const nextMilestone = [5, 10, 15, 20].find(m => m > level)
  const unusedCoupons = rewards.filter(r => !r.isUsed && new Date(r.expiresAt) > new Date())

  useEffect(() => {
    if (barRef.current) {
      barRef.current.style.setProperty('--bar-width', `${progress}%`)
      barRef.current.style.width = `${progress}%`
    }
  }, [progress])

  return (
    <div className="card animate-fade-up">
      <div className="flex items-center justify-between mb-4">
        {/* Level badge */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-forest-500 flex items-center justify-center shadow-sm">
            <span className="font-display font-semibold text-white text-sm">L{level}</span>
          </div>
          <div>
            <p className="font-semibold text-[var(--ink)] text-sm">Level {level}</p>
            <p className="text-2xs text-ink-muted">{xp} / {required} XP to next level</p>
          </div>
        </div>
        {/* Progress % */}
        <div className="text-right">
          <p className="font-display text-2xl font-semibold text-forest-600 dark:text-forest-400">{progress}%</p>
          <p className="text-2xs text-ink-muted">{required - xp} XP remaining</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-2.5 bg-ink-faint dark:bg-ink-faint/30 rounded-full overflow-hidden">
        <div
          ref={barRef}
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #2D6A4F 0%, #52A07A 50%, #D97706 100%)',
          }}
        />
        {/* Shimmer overlay */}
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 2.5s linear infinite',
            width: `${progress}%`,
          }}
        />
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between mt-3 gap-2">
        {unusedCoupons.length > 0 ? (
          <div className="badge badge-forest">
            <span>🎁</span>
            {unusedCoupons.length} reward{unusedCoupons.length > 1 ? 's' : ''} ready
          </div>
        ) : <div />}

        {nextMilestone && (
          <div className="badge badge-amber">
            <span>✦</span>
            Level {nextMilestone}: {MILESTONES[nextMilestone]}
          </div>
        )}
      </div>
    </div>
  )
}
