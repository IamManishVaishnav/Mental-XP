export default function BurnoutBanner() {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 p-4 flex items-start gap-4">
      <div className="text-2xl">⚠️</div>
      <div>
        <h4 className="font-display font-bold text-red-600 dark:text-red-400">Burnout Risk Detected</h4>
        <p className="text-sm text-textSecondary dark:text-slate-400 mt-0.5">
          Your recent mood scores are lower than usual, or you haven't completed a quest in over 3 days. Take a moment for yourself — start with a breathing exercise.
        </p>
      </div>
    </div>
  )
}