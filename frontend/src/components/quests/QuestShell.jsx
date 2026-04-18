// QuestShell.jsx
// Wraps every interactive quest component with a consistent header and layout.
// Props:
//   quest        — the quest object from the API
//   onComplete   — fn(completionData) called when user finishes
//   onCancel     — fn() called when user backs out
//   children     — the interactive quest UI

const CATEGORY_STYLES = {
  breathing: {
    bg: 'bg-forest-50 dark:bg-forest-900/20',
    border: 'border-forest-200 dark:border-forest-900/40',
    badge: 'bg-forest-100 dark:bg-forest-900/30 text-forest-700 dark:text-forest-300',
    icon: '🌬️',
  },
  gratitude: {
    bg: 'bg-amber-50 dark:bg-amber-900/15',
    border: 'border-amber-200 dark:border-amber-900/30',
    badge: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
    icon: '🙏',
  },
  reframe: {
    bg: 'bg-sage-50 dark:bg-sage-900/15',
    border: 'border-sage-200 dark:border-sage-900/30',
    badge: 'bg-sage-100 dark:bg-sage-900/30 text-sage-700 dark:text-sage-300',
    icon: '🔄',
  },
  grounding: {
    bg: 'bg-blue-50 dark:bg-blue-900/15',
    border: 'border-blue-200 dark:border-blue-900/30',
    badge: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    icon: '⚓',
  },
  journal: {
    bg: 'bg-purple-50 dark:bg-purple-900/15',
    border: 'border-purple-200 dark:border-purple-900/30',
    badge: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
    icon: '📓',
  },
}

export default function QuestShell({ quest, onCancel, children }) {
  const style = CATEGORY_STYLES[quest.category] || CATEGORY_STYLES.gratitude

  return (
    <div className={`rounded-2xl border ${style.bg} ${style.border} p-6 space-y-5 animate-scale-in`}>
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{style.icon}</span>
          <div>
            <h2 className="font-display font-semibold text-xl text-[var(--ink)]">{quest.title}</h2>
            <p className="text-xs text-ink-muted mt-0.5">{quest.durationMinutes} min · +{quest.xpReward} XP</p>
          </div>
        </div>
        <button
          onClick={onCancel}
          className="text-ink-muted hover:text-ink transition-colors text-sm font-medium flex-shrink-0"
        >
          ✕ Close
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-ink-light leading-relaxed border-t border-[var(--card-border)] pt-4">
        {quest.description}
      </p>

      {/* The interactive component renders here */}
      {children}
    </div>
  )
}