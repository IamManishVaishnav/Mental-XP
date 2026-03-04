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
  const { questId } = req.body

  if (!questId) {
    res.status(400)
    throw new Error('questId is required')
  }

  const quest = await Quest.findById(questId)
  if (!quest || !quest.isActive) {
    res.status(404)
    throw new Error('Quest not found')
  }

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

  user.xp = xp
  user.level = level
  user.streak = streak
  user.lastQuestDate = now
  await user.save()

  await QuestLog.create({
    userId: user._id,
    questId: quest._id,
    questType: quest.category,
    xpEarned: quest.xpReward,
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
    leveledUp,
    newCoupons,
  })
})

module.exports = { getQuests, completeQuest }