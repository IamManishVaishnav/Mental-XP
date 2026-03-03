const express = require('express')
const router = express.Router()
const { protect } = require('../middleware/authMiddleware')
const User = require('../models/User')
const { asyncHandler } = require('../middleware/errorMiddleware')

router.patch('/alerts/read', protect, asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {
    $set: { 'alerts.$[].read': true }
  })
  res.json({ success: true, message: 'Alerts marked as read' })
}))

module.exports = router