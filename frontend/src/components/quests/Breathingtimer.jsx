// BreathingTimer.jsx
// Animated breathing guide. Circle expands/contracts with each phase.
// Auto-advances through phases. Completes automatically after totalCycles.
// Props:
//   config     — { phases: [{label, duration, instruction}], totalCycles }
//   onComplete — fn(completionData) — called when all cycles are done

import { useState, useEffect, useRef, useCallback } from 'react'

const PHASE_COLORS = {
  Inhale:  { ring: '#2D6A4F', bg: 'rgba(45,106,79,0.12)',  text: 'text-forest-600 dark:text-forest-400' },
  Hold:    { ring: '#D97706', bg: 'rgba(217,119,6,0.10)',  text: 'text-amber-600 dark:text-amber-400'  },
  Exhale:  { ring: '#6B9174', bg: 'rgba(107,145,116,0.10)', text: 'text-sage-600 dark:text-sage-400'  },
}

export default function BreathingTimer({ config, onComplete, xpReward = '' }) {
  const { phases, totalCycles } = config

  const [started, setStarted] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [cycleCount, setCycleCount] = useState(0)
  const [secondsLeft, setSecondsLeft] = useState(phases[0].duration)
  const [done, setDone] = useState(false)

  // circle scale: 0.55 (min) → 1.0 (max) driven by phase + elapsed time
  const [scale, setScale] = useState(0.55)

  const timerRef = useRef(null)
  const phase = phases[phaseIndex]
  const phaseColor = PHASE_COLORS[phase.label] || PHASE_COLORS['Hold']

  const advance = useCallback(() => {
    setPhaseIndex(prev => {
      const next = (prev + 1) % phases.length
      // Completed a full cycle when we wrap back to 0
      if (next === 0) {
        setCycleCount(c => {
          const newCount = c + 1
          if (newCount >= totalCycles) {
            setDone(true)
          }
          return newCount
        })
      }
      setSecondsLeft(phases[next].duration)
      return next
    })
  }, [phases, totalCycles])

  // Tick every second
  useEffect(() => {
    if (!started || done) return
    timerRef.current = setInterval(() => {
      setSecondsLeft(s => {
        if (s <= 1) {
          advance()
          return phases[phaseIndex]?.duration || phases[0].duration
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [started, done, advance, phaseIndex, phases])

  // Animate scale based on phase
  useEffect(() => {
    if (!started) return
    const phaseDuration = phase.duration * 1000
    const targetScale = phase.label === 'Inhale' ? 1.0 : phase.label === 'Exhale' ? 0.55 : scale

    // For Hold phases, keep current scale; for Inhale/Exhale animate smoothly
    if (phase.label === 'Hold') return

    const start = Date.now()
    const startScale = phase.label === 'Inhale' ? 0.55 : 1.0
    const animFrame = requestAnimationFrame(function tick() {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / phaseDuration, 1)
      // ease-in-out
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2
      setScale(startScale + (targetScale - startScale) * eased)
      if (progress < 1) requestAnimationFrame(tick)
    })

    return () => cancelAnimationFrame(animFrame)
  }, [phaseIndex, started])

  if (done) {
    return (
      <div className="text-center space-y-4 py-6">
        <div className="w-20 h-20 rounded-full bg-forest-100 dark:bg-forest-900/30 flex items-center justify-center mx-auto">
          <span className="text-4xl">✅</span>
        </div>
        <div>
          <p className="font-semibold text-[var(--ink)]">All {totalCycles} cycles complete</p>
          <p className="text-sm text-ink-muted mt-1">You did great. Take a moment before moving on.</p>
        </div>
        <button
          onClick={() => onComplete({ cyclesCompleted: totalCycles, phases: phases.map(p => p.label) })}
          className="btn-primary"
        >
          Claim +{xpReward} XP →
        </button>
      </div>
    )
  }

  if (!started) {
    return (
      <div className="text-center space-y-5 py-4">
        {/* Preview circle */}
        <div className="relative w-44 h-44 mx-auto">
          <div
            className="absolute inset-0 rounded-full transition-all duration-1000"
            style={{ background: phaseColor.bg, transform: 'scale(0.75)' }}
          />
          <div
            className="absolute inset-0 rounded-full border-4 flex items-center justify-center"
            style={{ borderColor: phaseColor.ring, transform: 'scale(0.75)' }}
          >
            <div className="text-center">
              <p className="font-display font-semibold text-[var(--ink)] text-lg">{totalCycles}</p>
              <p className="text-xs text-ink-muted">cycles</p>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <p className="font-semibold text-[var(--ink)]">Ready to begin?</p>
          <p className="text-sm text-ink-muted">Find a comfortable position and follow the circle</p>
        </div>

        {/* Phase preview */}
        <div className="flex justify-center gap-3 flex-wrap">
          {phases.map((p, i) => (
            <div key={i} className="text-center">
              <div className="text-xs font-semibold text-ink-light">{p.label}</div>
              <div className="text-2xs text-ink-muted">{p.duration}s</div>
            </div>
          ))}
        </div>

        <button onClick={() => setStarted(true)} className="btn-primary">
          Start breathing
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      {/* Cycle counter */}
      <div className="flex items-center gap-2">
        {Array.from({ length: totalCycles }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i < cycleCount
                ? 'bg-forest-500'
                : i === cycleCount
                ? 'bg-forest-300'
                : 'bg-ink-faint'
            }`}
          />
        ))}
        <span className="text-xs text-ink-muted ml-1">Cycle {cycleCount + 1} of {totalCycles}</span>
      </div>

      {/* Animated circle */}
      <div className="relative w-52 h-52">
        {/* Outer pulse ring */}
        <div
          className="absolute inset-0 rounded-full transition-all"
          style={{
            background: phaseColor.bg,
            transform: `scale(${scale})`,
            transition: 'transform 1s ease-in-out, background 0.5s ease',
          }}
        />
        {/* Main ring */}
        <div
          className="absolute inset-0 rounded-full border-4 flex flex-col items-center justify-center"
          style={{
            borderColor: phaseColor.ring,
            transform: `scale(${scale})`,
            transition: 'transform 1s ease-in-out, border-color 0.5s ease',
          }}
        >
          <p className={`font-display font-semibold text-xl ${phaseColor.text} transition-colors duration-500`}>
            {phase.label}
          </p>
          <p className="text-3xl font-display font-bold text-[var(--ink)]">{secondsLeft}</p>
        </div>
      </div>

      {/* Instruction text */}
      <p className="text-sm text-ink-muted text-center max-w-xs transition-all duration-500">
        {phase.instruction}
      </p>

      {/* Phase indicators */}
      <div className="flex gap-2">
        {phases.map((p, i) => (
          <div
            key={i}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
              i === phaseIndex
                ? 'bg-forest-500 text-white shadow-sm'
                : 'bg-[var(--card-bg)] text-ink-muted border border-[var(--card-border)]'
            }`}
          >
            {p.label} {p.duration}s
          </div>
        ))}
      </div>
    </div>
  )
}