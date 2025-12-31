const { CoreValue } = require('../models');
const { validationResult } = require('express-validator');

// Get all core values
exports.getAllCoreValues = async (req, res) => {
  try {
    const coreValues = await CoreValue.findAll({
      order: [['display_order', 'ASC']],
    });
    res.json(coreValues);
  } catch (error) {
    console.error('Error fetching core values:', error);
    res.status(500).json({ message: 'Error fetching core values', error: error.message });
  }
};

// Get a single core value by ID
exports.getCoreValueById = async (req, res) => {
  try {
    const coreValue = await CoreValue.findByPk(req.params.id);
    if (!coreValue) {
      return res.status(404).json({ message: 'Core value not found' });
    }
    res.json(coreValue);
  } catch (error) {
    console.error('Error fetching core value:', error);
    res.status(500).json({ message: 'Error fetching core value', error: error.message });
  }
};

// Create a new core value
exports.createCoreValue = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, icon_class, display_order, is_published = true } = req.body;
    
    const coreValue = await CoreValue.create({
      title,
      description,
      icon_class: icon_class || 'fas fa-heart',
      display_order: display_order || 0,
      is_published: is_published !== undefined ? is_published : true,
    });

    res.status(201).json(coreValue);
  } catch (error) {
    console.error('Error creating core value:', error);
    res.status(500).json({ message: 'Failed to create core value', error: error.message });
  }
};

// Update a core value
exports.updateCoreValue = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const coreValue = await CoreValue.findByPk(req.params.id);
    if (!coreValue) {
      return res.status(404).json({ message: 'Core value not found' });
    }

    const { title, description, icon_class, display_order, is_published } = req.body;
    
    await coreValue.update({
      title: title || coreValue.title,
      description: description || coreValue.description,
      icon_class: icon_class || coreValue.icon_class,
      display_order: display_order !== undefined ? display_order : coreValue.display_order,
      is_published: is_published !== undefined ? is_published : coreValue.is_published,
    });

    res.json(coreValue);
  } catch (error) {
    console.error('Error updating core value:', error);
    res.status(500).json({ message: 'Error updating core value', error: error.message });
  }
};

// Delete a core value
exports.deleteCoreValue = async (req, res) => {
  try {
    const coreValue = await CoreValue.findByPk(req.params.id);
    if (!coreValue) {
      return res.status(404).json({ message: 'Core value not found' });
    }

    await coreValue.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting core value:', error);
    res.status(500).json({ message: 'Error deleting core value', error: error.message });
  }
};
