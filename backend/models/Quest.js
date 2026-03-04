const mongoose = require('mongoose')

const questSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructions: [{ type: String }],
    category: {
      type: String,
      enum: ['breathing', 'gratitude', 'reframe'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'easy',
    },
    xpReward: { type: Number, required: true },
    durationMinutes: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Quest', questSchema)