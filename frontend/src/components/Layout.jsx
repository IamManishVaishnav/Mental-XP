import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import { getDashboard } from '../services/dashboardService'
import { useAuth } from '../context/AuthContext'

export default function Layout({ children }) {
  const { user } = useAuth()
  const [alerts, setAlerts] = useState([])
  const [unreadAlertCount, setUnreadAlertCount] = useState(0)

  useEffect(() => {
    if (user?.role === 'admin') return
    getDashboard()
      .then(res => {
        setAlerts(res.data.dashboard.alerts || [])
        setUnreadAlertCount(res.data.dashboard.unreadAlertCount || 0)
      })
      .catch(() => {})
  }, [user])

  return (
    <div className="flex min-h-screen bg-[var(--cream)]">
      <Sidebar
        alerts={alerts}
        unreadAlertCount={unreadAlertCount}
        onAlertsRead={() => setUnreadAlertCount(0)}
      />
      <main className="flex-1 ml-60 min-h-screen overflow-y-auto">
        <div className="max-w-5xl mx-auto px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
