const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const db = require('../models');
const Ministry = db.Ministry;
const { ValidationError } = require('sequelize');
const { createUploadMiddleware, deleteUploadedFile, getFileFromUrl } = require('../middleware/upload');

// Create upload middleware for ministries
const uploadMiddleware = createUploadMiddleware('ministries', {
  fieldName: 'file',
  required: false
});

// Helper function to prepare ministry data
const prepareMinistryData = (data, fileInfo) => {
  const ministryData = {
    name: data.name || '',
    description: data.description || '',
    short_description: data.short_description || '',
    contact_email: data.contact_email || '',
    contact_phone: data.contact_phone || '',
    contact_person: data.contact_person || '',
    meeting_times: data.meeting_times || '',
    meeting_location: data.meeting_location || '',
    icon_class: data.icon_class || '',
    is_active: data.is_active === 'false' ? false : true,
    display_order: parseInt(data.display_order) || 0
  };

  // Handle file upload
  if (fileInfo) {
    ministryData.cover_image_url = fileInfo.url;
  } else if (data.cover_image_url && data.cover_image_url.trim() !== '') {
    ministryData.cover_image_url = data.cover_image_url;
  }

  return ministryData;
};

// Create a new ministry
router.post('/', ...uploadMiddleware, async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    console.log('📥 Received request to create ministry:', {
      body: req.body,
      file: req.processedFile
    });

    // Validate required fields
    if (!req.body.name || !req.body.description) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: [
          ...(!req.body.name ? [{ field: 'name', message: 'Name is required' }] : []),
          ...(!req.body.description ? [{ field: 'description', message: 'Description is required' }] : [])
        ]
      });
    }

    // Prepare ministry data
    const ministryData = prepareMinistryData(req.body, req.processedFile);

    // Set default display order if not provided
    if (!ministryData.display_order) {
      const maxOrder = await Ministry.max('display_order', { transaction }) || 0;
      ministryData.display_order = maxOrder + 1;
    }

    console.log('💾 Creating ministry with data:', {
      name: ministryData.name,
      display_order: ministryData.display_order,
      hasImage: !!ministryData.cover_image_url
    });

    const ministry = await Ministry.create(ministryData, { transaction });
    await transaction.commit();

    console.log('✅ Ministry created successfully:', ministry.id);
    res.status(201).json({
      success: true,
      data: ministry,
      message: 'Ministry created successfully'
    });

  } catch (error) {
    await transaction.rollback();
    
    // Clean up uploaded file if creation fails
    if (req.processedFile && req.processedFile.filepath) {
      await deleteUploadedFile(req.processedFile.filepath);
    }
    
    console.error('❌ Error creating ministry:', error);

    if (error instanceof ValidationError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => ({
          field: e.path,
          message: e.message
        }))
      });
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update a ministry
router.put('/:id', ...uploadMiddleware, async (req, res) => {
  const transaction = await db.sequelize.transaction();
  
  try {
    const ministry = await Ministry.findByPk(req.params.id, { transaction });
    if (!ministry) {
      await transaction.rollback();
      return res.status(404).json({ success: false, message: 'Ministry not found' });
    }

    // Prepare ministry data
    const ministryData = prepareMinistryData(req.body, req.processedFile);

    // Handle file upload - delete old file if new one uploaded
    if (req.processedFile && ministry.cover_image_url) {
      const oldFileInfo = getFileFromUrl(ministry.cover_image_url);
      if (oldFileInfo && oldFileInfo.path) {
        try {
          await deleteUploadedFile(oldFileInfo.path);
          console.log('🗑️ Deleted old ministry image:', oldFileInfo.path);
        } catch (fileError) {
          console.error('Error deleting old file:', fileError);
          // Continue even if file deletion fails
        }
      }
    }

    await ministry.update(ministryData, { transaction });
    await transaction.commit();
    
    res.json({
      success: true,
      data: ministry,
      message: 'Ministry updated successfully'
    });

  } catch (error) {
    await transaction.rollback();
    
    // Clean up uploaded file if update fails
    if (req.processedFile && req.processedFile.filepath) {
      await deleteUploadedFile(req.processedFile.filepath);
    }
    
    console.error('Error updating ministry:', error);
    
    if (error instanceof ValidationError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => ({ field: e.path, message: e.message }))
      });
    }
    
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get all ministries
router.get('/', async (req, res) => {
  try {
    const { active, limit, offset, sortBy = 'display_order', sortOrder = 'ASC' } = req.query;
    const where = {};
    if (active === 'true') where.is_active = true;

    const options = {
      where,
      order: [[sortBy, sortOrder.toUpperCase()], ['name', 'ASC']],
      attributes: { exclude: ['created_at', 'updated_at'] }
    };
    if (limit) options.limit = parseInt(limit, 10);
    if (offset) options.offset = parseInt(offset, 10);

    const { count, rows } = await Ministry.findAndCountAll(options);
    res.set('X-Total-Count', count);
    res.json(rows);
  } catch (error) {
    console.error('Error fetching ministries:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get active ministries
router.get('/active', async (req, res) => {
  try {
    const ministries = await Ministry.findAll({
      where: { is_active: true },
      order: [['display_order', 'ASC'], ['name', 'ASC']],
      attributes: { exclude: ['created_at', 'updated_at'] }
    });
    res.json(ministries);
  } catch (error) {
    console.error('Error fetching active ministries:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Get a ministry by id
router.get('/:id', async (req, res) => {
  try {
    const ministry = await Ministry.findByPk(req.params.id, {
      attributes: { exclude: ['created_at', 'updated_at'] }
    });
    if (!ministry) return res.status(404).json({ success: false, message: 'Ministry not found' });
    res.json(ministry);
  } catch (error) {
    console.error('Error fetching ministry:', error);
    if (error.name === 'SequelizeDatabaseError' && error.message.includes('invalid input syntax for type uuid')) {
      return res.status(400).json({ success: false, message: 'Invalid ID format' });
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Delete a ministry
router.delete('/:id', async (req, res) => {
  try {
    const ministry = await Ministry.findByPk(req.params.id);
    if (!ministry) return res.status(404).json({ success: false, message: 'Ministry not found' });

    // Delete associated file if exists
    if (ministry.cover_image_url) {
      const fileInfo = getFileFromUrl(ministry.cover_image_url);
      if (fileInfo && fileInfo.path) {
        try {
          await deleteUploadedFile(fileInfo.path);
          console.log('🗑️ Deleted ministry image:', fileInfo.path);
        } catch (fileError) {
          console.error('Error deleting file:', fileError);
          // Continue even if file deletion fails
        }
      }
    }

    await ministry.destroy();
    res.json({ success: true, message: 'Ministry deleted' });
  } catch (error) {
    console.error('Error deleting ministry:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;