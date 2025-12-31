// backend/controllers/missionVisionController.js
const MissionVision = require('../models/MissionVision');
const { validationResult } = require('express-validator');

/**
 * @desc    Get mission and vision
 * @route   GET /api/mission-vision
 * @access  Public
 */
const getMissionVision = async (req, res) => {
  try {
    const missionVision = await MissionVision.getMissionVision();
    
    if (!missionVision) {
      return res.status(404).json({
        status: 'error',
        message: 'Mission and vision not found',
      });
    }

    res.status(200).json({
      status: 'success',
      data: missionVision,
    });
  } catch (error) {
    console.error('Error getting mission and vision:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to get mission and vision',
    });
  }
};

/**
 * @desc    Create or update mission and vision
 * @route   POST /api/mission-vision
 * @access  Public
 */
const createOrUpdateMissionVision = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 'error',
      errors: errors.array(),
    });
  }

  const { mission, vision, coreValues, purpose } = req.body;

  try {
    // Use updateMissionVision which handles both create and update
    const result = await MissionVision.updateMissionVision({
      mission,
      vision,
      coreValues,
      purpose,
    });

    res.status(200).json({
      status: 'success',
      data: result,
    });
  } catch (error) {
    console.error('Error saving mission and vision:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to save mission and vision',
    });
  }
};

module.exports = {
  getMissionVision,
  createOrUpdateMissionVision,
};