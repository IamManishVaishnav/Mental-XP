import { useState, useEffect, useCallback } from 'react'
import {
  getAdminStats, getAllUsers, addEmployee,
  toggleUserStatus, deleteUser, sendAlert, exportCSV,
} from '../services/adminService'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import LoadingSpinner from '../components/LoadingSpinner'
import StatCard from '../components/StatCard'

ChartJS.register(ArcElement, Tooltip, Legend)

const TABS = ['Overview', 'All Users', 'At Risk']

// ── Toast ─────────────────────────────────────────────────────
function Toast({ message }) {
  return (
    <div className="fixed top-5 right-5 z-50 flex items-center gap-2.5 bg-ink-soft text-white px-4 py-3 rounded-xl shadow-lifted text-sm font-medium animate-fade-up">
      <span className="w-1.5 h-1.5 rounded-full bg-forest-400" />
      {message}
    </div>
  )
}

// ── Modal wrapper ─────────────────────────────────────────────
function Modal({ title, subtitle, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-ink/40 dark:bg-ink/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 w-full max-w-md shadow-lifted animate-scale-in" onClick={e => e.stopPropagation()}>
        <div className="mb-5">
          <h2 className="font-display font-semibold text-xl text-[var(--ink)]">{title}</h2>
          {subtitle && <p className="text-ink-muted text-sm mt-0.5">{subtitle}</p>}
        </div>
        {children}
      </div>
    </div>
  )
}

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

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const [sRes, uRes] = await Promise.all([getAdminStats(), getAllUsers()])
      setStats(sRes.data.stats)
      setUsers(uRes.data.users)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  const handleToggle = async (id) => {
    setActionLoading(id + 'toggle')
    try { await toggleUserStatus(id); await fetchData(); showToast('Status updated') }
    catch { showToast('Failed to update status') }
    finally { setActionLoading(null) }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return
    setActionLoading(id + 'delete')
    try { await deleteUser(id); await fetchData(); showToast('User deleted') }
    catch { showToast('Failed to delete user') }
    finally { setActionLoading(null) }
  }

  const handleSendAlert = async () => {
    if (!alertMsg.trim()) return
    setActionLoading('alert')
    try {
      await sendAlert(alertModal._id, alertMsg)
      setAlertModal(null); setAlertMsg('')
      showToast(`Alert sent to ${alertModal.name}`)
    } catch { showToast('Failed to send alert') }
    finally { setActionLoading(null) }
  }

  const handleAddEmployee = async () => {
    setAddError('')
    if (!newEmp.name || !newEmp.email || !newEmp.password) { setAddError('All fields are required'); return }
    if (newEmp.password.length < 6) { setAddError('Password must be at least 6 characters'); return }
    setActionLoading('add')
    try {
      await addEmployee(newEmp)
      setShowAddModal(false)
      setNewEmp({ name: '', email: '', password: '' })
      await fetchData()
      showToast('Employee added')
    } catch (err) { setAddError(err.response?.data?.message || 'Failed to add employee') }
    finally { setActionLoading(null) }
  }

  const handleExport = async () => {
    try {
      const res = await exportCSV()
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a'); a.href = url; a.download = 'mentalxp-users.csv'; a.click()
      window.URL.revokeObjectURL(url)
      showToast('CSV exported')
    } catch { showToast('Export failed') }
  }

  if (loading) return <LoadingSpinner />
  if (error) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="card text-center max-w-sm"><p className="text-ink-muted text-sm">{error}</p></div>
    </div>
  )

  const atRiskUsers = users.filter(u => u.burnoutRisk)
  const displayUsers = tab === 'At Risk' ? atRiskUsers : users

  const doughnutData = {
    labels: ['At Risk', 'Healthy'],
    datasets: [{
      data: [stats.burnoutRiskPercentage, 100 - stats.burnoutRiskPercentage],
      backgroundColor: ['#EF4444', '#2D6A4F'],
      borderWidth: 0,
      borderRadius: 4,
    }],
  }

  const doughnutOptions = {
    responsive: true,
    cutout: '72%',
    plugins: {
      legend: { position: 'bottom', labels: { font: { family: 'Geist', size: 12 }, color: '#A8A29E', padding: 16 } },
      tooltip: { backgroundColor: '#1C1917', titleFont: { family: 'Fraunces' }, bodyFont: { family: 'Geist' }, padding: 10, cornerRadius: 8 },
    },
  }

  return (
    <div className="space-y-6 animate-fade-up">
      {toast && <Toast message={toast} />}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-semibold text-3xl text-[var(--ink)]">Admin Dashboard</h1>
          <p className="text-ink-muted text-sm mt-1">Manage your team and monitor wellness</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="btn-secondary btn-sm">
            ↓ Export CSV
          </button>
          <button onClick={() => setShowAddModal(true)} className="btn-primary btn-sm">
            + Add Employee
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Users"  value={stats.totalUsers}                 icon="👥" sub="Registered"   color="forest" />
        <StatCard label="Active (7d)"  value={stats.activeUsers}                icon="📊" sub="Last 7 days"  color="sage" />
        <StatCard label="Avg Mood"     value={`${stats.averageMood}/10`}        icon="😊" sub="Last 7 days"  color="amber" />
        <StatCard label="Burnout Risk" value={`${stats.burnoutRiskPercentage}%`} icon="⚠️" sub={`${atRiskUsers.length} employees`} color={stats.burnoutRiskPercentage > 30 ? 'red' : 'green'} />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[var(--card-border)]">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} className={tab === t ? 'tab-active' : 'tab-default'}>
            {t}
            {t === 'At Risk' && atRiskUsers.length > 0 && (
              <span className="ml-1.5 badge badge-red">{atRiskUsers.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'Overview' && (
        <div className="grid grid-cols-2 gap-5">
          <div className="card">
            <h3 className="font-semibold text-[var(--ink)] mb-5">Burnout Distribution</h3>
            <div className="max-w-[220px] mx-auto">
              <Doughnut data={doughnutData} options={doughnutOptions} />
            </div>
          </div>
          <div className="card space-y-5">
            <h3 className="font-semibold text-[var(--ink)]">Platform Health</h3>
            {[
              { label: 'User Engagement (7d)', value: stats.totalUsers > 0 ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0, bar: 'bg-forest-500' },
              { label: 'Average Mood Score', value: Math.round((stats.averageMood / 10) * 100), display: `${stats.averageMood}/10`, bar: 'bg-amber-500' },
              { label: 'Burnout Risk', value: stats.burnoutRiskPercentage, bar: stats.burnoutRiskPercentage > 30 ? 'bg-red-500' : 'bg-forest-500' },
            ].map(bar => (
              <div key={bar.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-ink-muted">{bar.label}</span>
                  <span className="font-semibold text-[var(--ink)]">{bar.display || `${bar.value}%`}</span>
                </div>
                <div className="h-1.5 bg-ink-faint dark:bg-ink-faint/30 rounded-full overflow-hidden">
                  <div className={`h-full ${bar.bar} rounded-full transition-all duration-700`} style={{ width: `${bar.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Users table */}
      {(tab === 'All Users' || tab === 'At Risk') && (
        <div className="card p-0 overflow-hidden">
          {displayUsers.length === 0 ? (
            <div className="py-16 text-center text-ink-muted text-sm">
              {tab === 'At Risk' ? '🎉 No employees currently at burnout risk' : 'No users found'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--card-border)]">
                    {['Employee', 'XP / Level', 'Streak', 'Avg Mood', 'Status', 'Risk', 'Actions'].map(h => (
                      <th key={h} className="text-left px-5 py-3.5 section-label">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {displayUsers.map((user, idx) => (
                    <tr
                      key={user._id}
                      className={`border-b border-[var(--card-border)] last:border-0 hover:bg-cream-warm dark:hover:bg-ink-faint/10 transition-colors ${!user.isActive ? 'opacity-60' : ''}`}
                    >
                      {/* Name */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-forest-500 flex items-center justify-center text-white text-2xs font-bold flex-shrink-0">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold text-[var(--ink)] text-xs">{user.name}</p>
                            <p className="text-2xs text-ink-muted">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      {/* XP */}
                      <td className="px-5 py-4">
                        <p className="font-semibold text-[var(--ink)] text-xs">{user.xp} XP</p>
                        <p className="text-2xs text-ink-muted">Level {user.level}</p>
                      </td>
                      {/* Streak */}
                      <td className="px-5 py-4">
                        <span className="text-xs font-semibold text-[var(--ink)]">{user.streak} 🔥</span>
                      </td>
                      {/* Mood */}
                      <td className="px-5 py-4">
                        <span className={`text-xs font-semibold ${
                          user.avgMood === null ? 'text-ink-muted' :
                          user.avgMood >= 7 ? 'text-forest-600 dark:text-forest-400' :
                          user.avgMood >= 4 ? 'text-amber-600 dark:text-amber-400' : 'text-red-500'
                        }`}>
                          {user.avgMood !== null ? `${user.avgMood}/10` : '—'}
                        </span>
                      </td>
                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`badge ${user.isActive ? 'badge-forest' : 'badge-gray'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      {/* Risk */}
                      <td className="px-5 py-4">
                        <span className={`badge ${user.burnoutRisk ? 'badge-red' : 'badge-forest'}`}>
                          {user.burnoutRisk ? '⚠ At Risk' : '✓ Healthy'}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1">
                          <ActionBtn title="Send Alert" onClick={() => setAlertModal(user)} color="text-forest-600 dark:text-forest-400 hover:bg-forest-50 dark:hover:bg-forest-900/20">
                            🔔
                          </ActionBtn>
                          <ActionBtn
                            title={user.isActive ? 'Deactivate' : 'Activate'}
                            onClick={() => handleToggle(user._id)}
                            disabled={actionLoading === user._id + 'toggle'}
                            color="text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/15"
                          >
                            {user.isActive ? '⏸' : '▶'}
                          </ActionBtn>
                          <ActionBtn
                            title="Delete User"
                            onClick={() => handleDelete(user._id, user.name)}
                            disabled={actionLoading === user._id + 'delete'}
                            color="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/15"
                          >
                            🗑
                          </ActionBtn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Add Employee Modal */}
      {showAddModal && (
        <Modal title="Add Employee" onClose={() => { setShowAddModal(false); setAddError(''); setNewEmp({ name: '', email: '', password: '' }) }}>
          {addError && (
            <div className="mb-4 px-3 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
              {addError}
            </div>
          )}
          <div className="space-y-3.5">
            {[
              { label: 'Full Name', name: 'name', type: 'text', placeholder: 'Jane Doe' },
              { label: 'Email', name: 'email', type: 'email', placeholder: 'jane@company.com' },
              { label: 'Temporary Password', name: 'password', type: 'password', placeholder: 'Min. 6 characters' },
            ].map(f => (
              <div key={f.name}>
                <label className="block text-xs font-semibold text-ink-light mb-1.5 uppercase tracking-wide">{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={newEmp[f.name]}
                  onChange={e => setNewEmp({ ...newEmp, [f.name]: e.target.value })}
                  className="input"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-2.5 mt-5">
            <button onClick={handleAddEmployee} disabled={actionLoading === 'add'} className="btn-primary flex-1 disabled:opacity-50">
              {actionLoading === 'add' ? 'Adding…' : 'Add Employee'}
            </button>
            <button onClick={() => { setShowAddModal(false); setAddError('') }} className="btn-secondary flex-1">Cancel</button>
          </div>
        </Modal>
      )}

      {/* Send Alert Modal */}
      {alertModal && (
        <Modal title="Send Alert" subtitle={`To: ${alertModal.name}`} onClose={() => { setAlertModal(null); setAlertMsg('') }}>
          <textarea
            rows={4}
            placeholder="Type a message to this employee…"
            value={alertMsg}
            onChange={e => setAlertMsg(e.target.value)}
            className="input resize-none"
          />
          <div className="flex gap-2.5 mt-4">
            <button onClick={handleSendAlert} disabled={actionLoading === 'alert' || !alertMsg.trim()} className="btn-primary flex-1 disabled:opacity-50">
              {actionLoading === 'alert' ? 'Sending…' : 'Send Alert'}
            </button>
            <button onClick={() => { setAlertModal(null); setAlertMsg('') }} className="btn-secondary flex-1">Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  )
}

function ActionBtn({ children, title, onClick, disabled, color }) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`w-7 h-7 flex items-center justify-center rounded-lg text-sm transition-colors disabled:opacity-40 ${color}`}
    >
      {children}
    </button>
  )
}
