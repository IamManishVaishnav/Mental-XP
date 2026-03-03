import api from './api'

export const getDashboard = () => api.get('/api/dashboard')
export const getAdminStats = () => api.get('/api/admin/stats')