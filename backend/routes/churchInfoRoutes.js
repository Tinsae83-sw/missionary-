const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const churchInfoController = require('../controllers/churchInfoController');

// Get church info
router.get('/', churchInfoController.getChurchInfo);

// Update church info
router.put(
  '/',
  [
    body('name').notEmpty().withMessage('Church name is required'),
    body('email').isEmail().withMessage('Please provide a valid email'),
    body('phone').optional().isLength({ min: 10 }).withMessage('Phone number must be at least 10 digits'),
  ],
  churchInfoController.updateChurchInfo
);

module.exports = router;
