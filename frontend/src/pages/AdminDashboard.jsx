import { useState, useEffect, useCallback } from 'react'
import {
  getAdminStats,
  getAllUsers,
  addEmployee,
  toggleUserStatus,
  deleteUser,
  sendAlert,
  exportCSV,
} from '../services/adminService'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import LoadingSpinner from '../components/LoadingSpinner'
import StatCard from '../components/StatCard'

ChartJS.register(ArcElement, Tooltip, Legend)

const TABS = ['Overview', 'Users', 'At Risk']

export default function AdminDashboard() {
  const [tab, setTab] = useState('Overview')
  const [stats, setStats] = useState(null)
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [alertModal, setAlertModal] = useState(null)
  const [alertMsg, setAlertMsg] = useState('')
  const [actionLoading, setActionLoading] = useState(null)
  const [toast, setToast] = useState('')
  const [newEmp, setNewEmp] = useState({ name: '', email: '', password: '' })
  const [addError, setAddError] = useState('')

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [statsRes, usersRes] = await Promise.all([getAdminStats(), getAllUsers()])
      setStats(statsRes.data.stats)
      setUsers(usersRes.data.users)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleToggle = async (id) => {
    setActionLoading(id + 'toggle')
    try {
      await toggleUserStatus(id)
      await fetchData()
      showToast('User status updated')
    } catch { showToast('Failed to update status') }
    finally { setActionLoading(null) }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return
    setActionLoading(id + 'delete')
    try {
      await deleteUser(id)
      await fetchData()
      showToast('User deleted')
    } catch { showToast('Failed to delete user') }
    finally { setActionLoading(null) }
  }

  const handleSendAlert = async () => {
    if (!alertMsg.trim()) return
    setActionLoading('alert')
    try {
      await sendAlert(alertModal._id, alertMsg)
      setAlertModal(null)
      setAlertMsg('')
      showToast(`Alert sent to ${alertModal.name}`)
    } catch { showToast('Failed to send alert') }
    finally { setActionLoading(null) }
  }

  const handleAddEmployee = async () => {
    setAddError('')
    if (!newEmp.name || !newEmp.email || !newEmp.password) {
      setAddError('All fields are required')
      return
    }
    if (newEmp.password.length < 6) {
      setAddError('Password must be at least 6 characters')
      return
    }
    setActionLoading('add')
    try {
      await addEmployee(newEmp)
      setShowAddModal(false)
      setNewEmp({ name: '', email: '', password: '' })
      await fetchData()
      showToast('Employee added successfully')
    } catch (err) {
      setAddError(err.response?.data?.message || 'Failed to add employee')
    } finally { setActionLoading(null) }
  }

  const handleExport = async () => {
    try {
      const res = await exportCSV()
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = 'mentalxp-users.csv'
      a.click()
      window.URL.revokeObjectURL(url)
      showToast('CSV exported')
    } catch { showToast('Export failed') }
  }

  if (loading) return <LoadingSpinner />
  if (error) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="card text-center max-w-sm">
        <p className="text-4xl mb-3">⚠️</p>
        <p className="text-textSecondary">{error}</p>
      </div>
    </div>
  )

  const atRiskUsers = users.filter(u => u.burnoutRisk)
  const displayUsers = tab === 'At Risk' ? atRiskUsers : users

  const doughnutData = {
    labels: ['At Risk', 'Healthy'],
    datasets: [{
      data: [stats.burnoutRiskPercentage, 100 - stats.burnoutRiskPercentage],
      backgroundColor: ['#EF4444', '#22D3EE'],
      borderWidth: 1,
    }],
  }

  return (
    <div className="max-w-6xl space-y-6">

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-pulse">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-3xl text-textPrimary dark:text-white">Admin Dashboard</h1>
          <p className="text-textSecondary mt-1">Manage your team and monitor wellness</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExport} className="btn-secondary flex items-center gap-2 text-sm">
            📥 Export CSV
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn-primary flex items-center gap-2 text-sm">
            ➕ Add Employee
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Users" value={stats.totalUsers} icon="👥" sub="Registered" color="primary" />
        <StatCard label="Active (7d)" value={stats.activeUsers} icon="📊" sub="Last 7 days" color="secondary" />
        <StatCard label="Avg Mood" value={`${stats.averageMood}/10`} icon="😊" sub="Last 7 days" color="accent" />
        <StatCard label="Burnout Risk" value={`${stats.burnoutRiskPercentage}%`} icon="⚠️" sub={`${atRiskUsers.length} users`} color={stats.burnoutRiskPercentage > 30 ? 'red' : 'green'} />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-100 dark:border-slate-800">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-all ${
              tab === t
                ? 'border-primary text-primary'
                : 'border-transparent text-textSecondary hover:text-textPrimary dark:hover:text-white'
            }`}
          >
            {t} {t === 'At Risk' && atRiskUsers.length > 0 && (
              <span className="ml-1.5 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{atRiskUsers.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'Overview' && (
        <div className="grid grid-cols-2 gap-6">
          <div className="card">
            <h3 className="font-display font-semibold text-textPrimary dark:text-white mb-6">Burnout Distribution</h3>
            <div className="max-w-xs mx-auto">
              <Doughnut data={doughnutData} options={{ responsive: true, plugins: { legend: { position: 'bottom' } }, cutout: '70%' }} />
            </div>
          </div>
          <div className="card space-y-5">
            <h3 className="font-display font-semibold text-textPrimary dark:text-white">Platform Health</h3>
            {[
              { label: 'User Engagement (7d)', value: stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0, color: 'from-primary to-secondary' },
              { label: 'Average Mood Score', value: (stats.averageMood / 10) * 100, display: `${stats.averageMood}/10`, color: 'from-accent to-primary' },
              { label: 'Burnout Risk', value: stats.burnoutRiskPercentage, color: 'from-orange-400 to-red-500' },
            ].map(bar => (
              <div key={bar.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-textSecondary">{bar.label}</span>
                  <span className="font-semibold text-textPrimary dark:text-white">{bar.display || `${bar.value}%`}</span>
                </div>
                <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${bar.color} rounded-full`} style={{ width: `${bar.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users / At Risk Tabs */}
      {(tab === 'Users' || tab === 'At Risk') && (
        <div className="card p-0 overflow-hidden">
          {displayUsers.length === 0 ? (
            <div className="p-12 text-center text-textSecondary">
              {tab === 'At Risk' ? 'No users at burnout risk 🎉' : 'No users found'}
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  {['Employee', 'XP / Level', 'Streak', 'Avg Mood', 'Status', 'Risk', 'Actions'].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-textSecondary uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {displayUsers.map(user => (
                  <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-textPrimary dark:text-white">{user.name}</p>
                          <p className="text-xs text-textSecondary">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-textPrimary dark:text-white">{user.xp} XP</p>
                      <p className="text-xs text-textSecondary">Level {user.level}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-textPrimary dark:text-white">{user.streak} 🔥</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`font-semibold ${user.avgMood >= 7 ? 'text-emerald-500' : user.avgMood >= 4 ? 'text-amber-500' : 'text-red-500'}`}>
                        {user.avgMood !== null ? `${user.avgMood}/10` : '—'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        user.isActive
                          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {user.burnoutRisk ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400">
                          ⚠️ At Risk
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                          ✓ Healthy
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setAlertModal(user)}
                          className="p-1.5 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                          title="Send Alert"
                        >
                          🔔
                        </button>
                        <button
                          onClick={() => handleToggle(user._id)}
                          disabled={actionLoading === user._id + 'toggle'}
                          className="p-1.5 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-900/20 text-amber-500 transition-colors"
                          title={user.isActive ? 'Deactivate' : 'Activate'}
                        >
                          {user.isActive ? '⏸' : '▶️'}
                        </button>
                        <button
                          onClick={() => handleDelete(user._id, user.name)}
                          disabled={actionLoading === user._id + 'delete'}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-colors"
                          title="Delete User"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="font-display font-bold text-xl text-textPrimary dark:text-white mb-5">Add Employee</h2>
            {addError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-600 dark:text-red-400 text-sm">
                {addError}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-textPrimary dark:text-slate-200 mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  value={newEmp.name}
                  onChange={e => setNewEmp({ ...newEmp, name: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-textPrimary dark:text-slate-200 mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="jane@company.com"
                  value={newEmp.email}
                  onChange={e => setNewEmp({ ...newEmp, email: e.target.value })}
                  className="input"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-textPrimary dark:text-slate-200 mb-1.5">Temporary Password</label>
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  value={newEmp.password}
                  onChange={e => setNewEmp({ ...newEmp, password: e.target.value })}
                  className="input"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={handleAddEmployee} disabled={actionLoading === 'add'} className="btn-primary flex-1 disabled:opacity-60">
                {actionLoading === 'add' ? 'Adding...' : 'Add Employee'}
              </button>
              <button onClick={() => { setShowAddModal(false); setAddError(''); setNewEmp({ name: '', email: '', password: '' }) }} className="btn-secondary flex-1">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send Alert Modal */}
      {alertModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="font-display font-bold text-xl text-textPrimary dark:text-white mb-1">Send Alert</h2>
            <p className="text-textSecondary text-sm mb-5">To: <span className="font-semibold text-textPrimary dark:text-white">{alertModal.name}</span></p>
            <textarea
              rows={4}
              placeholder="Type your message here..."
              value={alertMsg}
              onChange={e => setAlertMsg(e.target.value)}
              className="input resize-none"
            />
            <div className="flex gap-3 mt-4">
              <button onClick={handleSendAlert} disabled={actionLoading === 'alert' || !alertMsg.trim()} className="btn-primary flex-1 disabled:opacity-60">
                {actionLoading === 'alert' ? 'Sending...' : 'Send Alert 🔔'}
              </button>
              <button onClick={() => { setAlertModal(null); setAlertMsg('') }} className="btn-secondary flex-1">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}