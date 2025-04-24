const express = require('express');
const router = express.Router();
const scoreController = require('../controllers/scoreController');

// Get all scores
router.get('/', scoreController.getAllScores);

// Get score by username
router.get('/:username', scoreController.getScoreByUsername);

// Update scores
router.post('/update', scoreController.updateScores);

module.exports = router; 