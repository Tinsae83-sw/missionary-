const { validationResult } = require('express-validator');
const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Helper function to handle database errors
const handleDatabaseError = (res, error, message = 'Database error') => {
  console.error(`${message}:`, error);
  return res.status(500).json({
    status: 'error',
    message: 'An error occurred while processing your request'
  });
};

// @desc    Get all sermons with filters and pagination
// @route   GET /api/sermons
// @access  Public
exports.getSermons = async (req, res) => {
    try {
        let { 
            page = 1, 
            limit = 10, 
            search = '', 
            speaker, 
            bible_passage,
            startDate, 
            endDate, 
            is_published,
            is_featured,
            sortBy = 'sermon_date',
            order = 'DESC'
        } = req.query;

        // Convert page and limit to numbers
        page = parseInt(page);
        limit = parseInt(limit);
        const offset = (page - 1) * limit;

        // Build WHERE clause
        let whereClause = 'WHERE 1=1';
        const params = {};
        
        // Add search condition
        if (search) {
            whereClause += ` AND (title ILIKE :search OR description ILIKE :search OR speaker ILIKE :search OR bible_passage ILIKE :search OR transcript ILIKE :search)`;
            params.search = `%${search}%`;
        }
        
        // Filter by speaker
        if (speaker) {
            whereClause += ` AND speaker ILIKE :speaker`;
            params.speaker = `%${speaker}%`;
        }
        
        // Filter by bible passage
        if (bible_passage) {
            whereClause += ` AND bible_passage ILIKE :bible_passage`;
            params.bible_passage = `%${bible_passage}%`;
        }
        
        // Filter by date range
        if (startDate && endDate) {
            whereClause += ` AND sermon_date BETWEEN :startDate AND :endDate`;
            params.startDate = new Date(startDate).toISOString().split('T')[0];
            params.endDate = new Date(endDate).toISOString().split('T')[0];
        } else if (startDate) {
            whereClause += ` AND sermon_date >= :startDate`;
            params.startDate = new Date(startDate).toISOString().split('T')[0];
        } else if (endDate) {
            whereClause += ` AND sermon_date <= :endDate`;
            params.endDate = new Date(endDate).toISOString().split('T')[0];
        }
        
        // Filter by published status - handle both string 'true'/'false' and boolean true/false
        if (is_published !== undefined) {
            whereClause += ` AND is_published = :is_published`;
            params.is_published = is_published === 'true' || is_published === true;
        }
        
        // Filter by featured status
        if (is_featured !== undefined) {
            whereClause += ` AND is_featured = :is_featured`;
            params.is_featured = is_featured === 'true' || is_featured === true;
        }
        
        // Validate sort field and order
        const validSortFields = ['sermon_date', 'title', 'speaker', 'view_count', 'like_count', 'created_at'];
        const sortField = validSortFields.includes(sortBy) ? sortBy : 'sermon_date';
        const sortOrder = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        // Get total count for pagination
        const countQuery = `SELECT COUNT(*) FROM sermons ${whereClause}`;
        const countResult = await db.query(countQuery, { ...params });
        const totalCount = parseInt(countResult.rows[0].count);

        // Build the main query with proper parameterization
        let query = `
            SELECT * FROM sermons 
            ${whereClause}
            ORDER BY ${sortField} ${sortOrder}
        `;
        
        // Add pagination with parameters
        if (limit > 0) {
            query += ` LIMIT :limit OFFSET :offset`;
            params.limit = limit;
            params.offset = offset;
        }
        
        // Clone params to avoid modifying the original object
        const queryParams = { ...params };
        
        // Remove any undefined parameters to avoid SQL errors
        Object.keys(queryParams).forEach(key => {
            if (queryParams[key] === undefined) {
                delete queryParams[key];
            }
        });
        
        const result = await db.query(query, queryParams);
        
        res.json({
            success: true,
            count: totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: page,
            data: result.rows
        });
    } catch (error) {
        console.error('Error fetching sermons:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch sermons',
            error: error.message
        });
    }
};

// @desc    Get single sermon by ID
// @route   GET /api/sermons/:id
// @access  Public
exports.getSermon = async (req, res) => {
    try {
        const query = 'SELECT * FROM sermons WHERE id = $1';
        const result = await db.query(query, [req.params.id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Sermon not found'
            });
        }
        
        const sermon = result.rows[0];
        
        // Increment view count
        const updateQuery = 'UPDATE sermons SET view_count = view_count + 1, updated_at = $1 WHERE id = $2';
        await db.query(updateQuery, [new Date().toISOString(), req.params.id]);
        
        res.json({
            success: true,
            data: {
                ...sermon,
                view_count: sermon.view_count + 1 // Return updated view count
            }
        });
    } catch (error) {
        console.error('Error fetching sermon:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch sermon',
            error: error.message
        });
    }
};

