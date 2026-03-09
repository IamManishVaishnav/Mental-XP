import { useState } from 'react'
import { markAlertsRead } from '../services/userService'

const BellIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
)

export default function AlertBell({ alerts = [], unreadCount = 0, onRead }) {
  const [open, setOpen] = useState(false)

  const handleOpen = async () => {
    setOpen(true)
    if (unreadCount > 0) {
      try { await markAlertsRead(); onRead() } catch {}
    }
  }

  return (
    <div className="relative">
      <button
        onClick={open ? () => setOpen(false) : handleOpen}
        className="sidebar-link w-full relative"
      >
        <span className="w-[18px] h-[18px] flex-shrink-0 opacity-80 relative">
          <BellIcon />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[var(--sidebar-bg)]" />
          )}
        </span>
        <span>Alerts</span>
        {unreadCount > 0 && (
          <span className="ml-auto badge badge-red text-2xs">{unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="absolute bottom-full left-0 w-72 mb-2 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl shadow-lifted z-50 overflow-hidden animate-scale-in">
          <div className="px-4 py-3 border-b border-[var(--card-border)] flex items-center justify-between">
            <h3 className="font-semibold text-sm text-[var(--ink)]">Alerts</h3>
            <button onClick={() => setOpen(false)} className="text-ink-muted hover:text-ink text-xs">Close</button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {alerts.length === 0 ? (
              <p className="text-ink-muted text-sm text-center py-8">No alerts yet</p>
            ) : (
              [...alerts].reverse().map((alert, i) => (
                <div
                  key={i}
                  className={`px-4 py-3 border-b border-[var(--card-border)] last:border-0 ${!alert.read ? 'bg-forest-50 dark:bg-forest-900/15' : ''}`}
                >
                  {!alert.read && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-forest-500" />
                      <span className="text-2xs font-semibold text-forest-600 dark:text-forest-400">New</span>
                    </div>
                  )}
                  <p className="text-sm text-[var(--ink)] leading-relaxed">{alert.message}</p>
                  <p className="text-2xs text-ink-muted mt-1">
                    {new Date(alert.sentAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
