export default function StatCard({ label, value, sub, color = 'primary' }) {
  const colorMap = {
    primary: 'from-primary/10 to-primary/5 border-primary/20',
    secondary: 'from-secondary/10 to-secondary/5 border-secondary/20',
    accent: 'from-accent/10 to-accent/5 border-accent/20',
    green: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20',
    red: 'from-red-500/10 to-red-500/5 border-red-500/20',
  }

  const dotColor = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
    accent: 'bg-accent',
    green: 'bg-emerald-500',
    red: 'bg-red-500',
  }

  return (
    <div className={`card bg-gradient-to-br ${colorMap[color]} hover:scale-[1.02] transition-transform duration-200`}>
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-textSecondary dark:text-slate-400">{label}</p>
        <div className={`w-2 h-2 rounded-full ${dotColor[color]} mt-1`} />
      </div>
      <p className="text-3xl font-display font-bold text-textPrimary dark:text-white">{value}</p>
      {sub && <p className="text-xs text-textSecondary dark:text-slate-400 mt-1">{sub}</p>}
    </div>
  )
}