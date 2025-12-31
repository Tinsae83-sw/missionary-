const express = require('express');
const router = express.Router();
const ministryController = require('../controllers/ministryController');

// Mount the ministry controller routes
router.use('/', ministryController);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error('❌ Route error:', err);
  res.status(500).json({
    success: false,
    message: 'An error occurred while processing your request',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports = router;