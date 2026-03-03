import { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import { getDashboard } from '../services/dashboardService'
import { useAuth } from '../context/AuthContext'

export default function Layout({ children }) {
  const { user } = useAuth()
  const [alerts, setAlerts] = useState([])
  const [unreadAlertCount, setUnreadAlertCount] = useState(0)

  const fetchAlerts = async () => {
    if (user?.role === 'admin') return
    try {
      const res = await getDashboard()
      setAlerts(res.data.dashboard.alerts || [])
      setUnreadAlertCount(res.data.dashboard.unreadAlertCount || 0)
    } catch {}
  }

  useEffect(() => { fetchAlerts() }, [])

  return (
    <div className="flex min-h-screen bg-surface dark:bg-dark">
      <Sidebar
        alerts={alerts}
        unreadAlertCount={unreadAlertCount}
        onAlertsRead={() => setUnreadAlertCount(0)}
      />
      <main className="flex-1 ml-64 p-8 min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  )
}