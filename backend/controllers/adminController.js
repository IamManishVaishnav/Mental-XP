const User = require('../models/User')
const MoodLog = require('../models/MoodLog')
const QuestLog = require('../models/QuestLog')
const { asyncHandler } = require('../middleware/errorMiddleware')
const bcrypt = require('bcryptjs')

const getAdminStats = asyncHandler(async (req, res) => {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  const threeDaysAgo = new Date()
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

  const totalUsers = await User.countDocuments({ role: 'user' })

  const avgMoodResult = await MoodLog.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    { $group: { _id: null, avgMood: { $avg: '$moodScore' } } },
  ])
  const averageMood = avgMoodResult.length > 0 ? Math.round(avgMoodResult[0].avgMood * 100) / 100 : 0

  const activeUsersResult = await MoodLog.aggregate([
    { $match: { createdAt: { $gte: sevenDaysAgo } } },
    { $group: { _id: '$userId' } },
    { $count: 'activeUsers' },
  ])
  const activeUsers = activeUsersResult.length > 0 ? activeUsersResult[0].activeUsers : 0

  const allUsers = await User.find({ role: 'user' }).select('_id')
  let burnoutCount = 0
  for (const user of allUsers) {
    let isBurnout = false
    const last5Moods = await MoodLog.find({ userId: user._id }).sort({ createdAt: -1 }).limit(5)
    if (last5Moods.length >= 5) {
      const avg = last5Moods.reduce((sum, m) => sum + m.moodScore, 0) / last5Moods.length
      if (avg < 4) isBurnout = true
    }
    if (!isBurnout) {
      const recentQuest = await QuestLog.findOne({ userId: user._id, createdAt: { $gte: threeDaysAgo } })
      if (!recentQuest) isBurnout = true
    }
    if (isBurnout) burnoutCount++
  }
  const burnoutRiskPercentage = totalUsers > 0 ? Math.round((burnoutCount / totalUsers) * 100) : 0

  res.json({
    success: true,
    stats: { totalUsers, averageMood, activeUsers, burnoutRiskPercentage },
  })
})

const getAllUsers = asyncHandler(async (req, res) => {
  const threeDaysAgo = new Date()
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

  const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 })

  const usersWithData = await Promise.all(
    users.map(async (user) => {
      const last5Moods = await MoodLog.find({ userId: user._id }).sort({ createdAt: -1 }).limit(5)
      const avgMood = last5Moods.length > 0
        ? Math.round((last5Moods.reduce((s, m) => s + m.moodScore, 0) / last5Moods.length) * 10) / 10
        : null

      let burnoutRisk = false
      if (last5Moods.length >= 5) {
        const avg = last5Moods.reduce((s, m) => s + m.moodScore, 0) / last5Moods.length
        if (avg < 4) burnoutRisk = true
      }
      if (!burnoutRisk) {
        const recentQuest = await QuestLog.findOne({ userId: user._id, createdAt: { $gte: threeDaysAgo } })
        if (!recentQuest) burnoutRisk = true
      }

      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        isActive: user.isActive,
        burnoutRisk,
        avgMood,
        createdAt: user.createdAt,
        alerts: user.alerts || [],
      }
    })
  )

  res.json({ success: true, users: usersWithData })
})

const addEmployee = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    res.status(400)
    throw new Error('Name, email and password are required')
  }
  const existing = await User.findOne({ email })
  if (existing) {
    res.status(409)
    throw new Error('User with this email already exists')
  }
  const salt = await bcrypt.genSalt(10)
  const hashed = await bcrypt.hash(password, salt)
  const user = await User.create({ name, email, password: hashed, role: 'user' })
  res.status(201).json({
    success: true,
    message: 'Employee added successfully',
    user: { _id: user._id, name: user.name, email: user.email, role: user.role },
  })
})

const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user || user.role === 'admin') {
    res.status(404)
    throw new Error('User not found')
  }
  user.isActive = !user.isActive
  await user.save()
  res.json({
    success: true,
    message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
    isActive: user.isActive,
  })
})

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
  if (!user || user.role === 'admin') {
    res.status(404)
    throw new Error('User not found')
  }
  await User.findByIdAndDelete(req.params.id)
  await MoodLog.deleteMany({ userId: req.params.id })
  await QuestLog.deleteMany({ userId: req.params.id })
  res.json({ success: true, message: 'User deleted successfully' })
})

const sendAlert = asyncHandler(async (req, res) => {
  const { message } = req.body
  if (!message) {
    res.status(400)
    throw new Error('Alert message is required')
  }
  const user = await User.findById(req.params.id)
  if (!user || user.role === 'admin') {
    res.status(404)
    throw new Error('User not found')
  }
  user.alerts.push({ message })
  await user.save()
  res.json({ success: true, message: 'Alert sent successfully' })
})

const exportCSV = asyncHandler(async (req, res) => {
  const threeDaysAgo = new Date()
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)

  const users = await User.find({ role: 'user' }).select('-password')

  const rows = await Promise.all(
    users.map(async (user) => {
      const last5Moods = await MoodLog.find({ userId: user._id }).sort({ createdAt: -1 }).limit(5)
      const avgMood = last5Moods.length > 0
        ? Math.round((last5Moods.reduce((s, m) => s + m.moodScore, 0) / last5Moods.length) * 10) / 10
        : 'N/A'

      let burnoutRisk = false
      if (last5Moods.length >= 5) {
        if (last5Moods.reduce((s, m) => s + m.moodScore, 0) / last5Moods.length < 4) burnoutRisk = true
      }
      if (!burnoutRisk) {
        const recentQuest = await QuestLog.findOne({ userId: user._id, createdAt: { $gte: threeDaysAgo } })
        if (!recentQuest) burnoutRisk = true
      }

      return `"${user.name}","${user.email}",${user.xp},${user.level},${user.streak},${avgMood},${burnoutRisk},${user.isActive},${new Date(user.createdAt).toLocaleDateString()}`
    })
  )

  const csv = ['Name,Email,XP,Level,Streak,Avg Mood,Burnout Risk,Active,Joined', ...rows].join('\n')

  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename=mentalxp-users.csv')
  res.send(csv)
})

module.exports = { getAdminStats, getAllUsers, addEmployee, toggleUserStatus, deleteUser, sendAlert, exportCSV }