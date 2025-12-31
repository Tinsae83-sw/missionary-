const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const coreValueController = require('../controllers/coreValueController');

// Validation rules
const coreValueValidationRules = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('icon_class').optional().isString(),
  body('display_order').optional().isInt({ min: 0 }),
  body('is_published').optional().isBoolean(),
];

// GET /api/core-values - Get all core values
router.get('/', coreValueController.getAllCoreValues);

// GET /api/core-values/:id - Get a single core value
router.get('/:id', coreValueController.getCoreValueById);

// POST /api/core-values - Create a new core value
router.post('/', coreValueValidationRules, coreValueController.createCoreValue);

// PUT /api/core-values/:id - Update a core value
router.put('/:id', coreValueValidationRules, coreValueController.updateCoreValue);

// DELETE /api/core-values/:id - Delete a core value
router.delete('/:id', coreValueController.deleteCoreValue);

module.exports = router;
