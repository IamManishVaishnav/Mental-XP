export default function BurnoutBanner() {
  return (
    <div className="rounded-2xl bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 p-4 flex items-start gap-4">
      <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
        <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
        </svg>
      </div>
      <div>
        <h4 className="font-display font-bold text-red-600 dark:text-red-400">Burnout Risk Detected</h4>
        <p className="text-sm text-textSecondary dark:text-slate-400 mt-0.5">
          Your recent mood scores are lower than usual or you have not completed a quest in over 3 days. Consider starting with a short breathing exercise today.
        </p>
      </div>
    </div>
  )
}