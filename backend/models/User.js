const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
    },
    xp: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    // Overall consecutive-day streak (any quest)
    streak: {
      type: Number,
      default: 0,
    },
    lastQuestDate: {
      type: Date,
      default: null,
    },

    // Per-category streaks — track separate engagement per area
    categoryStreaks: {
      breathing: { streak: { type: Number, default: 0 }, lastDate: { type: Date, default: null } },
      gratitude:  { streak: { type: Number, default: 0 }, lastDate: { type: Date, default: null } },
      reframe:    { streak: { type: Number, default: 0 }, lastDate: { type: Date, default: null } },
      grounding:  { streak: { type: Number, default: 0 }, lastDate: { type: Date, default: null } },
      journal:    { streak: { type: Number, default: 0 }, lastDate: { type: Date, default: null } },
    },

    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    alerts: [
      {
        message: { type: String },
        sentAt: { type: Date, default: Date.now },
        read: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
)

module.exports = mongoose.models.User || mongoose.model('User', userSchema)
