// backend/controllers/pastorInfoController.js
const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Get all pastors
exports.getAllPastors = async (req, res) => {
  try {
    const query = `
      SELECT * FROM pastor_info
      ORDER BY display_order ASC, pastor_name ASC
    `;
    const { rows } = await db.query(query);
    
    res.status(200).json({
      status: 'success',
      data: rows,
    });
  } catch (error) {
    console.error('Error fetching pastors:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch pastors',
    });
  }
};

// Get single pastor by ID
exports.getPastorById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const query = 'SELECT * FROM pastor_info WHERE id = $1';
    const { rows } = await db.query(query, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Pastor not found',
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: rows[0],
    });
  } catch (error) {
    console.error('Error fetching pastor:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch pastor',
    });
  }
};

// Create or update pastor
exports.createOrUpdatePastor = async (req, res) => {
  try {
    const {
      id,
      pastor_name,
      pastor_title,
      pastor_message,
      pastor_bio,
      pastor_photo_url,
      pastor_email,
      pastor_phone,
      is_active = true,
      display_order = 0,
    } = req.body;
    
    // Validate required fields
    if (!pastor_name || !pastor_title) {
      return res.status(400).json({
        status: 'error',
        message: 'Name and title are required',
      });
    }
    
    let result;
    
    if (id) {
      // Update existing pastor
      const updateQuery = `
        UPDATE pastor_info
        SET 
          pastor_name = $1,
          pastor_title = $2,
          pastor_message = $3,
          pastor_bio = $4,
          pastor_photo_url = $5,
          pastor_email = $6,
          pastor_phone = $7,
          is_active = $8,
          display_order = $9,
          updated_at = CURRENT_TIMESTAMP
        WHERE id = $10
        RETURNING *
      `;
      
      result = await db.query(updateQuery, [
        pastor_name,
        pastor_title,
        pastor_message || null,
        pastor_bio || null,
        pastor_photo_url || null,
        pastor_email || null,
        pastor_phone || null,
        is_active,
        display_order,
        id,
      ]);
    } else {
      // Create new pastor
      const insertQuery = `
        INSERT INTO pastor_info (
          id,
          pastor_name,
          pastor_title,
          pastor_message,
          pastor_bio,
          pastor_photo_url,
          pastor_email,
          pastor_phone,
          is_active,
          display_order
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;
      
      const newId = uuidv4();
      
      result = await db.query(insertQuery, [
        newId,
        pastor_name,
        pastor_title,
        pastor_message || null,
        pastor_bio || null,
        pastor_photo_url || null,
        pastor_email || null,
        pastor_phone || null,
        is_active,
        display_order,
      ]);
    }
    
    res.status(200).json({
      status: 'success',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('Error saving pastor:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to save pastor',
    });
  }
};

// Delete pastor
exports.deletePastor = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleteQuery = 'DELETE FROM pastor_info WHERE id = $1 RETURNING id';
    const result = await db.query(deleteQuery, [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'Pastor not found',
      });
    }
    
    res.status(200).json({
      status: 'success',
      message: 'Pastor deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting pastor:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete pastor',
    });
  }
};