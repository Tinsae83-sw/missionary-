const { ChurchHistory } = require('../models');
const { validationResult } = require('express-validator');

// Get all history items
exports.getHistoryItems = async (req, res) => {
  try {
    const historyItems = await ChurchHistory.findAll();
    res.json(historyItems);
  } catch (error) {
    console.error('Error fetching history items:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single history item
exports.getHistoryItem = async (req, res) => {
  try {
    const historyItem = await ChurchHistory.findByPk(req.params.id);
    if (!historyItem) {
      return res.status(404).json({ message: 'History item not found' });
    }
    res.json(historyItem);
  } catch (error) {
    console.error('Error fetching history item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create history item
exports.createHistoryItem = async (req, res) => {
  console.log('Received request to create history item with body:', req.body);
  
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.error('Validation errors:', errors.array());
    return res.status(400).json({ 
      success: false,
      message: 'Validation failed',
      errors: errors.array() 
    });
  }

  try {
    const { year, title, content, image_url, display_order } = req.body;
    
    // Basic validation with detailed error messages
    if (!year) {
      return res.status(400).json({
        success: false,
        message: 'Year is a required field',
        field: 'year'
      });
    }
    
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is a required field',
        field: 'title'
      });
    }
    
    if (!content) {
      return res.status(400).json({
        success: false,
        message: 'Content is a required field',
        field: 'content'
      });
    }

    console.log('Creating history item with data:', {
      year: parseInt(year),
      title: title.trim(),
      content: content.trim(),
      image_url: image_url ? image_url.trim() : null,
      display_order: display_order ? parseInt(display_order) : 0
    });

    const historyItem = await ChurchHistory.create({
      year: parseInt(year),
      title: title.trim(),
      content: content.trim(),
      image_url: image_url ? image_url.trim() : null,
      display_order: display_order ? parseInt(display_order) : 0
    });
    
    console.log('Successfully created history item:', historyItem);
    
    res.status(201).json({
      success: true,
      data: historyItem
    });
    
  } catch (error) {
    console.error('Error creating history item:', {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      originalError: error.original ? error.original.message : null
    });
    
    if (error.name === 'SequelizeDatabaseError') {
      return res.status(400).json({
        success: false,
        message: 'Database error occurred',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Invalid data provided'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create history item',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
};

// Update history item
exports.updateHistoryItem = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const historyItem = await ChurchHistory.update(req.params.id, req.body);
    if (!historyItem) {
      return res.status(404).json({ message: 'History item not found' });
    }
    res.json(historyItem);
  } catch (error) {
    console.error('Error updating history item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete history item
exports.deleteHistoryItem = async (req, res) => {
  try {
    const historyItem = await ChurchHistory.destroy(req.params.id);
    if (!historyItem) {
      return res.status(404).json({ message: 'History item not found' });
    }
    res.json({ message: 'History item deleted successfully' });
  } catch (error) {
    console.error('Error deleting history item:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
