import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import MoodCheck from './pages/MoodCheck'
import Quests from './pages/Quests'
import AdminDashboard from './pages/AdminDashboard'
import Layout from './components/Layout'
import Deactivated from './pages/Deactivated'

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth()
  return token ? children : <Navigate to="/login" replace />
}

const AdminRoute = ({ children }) => {
  const { token, user } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Layout><Dashboard /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/mood" element={
          <ProtectedRoute>
            <Layout><MoodCheck /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/quests" element={
          <ProtectedRoute>
            <Layout><Quests /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <AdminRoute>
            <Layout><AdminDashboard /></Layout>
          </AdminRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/deactivated" element={<Deactivated />} />
      </Routes>
    </BrowserRouter>
  )
}