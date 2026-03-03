const User = require('../models/User')
const MoodLog = require('../models/MoodLog')
const QuestLog = require('../models/QuestLog')
const { asyncHandler } = require('../middleware/errorMiddleware')

const getDashboard = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password')

  const last7Moods = await MoodLog.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .limit(7)

  const last5Moods = await MoodLog.find({ userId: user._id })
    .sort({ createdAt: -1 })
    .limit(5)

  let burnoutRisk = false

  if (last5Moods.length >= 5) {
    const avgMood = last5Moods.reduce((sum, m) => sum + m.moodScore, 0) / last5Moods.length
    if (avgMood < 4) burnoutRisk = true
  }

  if (!burnoutRisk) {
    const threeDaysAgo = new Date()
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
    const recentQuest = await QuestLog.findOne({
      userId: user._id,
      createdAt: { $gte: threeDaysAgo },
    })
    if (!recentQuest) burnoutRisk = true
  }

  const unreadAlerts = (user.alerts || []).filter(a => !a.read)

  res.json({
    success: true,
    dashboard: {
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      last7Moods,
      burnoutRisk,
      alerts: user.alerts || [],
      unreadAlertCount: unreadAlerts.length,
    },
  })
})

module.exports = { getDashboard }