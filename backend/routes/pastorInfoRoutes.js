// backend/routes/pastorInfoRoutes.js
const express = require('express');
const router = express.Router();
const pastorController = require('../controllers/pastorInfoController');

// Get all pastors
router.get('/', pastorController.getAllPastors);

// Get single pastor
router.get('/:id', pastorController.getPastorById);

// Create or update pastor
router.post('/', pastorController.createOrUpdatePastor);

// Delete pastor
router.delete('/:id', pastorController.deletePastor);

module.exports = router;