// @desc    Create new sermon
// @route   POST /api/sermons
// @access  Private/Admin
exports.createSermon = async (req, res) => {
    // Log the incoming request body for debugging
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    
    // Validate required fields
    const requiredFields = ['title', 'speaker', 'bible_passage', 'sermon_date'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
        return res.status(400).json({
            success: false,
            message: 'Missing required fields',
            missingFields: missingFields
        });
    }
    
    const client = await db.getConnection();
    
    try {
        await client.query('BEGIN');
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            await client.query('ROLLBACK');
            return res.status(400).json({ 
                success: false,
                message: 'Validation failed',
                errors: errors.array() 
            });
        }

        const {
            title,
            speaker,
            bible_passage,
            sermon_date,
            description,
            transcript,
            thumbnail_url,
            is_published = true,
            is_featured = false,
            video_url = null,
            audio_url = null,
            duration = 0
        } = req.body;

        const sermonId = uuidv4();
        const now = new Date().toISOString();

        // First, check if the sermons table exists
        const tableCheck = await client.query(
            "SELECT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'sermons')"
        );
        
        if (!tableCheck.rows[0].exists) {
            throw new Error('sermons table does not exist');
        }
        
        // Create sermon
        const query = `
            INSERT INTO sermons (
                id, title, speaker, bible_passage, sermon_date, 
                description, transcript, thumbnail_url, video_url, 
                audio_url, is_published, is_featured, duration,
                created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            RETURNING *
        `;

        const values = [
            sermonId,
            title,
            speaker,
            bible_passage,
            sermon_date,
            description || null,
            transcript || null,
            thumbnail_url || null,
            video_url || null,
            audio_url || null,
            Boolean(is_published),
            Boolean(is_featured),
            duration ? parseInt(duration) : 0,
            now,
            now
        ];

        console.log('Executing query:', query);
        console.log('With values:', values);
        
        const result = await client.query(query, values);
        await client.query('COMMIT');
        
        // Get the newly created sermon
        const getSermonQuery = 'SELECT * FROM sermons WHERE id = ?';
        const sermonResult = await client.query(getSermonQuery, [sermonId]);
        
        if (!sermonResult.rows || sermonResult.rows.length === 0) {
            throw new Error('Failed to retrieve created sermon');
        }
        
        res.status(201).json({
            success: true,
            data: sermonResult.rows[0]
        });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error creating sermon:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ 
            success: false,
            message: 'Failed to create sermon',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    } finally {
        client.release();
    }
};

// @desc    Update sermon
// @route   PUT /api/sermons/:id
// @access  Private/Admin
exports.updateSermon = async (req, res) => {
    const client = await db.getConnection();
    
    try {
        await client.beginTransaction();
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            await client.rollback();
            return res.status(400).json({ 
                success: false,
                errors: errors.array() 
            });
        }

        // Check if sermon exists
        const checkQuery = 'SELECT * FROM sermons WHERE id = $1';
        const checkResult = await client.execute(checkQuery, [req.params.id]);
        
        if (checkResult[0].length === 0) {
            await client.rollback();
            return res.status(404).json({
                success: false,
                message: 'Sermon not found'
            });
        }

        const sermon = checkResult[0][0];
        const now = new Date().toISOString();
        
        // Prepare update fields
        const updateFields = [];
        const values = [];
        let paramCount = 1;

        // Add fields to update
        const fields = [
            'title', 'speaker', 'bible_passage', 'sermon_date', 
            'description', 'transcript', 'thumbnail_url', 'video_url',
            'audio_url', 'is_published', 'is_featured', 'duration'
        ];

        fields.forEach(field => {
            if (req.body[field] !== undefined) {
                updateFields.push(`${field} = $${paramCount}`);
                values.push(req.body[field]);
                paramCount++;
            }
        });

        // Add updated_at
        updateFields.push(`updated_at = $${paramCount}`);
        values.push(now);
        paramCount++;

        // Add ID for WHERE clause
        values.push(req.params.id);

        const updateQuery = `
            UPDATE sermons 
            SET ${updateFields.join(', ')}
            WHERE id = $${paramCount}
            RETURNING *
        `;

        const result = await client.execute(updateQuery, values);
        await client.commit();
        
        res.json({
            success: true,
            data: result[0][0]
        });
    } catch (error) {
        await client.rollback();
        console.error('Error updating sermon:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to update sermon',
            error: error.message 
        });
    } finally {
        client.release();
    }
};

