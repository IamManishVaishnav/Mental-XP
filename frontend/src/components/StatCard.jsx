export default function StatCard({ label, value, icon, sub, color = 'primary' }) {
  const colorMap = {
    primary: 'from-primary/10 to-primary/5 border-primary/20',
    secondary: 'from-secondary/10 to-secondary/5 border-secondary/20',
    accent: 'from-accent/10 to-accent/5 border-accent/20',
    green: 'from-emerald-500/10 to-emerald-500/5 border-emerald-500/20',
    red: 'from-red-500/10 to-red-500/5 border-red-500/20',
  }

  return (
    <div className={`card bg-gradient-to-br ${colorMap[color]} hover:scale-[1.02] transition-transform duration-200`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-textSecondary dark:text-slate-400 mb-1">{label}</p>
          <p className="text-3xl font-display font-bold text-textPrimary dark:text-white">{value}</p>
          {sub && <p className="text-xs text-textSecondary dark:text-slate-400 mt-1">{sub}</p>}
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  )
}