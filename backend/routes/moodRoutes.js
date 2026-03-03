const express = require('express');
const router = express.Router();
const { submitMood, getMoodHistory } = require('../controllers/moodController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, submitMood);
router.get('/history', protect, getMoodHistory);

module.exports = router;
