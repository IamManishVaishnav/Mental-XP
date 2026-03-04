const User = require('../models/User')
const MoodLog = require('../models/MoodLog')
const QuestLog = require('../models/QuestLog')
const UserCoupon = require('../models/UserCoupon')
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

  const today = new Date().toISOString().split('T')[0]
  const loggedToday = await MoodLog.findOne({ userId: user._id, loggedDate: today })

  const rewards = await UserCoupon.find({ userId: user._id })
    .sort({ earnedAt: -1 })

  const unreadAlerts = (user.alerts || []).filter(a => !a.read)
  const xpForNextLevel = user.level * 100

  res.json({
    success: true,
    dashboard: {
      xp: user.xp,
      level: user.level,
      streak: user.streak,
      xpForNextLevel,
      last7Moods,
      burnoutRisk,
      loggedToday: !!loggedToday,
      alerts: user.alerts || [],
      unreadAlertCount: unreadAlerts.length,
      rewards,
    },
  })
})

module.exports = { getDashboard }