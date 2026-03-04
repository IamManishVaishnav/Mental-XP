const mongoose = require('mongoose')

const userCouponSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    couponId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Coupon',
      required: true,
    },
    code: { type: String, required: true },
    description: { type: String, required: true },
    discountPercent: { type: Number, required: true },
    partner: { type: String, required: true },
    earnedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true },
    isUsed: { type: Boolean, default: false },
    usedAt: { type: Date, default: null },
    triggerType: { type: String },
    triggerValue: { type: Number },
  },
  { timestamps: true }
)

module.exports = mongoose.model('UserCoupon', userCouponSchema)