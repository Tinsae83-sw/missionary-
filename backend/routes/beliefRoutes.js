const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const beliefController = require('../controllers/beliefController');

// Validation rules
const beliefValidationRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('icon_class').optional().isString(),
  body('display_order').optional().isInt({ min: 0 }),
  body('is_published').optional().isBoolean(),
];

// GET /api/beliefs - Get all beliefs
router.get('/', beliefController.getAllBeliefs);

// GET /api/beliefs/:id - Get a single belief
router.get('/:id', beliefController.getBeliefById);

// POST /api/beliefs - Create a new belief
router.post('/', beliefValidationRules, beliefController.createBelief);

// PUT /api/beliefs/:id - Update a belief
router.put('/:id', beliefValidationRules, beliefController.updateBelief);

// DELETE /api/beliefs/:id - Delete a belief
router.delete('/:id', beliefController.deleteBelief);

module.exports = router;
