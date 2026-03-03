const User = require('../models/User');
const QuestLog = require('../models/QuestLog');
const { calculateXP } = require('../utils/xpLogic');
const { asyncHandler } = require('../middleware/errorMiddleware');

const completeQuest = asyncHandler(async (req, res) => {
  const { questType } = req.body;

  const validTypes = ['breathing', 'gratitude', 'reframe'];
  if (!questType || !validTypes.includes(questType)) {
    res.status(400);
    throw new Error('Invalid quest type. Must be: breathing, gratitude, or reframe');
  }

  const user = await User.findById(req.user._id);
  const XP_PER_QUEST = 10;

  const { xp, level } = calculateXP(user, XP_PER_QUEST);

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  let streak = user.streak;

  if (user.lastQuestDate) {
    const lastDate = new Date(user.lastQuestDate);
    const lastDay = new Date(lastDate.getFullYear(), lastDate.getMonth(), lastDate.getDate());
    const diffDays = Math.floor((today - lastDay) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak += 1;
    } else if (diffDays > 1) {
      streak = 1;
    }
  } else {
    streak = 1;
  }

  user.xp = xp;
  user.level = level;
  user.streak = streak;
  user.lastQuestDate = now;
  await user.save();

  await QuestLog.create({
    userId: user._id,
    questType,
    xpEarned: XP_PER_QUEST,
  });

  res.status(201).json({
    success: true,
    message: `Quest "${questType}" completed! +${XP_PER_QUEST} XP`,
    xp: user.xp,
    level: user.level,
    streak: user.streak,
  });
});

module.exports = { completeQuest };
