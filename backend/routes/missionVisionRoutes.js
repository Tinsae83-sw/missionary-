// backend/routes/missionVisionRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const missionVisionController = require('../controllers/missionVisionController');

/**
 * @route   GET /api/mission-vision
 * @desc    Get mission and vision
 * @access  Public
 */
router.get('/', missionVisionController.getMissionVision);

/**
 * @route   POST /api/mission-vision
 * @desc    Create or update mission and vision
 * @access  Public
 */
router.post(
  '/',
  [
    body('mission', 'Mission is required').notEmpty().trim(),
    body('vision', 'Vision is required').notEmpty().trim(),
    body('coreValues', 'Core values must be a string').optional().isString().trim(),
    body('purpose', 'Purpose must be a string').optional().isString().trim()
  ],
  missionVisionController.createOrUpdateMissionVision
);

module.exports = router;