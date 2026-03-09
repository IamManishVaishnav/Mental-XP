export default function BurnoutBanner({ onDismiss }) {
  return (
    <div className="rounded-2xl bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800/50 p-4 flex items-start gap-4 animate-fade-up">
      <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0 mt-0.5">
        <span className="text-lg">🌿</span>
      </div>
      <div className="flex-1">
        <h4 className="font-semibold text-amber-800 dark:text-amber-300 text-sm">Heads up — you might need a break</h4>
        <p className="text-xs text-amber-700 dark:text-amber-400 mt-0.5 leading-relaxed">
          Your recent mood scores are lower than usual, or you haven't completed a quest in a few days.
          Start with something gentle — a breathing exercise takes just 5 minutes.
        </p>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 text-xs font-semibold flex-shrink-0 transition-colors"
        >
          Dismiss
        </button>
      )}
    </div>
  )
}
