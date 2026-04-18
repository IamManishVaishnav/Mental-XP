const express = require('express')
const router = express.Router()
const { getQuests, completeQuest, getQuestHistory } = require('../controllers/questController')
const { protect } = require('../middleware/authMiddleware')

router.get('/',          protect, getQuests)
router.post('/complete', protect, completeQuest)
router.get('/history',   protect, getQuestHistory)

module.exports = router