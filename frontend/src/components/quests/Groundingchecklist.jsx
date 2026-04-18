// GroundingChecklist.jsx
// Renders the 5-4-3-2-1 grounding exercise as an interactive checklist.
// Each sense has N input slots. All slots must be filled to complete.
// Props:
//   config     — { senses: [{id, count, emoji, label, placeholder}] }
//   onComplete — fn(completionData)

import { useState, useMemo } from 'react'

export default function GroundingChecklist({ config, onComplete }) {
  const { senses } = config

  // Build initial state: { seeId: ['','','','',''], touchId: ['','','',''], ... }
  const [entries, setEntries] = useState(
    Object.fromEntries(senses.map(s => [s.id, Array(s.count).fill('')]))
  )

  const totalSlots = senses.reduce((sum, s) => sum + s.count, 0)
  const filledSlots = useMemo(() =>
    Object.values(entries).flat().filter(v => v.trim().length > 0).length,
    [entries]
  )

  const allFilled = filledSlots === totalSlots

  const handleChange = (senseId, index, value) => {
    setEntries(prev => {
      const arr = [...prev[senseId]]
      arr[index] = value
      return { ...prev, [senseId]: arr }
    })
  }

  const handleComplete = () => {
    onComplete({
      entries: Object.fromEntries(senses.map(s => [s.id, entries[s.id]])),
      totalFilled: filledSlots,
    })
  }

  return (
    <div className="space-y-5">
      {/* Overall progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-ink-faint rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500"
            style={{ width: `${(filledSlots / totalSlots) * 100}%` }}
          />
        </div>
        <span className="text-xs font-medium text-ink-muted flex-shrink-0">
          {filledSlots} / {totalSlots} filled
        </span>
      </div>

      {/* Sense sections */}
      {senses.map((sense) => {
        const filled = entries[sense.id].filter(v => v.trim()).length
        const complete = filled === sense.count

        return (
          <div key={sense.id} className={`rounded-xl p-4 border transition-all duration-300 ${
            complete
              ? 'bg-blue-50 dark:bg-blue-900/15 border-blue-200 dark:border-blue-900/30'
              : 'bg-[var(--card-bg)] border-[var(--card-border)]'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{sense.emoji}</span>
                <span className="text-sm font-semibold text-[var(--ink)]">{sense.label}</span>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full transition-all duration-300 ${
                complete
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'bg-ink-faint text-ink-muted'
              }`}>
                {filled}/{sense.count} {complete && '✓'}
              </span>
            </div>

            <div className="space-y-2">
              {entries[sense.id].map((val, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-ink-muted font-medium w-4 flex-shrink-0">{i + 1}.</span>
                  <input
                    type="text"
                    value={val}
                    onChange={e => handleChange(sense.id, i, e.target.value)}
                    placeholder={sense.placeholder}
                    className="input py-2 text-sm"
                  />
                </div>
              ))}
            </div>
          </div>
        )
      })}

      {/* Closing breath prompt */}
      {allFilled && (
        <div className="rounded-xl bg-forest-50 dark:bg-forest-900/20 border border-forest-200 dark:border-forest-900/40 px-4 py-3 text-sm text-forest-700 dark:text-forest-300 animate-fade-in">
          🌬️ Take one slow, deep breath now. Notice how you feel compared to when you started.
        </div>
      )}

      {/* Complete button */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-ink-muted">
          {allFilled ? 'All senses covered — beautifully done.' : `${totalSlots - filledSlots} more to fill`}
        </p>
        <button
          onClick={handleComplete}
          disabled={!allFilled}
          className="btn-primary btn-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Complete quest →
        </button>
      </div>
    </div>
  )
}