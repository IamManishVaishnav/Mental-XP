const Coupon = require('../models/Coupon')
const UserCoupon = require('../models/UserCoupon')

const awardCoupons = async (userId, previousLevel, newLevel) => {
  const awarded = []

  for (let level = previousLevel + 1; level <= newLevel; level++) {
    const levelCoupons = await Coupon.find({
      triggerType: 'level_up',
      isActive: true,
    })

    for (const coupon of levelCoupons) {
      const exists = await UserCoupon.findOne({ userId, couponId: coupon._id })
      if (!exists) {
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + coupon.expiryDays)

        const userCoupon = await UserCoupon.create({
          userId,
          couponId: coupon._id,
          code: `${coupon.code}-${userId.toString().slice(-4).toUpperCase()}`,
          description: coupon.description,
          discountPercent: coupon.discountPercent,
          partner: coupon.partner,
          expiresAt,
          triggerType: coupon.triggerType,
          triggerValue: level,
        })
        awarded.push(userCoupon)
      }
    }

    const milestoneCoupons = await Coupon.find({
      triggerType: 'milestone',
      triggerValue: level,
      isActive: true,
    })

    for (const coupon of milestoneCoupons) {
      const exists = await UserCoupon.findOne({ userId, couponId: coupon._id })
      if (!exists) {
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + coupon.expiryDays)

        const userCoupon = await UserCoupon.create({
          userId,
          couponId: coupon._id,
          code: `${coupon.code}-${userId.toString().slice(-4).toUpperCase()}`,
          description: coupon.description,
          discountPercent: coupon.discountPercent,
          partner: coupon.partner,
          expiresAt,
          triggerType: coupon.triggerType,
          triggerValue: level,
        })
        awarded.push(userCoupon)
      }
    }
  }

  return awarded
}

module.exports = { awardCoupons }