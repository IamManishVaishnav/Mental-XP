const User = require('../models/User')
const Quest = require('../models/Quest')
const QuestLog = require('../models/QuestLog')
const { calculateXP } = require('../utils/xpLogic')
const { awardCoupons } = require('../utils/couponLogic')
const { asyncHandler } = require('../middleware/errorMiddleware')

const getQuests = asyncHandler(async (req, res) => {
  const quests = await Quest.find({ isActive: true }).sort({ category: 1, difficulty: 1 })

  const today = new Date().toISOString().split('T')[0]
  const completedToday = await QuestLog.find({
    userId: req.user._id,
    createdAt: {
      $gte: new Date(today),
      $lt: new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000),
    },
  }).select('questId')

  const completedIds = completedToday.map(q => q.questId.toString())

  const questsWithStatus = quests.map(q => ({
    ...q.toObject(),
    completedToday: completedIds.includes(q._id.toString()),
  }))

  res.json({ success: true, quests: questsWithStatus })
})

const completeQuest = asyncHandler(async (req, res) => {
  const { questId, completionData = {} } = req.body

  if (!questId) {
    res.status(400)
    throw new Error('questId is required')
  }

  const quest = await Quest.findById(questId)
  if (!quest || !quest.isActive) {
    res.status(404)
    throw new Error('Quest not found')
  }

  // Prevent completing same quest twice in one day
  const today = new Date().toISOString().split('T')[0]
  const alreadyDone = await QuestLog.findOne({
    userId: req.user._id,
    questId,
    createdAt: {
      $gte: new Date(today),
      $lt: new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000),
    },
  })

  if (alreadyDone) {
    res.status(400)
    throw new Error('You have already completed this quest today')
  }

  const user = await User.findById(req.user._id)
  const { xp, level, previousLevel, leveledUp } = calculateXP(user, quest.xpReward)

  // ── Overall streak ─────────────────────────────────────────
  const now = new Date()
  const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  let streak = user.streak

  if (user.lastQuestDate) {
    const lastDate = new Date(user.lastQuestDate)
    const lastDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate())
    const diffDays = Math.floor((todayDate - lastDay) / (1000 * 60 * 60 * 24))
    if (diffDays === 1) streak += 1
    else if (diffDays > 1) streak = 1
  } else {
    streak = 1
  }

  // ── Category streak ────────────────────────────────────────
  const category = quest.category

  // Build a complete default — old users won't have this field at all
  const emptyStreaks = {
    breathing: { streak: 0, lastDate: null },
    gratitude:  { streak: 0, lastDate: null },
    reframe:    { streak: 0, lastDate: null },
    grounding:  { streak: 0, lastDate: null },
    journal:    { streak: 0, lastDate: null },
  }
  const catStreaks = {
    ...emptyStreaks,
    ...(user.categoryStreaks ? user.categoryStreaks.toObject
      ? user.categoryStreaks.toObject()
      : user.categoryStreaks
    : {}),
  }
  const catData = catStreaks[category] || { streak: 0, lastDate: null }
  let catStreak = catData.streak || 0

  if (catData.lastDate) {
    const lastCatDate = new Date(catData.lastDate)
    const lastCatDay = new Date(lastCatDate.getFullYear(), lastCatDate.getMonth(), lastCatDate.getDate())
    const diffDays = Math.floor((todayDate - lastCatDay) / (1000 * 60 * 60 * 24))
    if (diffDays === 1) catStreak += 1
    else if (diffDays > 1) catStreak = 1
  } else {
    catStreak = 1
  }

  // Apply all updates
  user.xp = xp
  user.level = level
  user.streak = streak
  user.lastQuestDate = now

  // Write the full object — always all 5 categories so Mongoose validation passes
  user.categoryStreaks = {
    ...catStreaks,
    [category]: { streak: catStreak, lastDate: now },
  }
  user.markModified('categoryStreaks')

  await user.save()

  // Save quest log with completionData
  await QuestLog.create({
    userId: user._id,
    questId: quest._id,
    questType: quest.category,
    xpEarned: quest.xpReward,
    completionData,
  })

  let newCoupons = []
  if (leveledUp) {
    newCoupons = await awardCoupons(user._id, previousLevel, level)
  }

  res.status(201).json({
    success: true,
    message: `Quest "${quest.title}" completed! +${quest.xpReward} XP`,
    xp: user.xp,
    level: user.level,
    streak: user.streak,
    categoryStreak: catStreak,
    category,
    leveledUp,
    newCoupons,
  })
})

// Get a user's quest history (for journey tab)
const getQuestHistory = asyncHandler(async (req, res) => {
  const logs = await QuestLog.find({ userId: req.user._id })
    .populate({ path: 'questId', select: 'title category componentType xpReward', strictPopulate: false })
    .sort({ createdAt: -1 })
    .limit(50)

  res.json({ success: true, history: logs })
})

module.exports = { getQuests, completeQuest, getQuestHistory }