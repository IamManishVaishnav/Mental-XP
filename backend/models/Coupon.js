const mongoose = require('mongoose')

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    discountPercent: { type: Number, required: true },
    partner: { type: String, required: true },
    triggerType: {
      type: String,
      enum: ['level_up', 'milestone'],
      required: true,
    },
    triggerValue: { type: Number, required: true },
    expiryDays: { type: Number, default: 30 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

module.exports = mongoose.model('Coupon', couponSchema)