// @desc    Delete sermon
// @route   DELETE /api/sermons/:id
// @access  Private/Admin
exports.deleteSermon = async (req, res) => {
    const client = await db.getConnection();
    
    try {
        await client.beginTransaction();
        
        // Check if sermon exists
        const checkQuery = 'SELECT * FROM sermons WHERE id = $1';
        const checkResult = await client.execute(checkQuery, [req.params.id]);
        
        if (checkResult[0].length === 0) {
            await client.rollback();
            return res.status(404).json({
                success: false,
                message: 'Sermon not found'
            });
        }

        const deleteQuery = 'DELETE FROM sermons WHERE id = $1';
        await client.execute(deleteQuery, [req.params.id]);
        await client.commit();
        
        res.json({
            success: true,
            message: 'Sermon deleted successfully',
            data: { id: req.params.id }
        });
    } catch (error) {
        await client.rollback();
        console.error('Error deleting sermon:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to delete sermon',
            error: error.message 
        });
    } finally {
        client.release();
    }
};

// @desc    Increment download count
// @route   PUT /api/sermons/:id/download
// @access  Public
exports.incrementDownloadCount = async (req, res) => {
    const client = await db.getConnection();
    
    try {
        await client.beginTransaction();
        
        // Check if sermon exists
        const checkQuery = 'SELECT * FROM sermons WHERE id = $1';
        const checkResult = await client.execute(checkQuery, [req.params.id]);
        
        if (checkResult[0].length === 0) {
            await client.rollback();
            return res.status(404).json({
                success: false,
                message: 'Sermon not found'
            });
        }

        const updateQuery = 'UPDATE sermons SET download_count = download_count + 1, updated_at = $1 WHERE id = $2';
        await client.execute(updateQuery, [new Date().toISOString(), req.params.id]);
        await client.commit();
        
        res.json({
            success: true,
            message: 'Download count updated'
        });
    } catch (error) {
        await client.rollback();
        console.error('Error incrementing download count:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to update download count',
            error: error.message 
        });
    } finally {
        client.release();
    }
};

// @desc    Toggle like status for a sermon
// @route   POST /api/sermons/:id/like
// @access  Public
exports.toggleLike = async (req, res) => {
    const client = await db.getConnection();
    
    try {
        await client.beginTransaction();
        
        // Check if sermon exists
        const checkQuery = 'SELECT * FROM sermons WHERE id = $1';
        const checkResult = await client.execute(checkQuery, [req.params.id]);
        
        if (checkResult[0].length === 0) {
            await client.rollback();
            return res.status(404).json({
                success: false,
                message: 'Sermon not found'
            });
        }

        const sermon = checkResult[0][0];
        const { action } = req.body;
        const incrementValue = action === 'like' ? 1 : -1;
        const newLikeCount = Math.max(0, sermon.like_count + incrementValue);

        const updateQuery = 'UPDATE sermons SET like_count = $1, updated_at = $2 WHERE id = $3';
        await client.execute(updateQuery, [newLikeCount, new Date().toISOString(), req.params.id]);
        await client.commit();
        
        res.json({
            success: true,
            message: `Sermon ${action}d successfully`,
            like_count: newLikeCount
        });
    } catch (error) {
        await client.rollback();
        console.error('Error toggling like:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to update like status',
            error: error.message 
        });
    } finally {
        client.release();
    }
};

// @desc    Increment share count for a sermon
// @route   POST /api/sermons/:id/share
// @access  Public
exports.incrementShareCount = async (req, res) => {
    const client = await db.getConnection();
    
    try {
        await client.beginTransaction();
        
        // Get current share count with row-level lock
        const getQuery = 'SELECT share_count FROM sermons WHERE id = $1 FOR UPDATE';
        const result = await client.execute(getQuery, [req.params.id]);
        
        if (result[0].length === 0) {
            await client.rollback();
            return res.status(404).json({
                success: false,
                message: 'Sermon not found'
            });
        }

        const currentCount = result[0][0].share_count || 0;
        const newCount = currentCount + 1;
        const { platform = 'other' } = req.body;

        // Update share count
        const updateQuery = `
            UPDATE sermons 
            SET share_count = $1, updated_at = $2 
            WHERE id = $3 
            RETURNING share_count
        `;
        const updateResult = await client.execute(updateQuery, [newCount, new Date().toISOString(), req.params.id]);
        
        // Here you could also track which platforms are being used for sharing
        // For example, you could have a separate table for share analytics
        const shareAnalyticsQuery = `
            INSERT INTO share_analytics (sermon_id, platform, shared_at)
            VALUES ($1, $2, $3)
        `;
        
        try {
            await client.execute(shareAnalyticsQuery, [
                req.params.id, 
                platform, 
                new Date().toISOString()
            ]);
        } catch (analyticsError) {
            // Log but don't fail the request if analytics fails
            console.error('Error recording share analytics:', analyticsError);
        }
        
        await client.commit();
        
        res.json({
            success: true,
            share_count: updateResult[0][0].share_count,
            platform
        });
    } catch (error) {
        await client.rollback();
        console.error('Error incrementing share count:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to increment share count',
            error: error.message
        });
    } finally {
        client.release();
    }
};
