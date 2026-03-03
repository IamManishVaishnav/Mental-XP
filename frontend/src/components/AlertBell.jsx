import { useState } from 'react'
import { markAlertsRead } from '../services/userService'

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
        <span className="text-xl">🔔</span>
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
            <h3 className="font-display font-bold text-sm text-textPrimary dark:text-white">Alerts from Admin</h3>
            <button onClick={() => setOpen(false)} className="text-textSecondary hover:text-textPrimary text-xs">✕</button>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {alerts.length === 0 ? (
              <p className="text-textSecondary text-sm text-center py-6">No alerts yet</p>
            ) : (
              [...alerts].reverse().map((alert, i) => (
                <div key={i} className={`p-4 border-b border-slate-50 dark:border-slate-700/50 last:border-0 ${!alert.read ? 'bg-primary/5' : ''}`}>
                  <p className="text-sm text-textPrimary dark:text-white">{alert.message}</p>
                  <p className="text-xs text-textSecondary mt-1">
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