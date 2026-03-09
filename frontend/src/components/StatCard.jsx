export default function StatCard({ label, value, sub, icon, color = 'forest' }) {
  const themes = {
    forest:    { ring: 'ring-forest-200 dark:ring-forest-900/40',   icon: 'bg-forest-100 dark:bg-forest-900/30 text-forest-600 dark:text-forest-400',   val: 'text-forest-600 dark:text-forest-400' },
    amber:     { ring: 'ring-amber-200 dark:ring-amber-900/40',     icon: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',       val: 'text-amber-600 dark:text-amber-400' },
    sage:      { ring: 'ring-sage-200 dark:ring-sage-900/40',       icon: 'bg-sage-100 dark:bg-sage-900/30 text-sage-600 dark:text-sage-400',           val: 'text-sage-600 dark:text-sage-400' },
    red:       { ring: 'ring-red-200 dark:ring-red-900/40',         icon: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',               val: 'text-red-600 dark:text-red-400' },
    green:     { ring: 'ring-emerald-200 dark:ring-emerald-900/40', icon: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400', val: 'text-emerald-600 dark:text-emerald-400' },
    secondary: { ring: 'ring-forest-200 dark:ring-forest-900/40',   icon: 'bg-forest-100 dark:bg-forest-900/30 text-forest-600 dark:text-forest-400',   val: 'text-forest-600 dark:text-forest-400' },
    accent:    { ring: 'ring-amber-200 dark:ring-amber-900/40',     icon: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',       val: 'text-amber-600 dark:text-amber-400' },
    primary:   { ring: 'ring-forest-200 dark:ring-forest-900/40',   icon: 'bg-forest-100 dark:bg-forest-900/30 text-forest-600 dark:text-forest-400',   val: 'text-forest-600 dark:text-forest-400' },
  }
  const t = themes[color] || themes.forest

  return (
    <div className={`card ring-1 ${t.ring} hover:-translate-y-0.5 hover:shadow-lifted transition-all duration-200 animate-fade-up`}>
      <div className="flex items-start justify-between mb-4">
        <p className="section-label">{label}</p>
        {icon && (
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${t.icon}`}>
            {icon}
          </div>
        )}
      </div>
      <p className={`font-display text-3xl font-semibold ${t.val} leading-none`}>{value}</p>
      {sub && <p className="text-xs text-ink-muted mt-1.5">{sub}</p>}
    </div>
  )
}
