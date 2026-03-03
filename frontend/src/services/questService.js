import api from './api'

export const completeQuest = (questType) => api.post('/api/quest/complete', { questType })