import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Deactivated() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('deactivated')
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-dark flex items-center justify-center px-4">
      <div className="card max-w-md w-full text-center space-y-5">
        <div className="text-6xl">🔒</div>
        <h1 className="font-display font-bold text-2xl text-textPrimary dark:text-white">
          Account Deactivated
        </h1>
        <p className="text-textSecondary">
          Your account has been deactivated by an administrator. Please contact your manager or HR team for assistance.
        </p>
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-sm text-amber-700 dark:text-amber-400">
          If you believe this is a mistake, reach out to your admin to reactivate your account.
        </div>
        <button onClick={handleLogout} className="btn-primary w-full">
          Back to Login
        </button>
      </div>
    </div>
  )
}