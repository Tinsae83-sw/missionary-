const { Belief } = require('../models');
const { validationResult } = require('express-validator');

// Get all beliefs
const getAllBeliefs = async (req, res) => {
  try {
    const beliefs = await Belief.findAll({
      order: [['display_order', 'ASC']],
    });
    res.json(beliefs);
  } catch (error) {
    console.error('Error fetching beliefs:', error);
    res.status(500).json({ message: 'Error fetching beliefs', error: error.message });
  }
};

// Get a single belief by ID
const getBeliefById = async (req, res) => {
  try {
    const belief = await Belief.findByPk(req.params.id);
    if (!belief) {
      return res.status(404).json({ message: 'Belief not found' });
    }
    res.json(belief);
  } catch (error) {
    console.error('Error fetching belief:', error);
    res.status(500).json({ message: 'Error fetching belief', error: error.message });
  }
};

// Create a new belief
const createBelief = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, icon_class, display_order, is_published = true } = req.body;
    
    const belief = await Belief.create({
      title,
      description,
      icon_class: icon_class || 'fas fa-cross',
      display_order: display_order || 0,
      is_published: is_published !== undefined ? is_published : true,
    });

    res.status(201).json(belief);
  } catch (error) {
    console.error('Error creating belief:', error);
    res.status(500).json({ message: 'Failed to create belief', error: error.message });
  }
};

// Update a belief
const updateBelief = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const belief = await Belief.findByPk(req.params.id);
    if (!belief) {
      return res.status(404).json({ message: 'Belief not found' });
    }

    const { title, description, icon_class, display_order, is_published } = req.body;
    
    await belief.update({
      title: title || belief.title,
      description: description || belief.description,
      icon_class: icon_class || belief.icon_class,
      display_order: display_order !== undefined ? display_order : belief.display_order,
      is_published: is_published !== undefined ? is_published : belief.is_published,
    });

    res.json(belief);
  } catch (error) {
    console.error('Error updating belief:', error);
    res.status(500).json({ message: 'Error updating belief', error: error.message });
  }
};

// Delete a belief
const deleteBelief = async (req, res) => {
  try {
    const belief = await Belief.findByPk(req.params.id);
    if (!belief) {
      return res.status(404).json({ message: 'Belief not found' });
    }

    await belief.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting belief:', error);
    res.status(500).json({ message: 'Error deleting belief', error: error.message });
  }
};

module.exports = {
  getAllBeliefs,
  getBeliefById,
  createBelief,
  updateBelief,
  deleteBelief,
};
