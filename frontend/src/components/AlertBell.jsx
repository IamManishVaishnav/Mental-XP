import { useState } from 'react'
import { markAlertsRead } from '../services/userService'

const BellIcon = ({ hasUnread }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    {hasUnread && <circle cx="18" cy="6" r="4" fill="#EF4444" stroke="none" />}
  </svg>
)

export default function AlertBell({ alerts = [], unreadCount = 0, onRead }) {
  const [open, setOpen] = useState(false)

  const handleOpen = async () => {
    setOpen(true)
    if (unreadCount > 0) {
      try {
        await markAlertsRead()
        onRead()
      } catch {}
    }
  }

  return (
    <div className="relative">
      <button
        onClick={open ? () => setOpen(false) : handleOpen}
        className="sidebar-link w-full relative"
      >
        <span className="w-5 h-5 flex-shrink-0">
          <BellIcon hasUnread={unreadCount > 0} />
        </span>
        <span>Alerts</span>
        {unreadCount > 0 && (
          <span className="ml-auto bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute bottom-full left-0 w-72 mb-2 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl shadow-xl z-50 overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-textPrimary dark:text-white">
              Alerts from Admin
            </h3>
            <button
              onClick={() => setOpen(false)}
              className="text-textSecondary hover:text-textPrimary text-xs font-semibold"
            >
              Close
            </button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {alerts.length === 0 ? (
              <p className="text-textSecondary text-sm text-center py-6">No alerts yet</p>
            ) : (
              [...alerts].reverse().map((alert, i) => (
                <div
                  key={i}
                  className={`p-4 border-b border-slate-50 dark:border-slate-700/50 last:border-0 ${!alert.read ? 'bg-primary/5' : ''}`}
                >
                  {!alert.read && (
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      <span className="text-xs font-semibold text-primary">New</span>
                    </div>
                  )}
                  <p className="text-sm text-textPrimary dark:text-white">{alert.message}</p>
                  <p className="text-xs text-textSecondary mt-1">
                    {new Date(alert.sentAt).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
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