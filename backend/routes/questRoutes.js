const express = require('express');
const router = express.Router();
const { completeQuest } = require('../controllers/questController');
const { protect } = require('../middleware/authMiddleware');

router.post('/complete', protect, completeQuest);

module.exports = router;
