// CBTForm.jsx
// Multi-step CBT thought record form.
// Each step is one screen — user can't skip ahead.
// Slider steps replace text input for belief rating (0–100).
// Props:
//   config     — { steps: [{id, label, placeholder, minWords, type?}] }
//   onComplete — fn(completionData)

import { useState, useMemo } from 'react'

function wordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length
}

function getBeliefLabel(value) {
  if (value >= 90) return 'Extremely strong'
  if (value >= 70) return 'Strong'
  if (value >= 50) return 'Moderate'
  if (value >= 30) return 'Some doubt'
  if (value >= 10) return 'Weak'
  return 'Almost none'
}

function getBeliefColor(value) {
  if (value >= 70) return 'text-red-600 dark:text-red-400'
  if (value >= 40) return 'text-amber-600 dark:text-amber-400'
  return 'text-forest-600 dark:text-forest-400'
}

export default function CBTForm({ config, onComplete }) {
  const { steps } = config
  const [currentStep, setCurrentStep] = useState(0)
  const [values, setValues] = useState(
    Object.fromEntries(steps.map(s => [s.id, s.type === 'slider' ? 50 : '']))
  )

  const step = steps[currentStep]
  const isSlider = step.type === 'slider'
  const isLast = currentStep === steps.length - 1

  const currentValue = values[step.id]
  const wordsMet = isSlider
    ? true
    : wordCount(String(currentValue)) >= (step.minWords || 0)

  const handleNext = () => {
    if (!wordsMet) return
    if (isLast) {
      onComplete({ answers: values, stepsCompleted: steps.length })
    } else {
      setCurrentStep(s => s + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep(s => Math.max(0, s - 1))
  }

  // Progress dots
  const progress = Math.round(((currentStep + 1) / steps.length) * 100)

  return (
    <div className="space-y-5">
      {/* Step progress */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-ink-muted">
          <span>Step {currentStep + 1} of {steps.length}</span>
          <span>{progress}% complete</span>
        </div>
        <div className="h-1.5 bg-ink-faint rounded-full overflow-hidden">
          <div
            className="h-full bg-sage-500 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex gap-1">
          {steps.map((s, i) => (
            <div
              key={i}
              className={`flex-1 h-1 rounded-full transition-all duration-300 ${
                i < currentStep
                  ? 'bg-sage-500'
                  : i === currentStep
                  ? 'bg-sage-300'
                  : 'bg-ink-faint'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Step label + description */}
      <div className="space-y-1 animate-fade-in">
        <h3 className="font-semibold text-[var(--ink)] text-sm">{step.label}</h3>
        {step.tip && (
          <p className="text-xs text-ink-muted">{step.tip}</p>
        )}
      </div>

      {/* Input area */}
      <div className="animate-fade-in">
        {isSlider ? (
          <div className="space-y-4">
            {/* Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-ink-muted">0 — No belief</span>
                <span className="text-xs text-ink-muted">100 — Absolute certainty</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="1"
                value={currentValue}
                onChange={e => setValues(v => ({ ...v, [step.id]: Number(e.target.value) }))}
                className="w-full accent-sage-500"
              />
              {/* Value display */}
              <div className="flex items-center justify-center gap-3">
                <span className={`font-display font-bold text-5xl ${getBeliefColor(currentValue)}`}>
                  {currentValue}
                </span>
                <div>
                  <p className={`text-sm font-semibold ${getBeliefColor(currentValue)}`}>
                    {getBeliefLabel(currentValue)}
                  </p>
                  <p className="text-xs text-ink-muted">belief strength</p>
                </div>
              </div>
            </div>

            {/* Contextual note for post-CBT belief */}
            {step.id === 'belief_after' && values['belief'] !== undefined && (
              <div className={`rounded-xl px-4 py-3 text-sm ${
                currentValue < values['belief']
                  ? 'bg-forest-50 dark:bg-forest-900/20 text-forest-700 dark:text-forest-300'
                  : 'bg-amber-50 dark:bg-amber-900/15 text-amber-700 dark:text-amber-300'
              }`}>
                {currentValue < values['belief']
                  ? `↓ Down from ${values['belief']} — that's the CBT working. Great job.`
                  : currentValue === values['belief']
                  ? `Same as before (${values['belief']}). That's okay — noticing the thought is step one.`
                  : `↑ Up from ${values['belief']}. That's fine — this process takes practice.`
                }
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <textarea
              rows={step.minWords >= 20 ? 5 : 3}
              value={currentValue}
              onChange={e => setValues(v => ({ ...v, [step.id]: e.target.value }))}
              placeholder={step.placeholder}
              className="input resize-none leading-relaxed"
            />
            {step.minWords > 0 && (
              <div className="flex items-center justify-between">
                <div className="h-0.5 flex-1 bg-ink-faint rounded-full overflow-hidden mr-3">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      wordsMet ? 'bg-sage-500' : 'bg-amber-400'
                    }`}
                    style={{ width: `${Math.min((wordCount(String(currentValue)) / step.minWords) * 100, 100)}%` }}
                  />
                </div>
                <span className={`text-xs font-medium flex-shrink-0 ${wordsMet ? 'text-sage-600 dark:text-sage-400' : 'text-ink-muted'}`}>
                  {wordCount(String(currentValue))} / {step.minWords} words {wordsMet && '✓'}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handleBack}
          disabled={currentStep === 0}
          className="btn-ghost btn-sm disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ← Back
        </button>
        <button
          onClick={handleNext}
          disabled={!wordsMet}
          className={`btn-sm disabled:opacity-40 disabled:cursor-not-allowed ${
            isLast ? 'btn-primary' : 'btn-secondary'
          }`}
        >
          {isLast ? 'Complete quest →' : 'Next step →'}
        </button>
      </div>
    </div>
  )
}