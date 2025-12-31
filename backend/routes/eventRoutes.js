const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

// @route   GET /api/events
// @desc    Get all events
// @access  Public
router.get('/', getEvents);

// @route   GET /api/events/:id
// @desc    Get single event
// @access  Public
router.get('/:id', getEvent);

// @route   POST /api/events
// @desc    Create a new event
// @access  Private/Admin
router.post(
  '/',
  [
    body('title', 'Title is required')
      .not().isEmpty().trim()
      .isLength({ max: 255 }).withMessage('Title must be less than 255 characters'),
    body('description', 'Description is required')
      .not().isEmpty().trim(),
    body('event_type', 'Event type is required')
      .not().isEmpty()
      .isIn([
        'Worship Service',
        'Bible Study',
        'Prayer Meeting',
        'Fellowship',
        'Outreach',
        'Conference',
        'Other'
      ]),
    body('start_date', 'Start date is required and must be a valid date')
      .not().isEmpty()
      .isISO8601(),
    body('end_date', 'End date must be a valid date')
      .optional()
      .isISO8601(),
    body('location', 'Location is required')
      .not().isEmpty().trim()
      .isLength({ max: 255 }).withMessage('Location must be less than 255 characters'),
    body('image_url', 'Image URL must be a valid URL')
      .optional()
      .isURL(),
    body('recurring_pattern')
      .optional()
      .isIn(['daily', 'weekly', 'biweekly', 'monthly'])
      .withMessage('Invalid recurring pattern')
  ],
  createEvent
);

// @route   PUT /api/events/:id
// @desc    Update an event
// @access  Private/Admin
router.put(
  '/:id',
  [
    body('title')
      .optional()
      .not().isEmpty().trim()
      .isLength({ max: 255 }).withMessage('Title must be less than 255 characters'),
    body('description')
      .optional()
      .not().isEmpty().trim(),
    body('event_type')
      .optional()
      .isIn([
        'Worship Service',
        'Bible Study',
        'Prayer Meeting',
        'Fellowship',
        'Outreach',
        'Conference',
        'Other'
      ]),
    body('start_date')
      .optional()
      .isISO8601(),
    body('end_date')
      .optional()
      .isISO8601(),
    body('location')
      .optional()
      .not().isEmpty().trim()
      .isLength({ max: 255 }).withMessage('Location must be less than 255 characters'),
    body('image_url')
      .optional()
      .isURL(),
    body('recurring_pattern')
      .optional()
      .isIn(['daily', 'weekly', 'biweekly', 'monthly'])
      .withMessage('Invalid recurring pattern')
  ],
  updateEvent
);

// @route   DELETE /api/events/:id
// @desc    Delete an event
// @access  Private/Admin
router.delete('/:id', deleteEvent);

module.exports = router;