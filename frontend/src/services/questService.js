import api from './api'

export const getQuests = () => api.get('/api/quest')

export const completeQuest = (questId, completionData = {}) =>
  api.post('/api/quest/complete', { questId, completionData })

export const getQuestHistory = () => api.get('/api/quest/history')