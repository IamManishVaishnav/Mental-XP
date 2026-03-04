const express = require('express')
const router = express.Router()
const { getQuests, completeQuest } = require('../controllers/questController')
const { protect } = require('../middleware/authMiddleware')

router.get('/', protect, getQuests)
router.post('/complete', protect, completeQuest)

module.exports = router