import api from './api'

export const getQuests = () => api.get('/api/quest')
export const completeQuest = (questId) => api.post('/api/quest/complete', { questId })