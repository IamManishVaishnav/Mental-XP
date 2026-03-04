const MoodLog = require('../models/MoodLog')
const { asyncHandler } = require('../middleware/errorMiddleware')

const submitMood = asyncHandler(async (req, res) => {
  const { moodScore, text, sentiment } = req.body

  if (!moodScore) {
    res.status(400)
    throw new Error('Mood score is required')
  }

  if (moodScore < 1 || moodScore > 10) {
    res.status(400)
    throw new Error('Mood score must be between 1 and 10')
  }

  const today = new Date().toISOString().split('T')[0]

  const alreadyLogged = await MoodLog.findOne({
    userId: req.user._id,
    loggedDate: today,
  })

  if (alreadyLogged) {
    res.status(400)
    throw new Error('You have already logged your mood today. Come back tomorrow.')
  }

  const mood = await MoodLog.create({
    userId: req.user._id,
    moodScore: Number(moodScore),
    text: text || '',
    sentiment: sentiment || '',
    loggedDate: today,
  })

  res.status(201).json({
    success: true,
    message: 'Mood logged successfully',
    mood,
  })
})

const getMoodHistory = asyncHandler(async (req, res) => {
  const moods = await MoodLog.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(7)

  const today = new Date().toISOString().split('T')[0]
  const loggedToday = moods.some(m => m.loggedDate === today)

  res.json({
    success: true,
    count: moods.length,
    moods,
    loggedToday,
  })
})

module.exports = { submitMood, getMoodHistory }