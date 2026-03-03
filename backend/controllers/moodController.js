const MoodLog = require('../models/MoodLog');
const { asyncHandler } = require('../middleware/errorMiddleware');

const submitMood = asyncHandler(async (req, res) => {
  const { moodScore, text, sentiment } = req.body;

  if (!moodScore) {
    res.status(400);
    throw new Error('Mood score is required');
  }

  if (moodScore < 1 || moodScore > 10) {
    res.status(400);
    throw new Error('Mood score must be between 1 and 10');
  }

  const mood = await MoodLog.create({
    userId: req.user._id,
    moodScore: Number(moodScore),
    text: text || '',
    sentiment: sentiment || '',
  });

  res.status(201).json({
    success: true,
    message: 'Mood logged successfully',
    mood,
  });
});

const getMoodHistory = asyncHandler(async (req, res) => {
  const moods = await MoodLog.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(7);

  res.json({
    success: true,
    count: moods.length,
    moods,
  });
});

module.exports = { submitMood, getMoodHistory };
