import api from './api'

export const getAdminStats = () => api.get('/api/admin/stats')
export const getAllUsers = () => api.get('/api/admin/users')
export const addEmployee = (data) => api.post('/api/admin/users/add', data)
export const toggleUserStatus = (id) => api.patch(`/api/admin/users/${id}/toggle`)
export const deleteUser = (id) => api.delete(`/api/admin/users/${id}`)
export const sendAlert = (id, message) => api.post(`/api/admin/users/${id}/alert`, { message })
export const exportCSV = () => api.get('/api/admin/export', { responseType: 'blob' })