const mongoose = require('mongoose');

const moodLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    moodScore: {
      type: Number,
      required: [true, 'Mood score is required'],
      min: [1, 'Mood score must be at least 1'],
      max: [10, 'Mood score must be at most 10'],
    },
    text: {
      type: String,
      trim: true,
      default: '',
    },
    sentiment: {
      type: String,
      trim: true,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MoodLog', moodLogSchema);
