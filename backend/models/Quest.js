const mongoose = require('mongoose')

const questSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    instructions: [{ type: String }],
    category: {
      type: String,
      enum: ['breathing', 'gratitude', 'reframe', 'grounding', 'journal'],
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

    // Tells the frontend which interactive component to render
    // 'breathing_timer'    → animated breath circle with phase timer
    // 'journal_entry'      → textarea with word count gate
    // 'cbt_form'           → multi-step CBT thought record
    // 'grounding_checklist'→ 5-4-3-2-1 sensory input form
    // 'static'             → original read-and-complete (fallback)
    componentType: {
      type: String,
      enum: ['breathing_timer', 'journal_entry', 'cbt_form', 'grounding_checklist', 'static'],
      default: 'static',
    },

    // Config passed to the component (phases for breathing, prompts for journal, etc.)
    componentConfig: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
)

module.exports = mongoose.models.Quest || mongoose.model('Quest', questSchema)
