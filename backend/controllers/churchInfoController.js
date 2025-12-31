const { Op } = require('sequelize');
const { sequelize } = require('../config/database');
const { ChurchInfo } = require('../models');
const { validationResult } = require('express-validator');

// Helper function to convert snake_case to camelCase
const toCamelCase = (obj) => {
  if (!obj) return null;
  
  if (Array.isArray(obj)) {
    return obj.map(item => toCamelCase(item));
  } else if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/(_\w)/g, k => k[1].toUpperCase());
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {});
  }
  return obj;
};

// Helper function to convert camelCase to snake_case
const toSnakeCase = (obj) => {
  if (!obj) return null;
  
  if (Array.isArray(obj)) {
    return obj.map(item => toSnakeCase(item));
  } else if (obj !== null && typeof obj === 'object' && !(obj instanceof Date)) {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      result[snakeKey] = toSnakeCase(obj[key]);
      return result;
    }, {});
  }
  return obj;
};

// Get church information
exports.getChurchInfo = async (req, res) => {
  try {
    let churchInfo = await ChurchInfo.findOne();
    
    if (!churchInfo) {
      // Create default church info if none exists
      churchInfo = await ChurchInfo.create({
        name: 'Your Church Name',
        country: 'USA',
      });
    }
    
    // Convert snake_case to camelCase for the frontend
    const response = toCamelCase(churchInfo.get({ plain: true }));
    res.json(response);
  } catch (error) {
    console.error('Error in getChurchInfo:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to fetch church information',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Create or update church information
exports.updateChurchInfo = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      status: 'error',
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  try {
    // Convert camelCase to snake_case for database
    const churchData = toSnakeCase(req.body);
    
    // Remove any undefined values
    Object.keys(churchData).forEach(key => churchData[key] === undefined && delete churchData[key]);
    
    // Check if there's an existing record
    let churchInfo = await ChurchInfo.findOne();
    
    if (churchInfo) {
      // Update existing record
      await churchInfo.update(churchData);
    } else {
      // Create new record if none exists
      churchInfo = await ChurchInfo.create(churchData);
    }

    // Get the updated record
    const updatedInfo = await ChurchInfo.findByPk(churchInfo.id);
    
    // Convert snake_case to camelCase for the response
    const response = toCamelCase(updatedInfo.get({ plain: true }));
    
    res.json({
      status: 'success',
      message: 'Church information updated successfully',
      data: response
    });
    
  } catch (error) {
    console.error('Error in updateChurchInfo:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to save church information',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
