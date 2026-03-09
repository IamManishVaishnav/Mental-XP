export default function LoadingSpinner({ message = 'Loading…' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4 animate-fade-in">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-ink-faint dark:border-ink-faint/30" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-forest-500 animate-spin" />
      </div>
      <p className="text-sm text-ink-muted">{message}</p>
    </div>
  )
}
