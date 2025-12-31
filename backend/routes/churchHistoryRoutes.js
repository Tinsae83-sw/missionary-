const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const churchHistoryController = require('../controllers/churchHistoryController');

// Get all history items (public)
router.get('/', churchHistoryController.getHistoryItems);

// Get single history item (public)
router.get(
  '/:id',
  [param('id').isUUID().withMessage('Invalid history item ID')],
  churchHistoryController.getHistoryItem
);

// Create new history item 
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('year').isInt({ min: 1000, max: 9999 }).withMessage('Valid year is required'),
    body('month').optional().isInt({ min: 1, max: 12 }),
    body('day').optional().isInt({ min: 1, max: 31 }),
    body('isPublished').optional().isBoolean()
  ],
  churchHistoryController.createHistoryItem
);

// Update history item 
router.put(
  '/:id',
  [
    param('id').isUUID().withMessage('Invalid history item ID'),
    body('title').optional().notEmpty(),
    body('content').optional().notEmpty(),
    body('year').optional().isInt({ min: 1000, max: 9999 }),
    body('month').optional().isInt({ min: 1, max: 12 }),
    body('day').optional().isInt({ min: 1, max: 31 }),
    body('isPublished').optional().isBoolean()
  ],
  churchHistoryController.updateHistoryItem
);

// Delete history item 
router.delete(
  '/:id',
  param('id').isUUID().withMessage('Invalid history item ID'),
  churchHistoryController.deleteHistoryItem
);

module.exports = router;
