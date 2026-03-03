import api from './api'

export const markAlertsRead = () => api.patch('/api/user/alerts/read')