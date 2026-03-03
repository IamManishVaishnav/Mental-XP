import api from './api'

export const submitMood = (data) => api.post('/api/mood', data)
export const getMoodHistory = () => api.get('/api/mood/history')