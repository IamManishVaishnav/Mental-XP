export const getLevelProgress = (xp, level) => {
  const required = level * 100
  return Math.min(Math.round((xp / required) * 100), 100)
}

export const getMoodLabel = (score) => {
  if (score >= 8) return 'Great'
  if (score >= 6) return 'Good'
  if (score >= 4) return 'Okay'
  if (score >= 2) return 'Low'
  return 'Critical'
}

export const getMoodColor = (score) => {
  if (score >= 8) return '#22D3EE'
  if (score >= 6) return '#5B6CFF'
  if (score >= 4) return '#8B5CF6'
  if (score >= 2) return '#F59E0B'
  return '#EF4444'
}

export const formatDate = (dateStr) => {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}