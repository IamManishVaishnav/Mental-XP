const mongoose = require('mongoose')

const questLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    questId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Quest',
      required: true,
    },
    questType: {
      type: String,
      enum: ['breathing', 'gratitude', 'reframe', 'grounding', 'journal'],
      required: true,
    },
    xpEarned: { type: Number, required: true },

    // Stores what the user actually did — journal text, CBT answers, etc.
    // Mixed type so each quest component can store its own shape
    completionData: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
)

module.exports = mongoose.models.QuestLog || mongoose.model('QuestLog', questLogSchema)