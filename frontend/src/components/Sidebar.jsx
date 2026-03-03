import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AlertBell from './AlertBell'

const NavItem = ({ to, icon, label }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
  >
    <span className="text-xl">{icon}</span>
    <span>{label}</span>
  </NavLink>
)

export default function Sidebar({ alerts = [], unreadAlertCount = 0, onAlertsRead }) {
  const { user, logout, toggleDark, dark } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col z-10">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <span className="text-white font-bold text-sm font-display">MX</span>
          </div>
          <div>
            <h1 className="font-display font-bold text-textPrimary dark:text-white text-lg leading-none">Mental XP</h1>
            <p className="text-xs text-textSecondary mt-0.5">Wellness Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {user?.role === 'admin' ? (
          <NavItem to="/admin" icon="🏢" label="Admin Dashboard" />
        ) : (
          <>
            <NavItem to="/dashboard" icon="⚡" label="Dashboard" />
            <NavItem to="/mood" icon="😊" label="Mood Check" />
            <NavItem to="/quests" icon="🎮" label="Quests" />
          </>
        )}
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
        {user?.role !== 'admin' && (
          <AlertBell
            alerts={alerts}
            unreadCount={unreadAlertCount}
            onRead={onAlertsRead}
          />
        )}

        <button onClick={toggleDark} className="sidebar-link w-full">
          <span className="text-xl">{dark ? '☀️' : '🌙'}</span>
          <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-sm font-bold">
            {user?.name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-textPrimary dark:text-white truncate">{user?.name}</p>
            <p className="text-xs text-textSecondary capitalize">{user?.role}</p>
          </div>
          <button onClick={handleLogout} className="text-textSecondary hover:text-red-500 transition-colors text-sm">↩</button>
        </div>
      </div>
    </aside>
  )
}