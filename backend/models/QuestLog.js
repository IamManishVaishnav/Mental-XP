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
      enum: ['breathing', 'gratitude', 'reframe'],
      required: true,
    },
    xpEarned: { type: Number, required: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('QuestLog', questLogSchema)