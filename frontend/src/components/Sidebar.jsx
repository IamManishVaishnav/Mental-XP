import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AlertBell from './AlertBell'

const NavItem = ({ to, icon, label }) => (
  <NavLink to={to} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
    <span className="w-[18px] h-[18px] flex-shrink-0 opacity-80">{icon}</span>
    <span>{label}</span>
  </NavLink>
)

const DashIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
    <rect x="14" y="14" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/>
  </svg>
)
const MoodIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/>
    <circle cx="9" cy="9" r="1" fill="currentColor"/><circle cx="15" cy="9" r="1" fill="currentColor"/>
  </svg>
)
const QuestIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)
const AdminIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
)
const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)
const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)
const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
)

const LeafIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
    <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
  </svg>
)

export default function Sidebar({ alerts = [], unreadAlertCount = 0, onAlertsRead }) {
  const { user, logout, toggleDark, dark } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-[var(--sidebar-bg)] border-r border-[var(--card-border)] flex flex-col z-10">

      {/* Logo */}
      <div className="p-5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-forest-500 flex items-center justify-center shadow-sm flex-shrink-0">
            <LeafIcon />
            <span className="sr-only">Mental XP</span>
          </div>
          <div>
            <h1 className="font-display font-semibold text-[var(--ink)] text-base leading-none tracking-tight">
              Mental<span className="text-forest-500">XP</span>
            </h1>
            <p className="text-2xs text-ink-muted mt-0.5 font-body">Wellness Platform</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 divider mb-3" />

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        <p className="section-label px-3.5 mb-2 mt-1">Navigation</p>
        {user?.role === 'admin' ? (
          <NavItem to="/admin" icon={<AdminIcon />} label="Admin Dashboard" />
        ) : (
          <>
            <NavItem to="/dashboard" icon={<DashIcon />} label="Dashboard" />
            <NavItem to="/mood"      icon={<MoodIcon />} label="Mood Check" />
            <NavItem to="/quests"    icon={<QuestIcon />} label="Quests" />
          </>
        )}
      </nav>

      {/* Bottom controls */}
      <div className="px-3 pb-4 space-y-0.5">
        <div className="divider mb-3" />

        {user?.role !== 'admin' && (
          <AlertBell alerts={alerts} unreadCount={unreadAlertCount} onRead={onAlertsRead} />
        )}

        <button onClick={toggleDark} className="sidebar-link w-full">
          <span className="w-[18px] h-[18px] flex-shrink-0 opacity-70">{dark ? <SunIcon /> : <MoonIcon />}</span>
          <span>{dark ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        {/* User card */}
        <div className="mt-2 flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-forest-50 dark:bg-forest-900/20 border border-forest-100 dark:border-forest-900/40">
          <div className="w-7 h-7 rounded-full bg-forest-500 flex items-center justify-center text-white text-2xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-[var(--ink)] truncate leading-none">{user?.name}</p>
            <p className="text-2xs text-ink-muted capitalize mt-0.5">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-ink-muted hover:text-red-500 transition-colors flex-shrink-0 p-0.5"
            title="Sign out"
          >
            <LogoutIcon />
          </button>
        </div>
      </div>
    </aside>
  )
}
