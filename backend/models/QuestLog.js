const mongoose = require('mongoose');

const questLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    questType: {
      type: String,
      enum: ['breathing', 'gratitude', 'reframe'],
      required: [true, 'Quest type is required'],
    },
    xpEarned: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('QuestLog', questLogSchema);
