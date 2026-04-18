// JournalEntry.jsx
// Renders one or more text prompts with word count validation.
// Complete button only activates when all prompts meet their minWords requirement.
// Props:
//   config     — { prompts: [{id, label, placeholder, minWords, multiline, rows, dailyRotation}], rotatingPrompts? }
//   onComplete — fn(completionData)

import { useState, useMemo } from 'react'

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function getTodayPrompt(rotatingPrompts) {
  if (!rotatingPrompts?.length) return null
  const dayIndex = new Date().getDay() // 0 = Sunday
  return rotatingPrompts[dayIndex % rotatingPrompts.length]
}

export default function JournalEntry({ config, onComplete }) {
  const { prompts, rotatingPrompts } = config

  // Replace placeholder for daily-rotation prompts
  const resolvedPrompts = useMemo(() => {
    const todayPrompt = getTodayPrompt(rotatingPrompts)
    return prompts.map(p => {
      if (p.dailyRotation && todayPrompt) {
        return { ...p, placeholder: todayPrompt }
      }
      return p
    })
  }, [prompts, rotatingPrompts])

  const [values, setValues] = useState(
    Object.fromEntries(resolvedPrompts.map(p => [p.id, '']))
  )

  const counts = useMemo(() =>
    Object.fromEntries(resolvedPrompts.map(p => [p.id, wordCount(values[p.id])])),
    [values, resolvedPrompts]
  )

  const allMet = resolvedPrompts.every(p => counts[p.id] >= (p.minWords || 0))

  const handleSubmit = () => {
    if (!allMet) return
    onComplete({
      entries: Object.fromEntries(resolvedPrompts.map(p => [p.id, values[p.id].trim()])),
      totalWords: Object.values(counts).reduce((a, b) => a + b, 0),
    })
  }

  return (
    <div className="space-y-5">
      {resolvedPrompts.map((prompt) => {
        const count = counts[prompt.id]
        const required = prompt.minWords || 0
        const met = count >= required
        const pct = required ? Math.min((count / required) * 100, 100) : 100

        return (
          <div key={prompt.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-[var(--ink)]">
                {prompt.label}
              </label>
              {required > 0 && (
                <span className={`text-xs font-medium transition-colors duration-300 ${
                  met ? 'text-forest-600 dark:text-forest-400' : 'text-ink-muted'
                }`}>
                  {count} / {required} words {met && '✓'}
                </span>
              )}
            </div>

            {prompt.multiline ? (
              <textarea
                rows={prompt.rows || 4}
                value={values[prompt.id]}
                onChange={e => setValues(v => ({ ...v, [prompt.id]: e.target.value }))}
                placeholder={prompt.placeholder}
                className="input resize-none leading-relaxed"
              />
            ) : (
              <input
                type="text"
                value={values[prompt.id]}
                onChange={e => setValues(v => ({ ...v, [prompt.id]: e.target.value }))}
                placeholder={prompt.placeholder}
                className="input"
              />
            )}

            {/* Word count progress bar */}
            {required > 0 && (
              <div className="h-0.5 bg-ink-faint rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    met ? 'bg-forest-500' : 'bg-amber-400'
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            )}
          </div>
        )
      })}

      {/* Submit */}
      <div className="pt-2 flex items-center justify-between">
        <p className="text-xs text-ink-muted">
          {allMet
            ? 'Everything looks good — ready to complete!'
            : 'Fill in all fields to unlock completion'}
        </p>
        <button
          onClick={handleSubmit}
          disabled={!allMet}
          className="btn-primary btn-sm disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Complete quest →
        </button>
      </div>
    </div>
  )
}